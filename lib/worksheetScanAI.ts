import { ExtractedWorksheet } from "./worksheetScanTypes";

const SYSTEM_PROMPT = `You are a precise document transcription assistant. The user will send a photo of a worksheet they personally authored (their own original teaching material) that they want converted into a clean digital format.

Carefully transcribe every question, instruction, hint, table, and chart exactly as written. Do not summarize, do not change the wording, do not add or remove content. If something is genuinely illegible, make your best reasonable transcription rather than leaving it blank.

Return ONLY valid JSON matching this exact shape — no markdown formatting, no code fences, no explanation before or after it:

{
  "title": string,
  "studentInfoFields": string[] (e.g. ["Name", "Date", "Day"] — whatever fields appear near the top for the student to fill in),
  "sections": [
    {
      "number": string (the question number as written, e.g. "2"),
      "instructions": string (the main scenario/instruction text for this section),
      "table": { "headers": string[], "rows": string[][] } or null if there is no table,
      "subQuestions": [ { "label": string (e.g. "a)"), "text": string, "hint": string (omit this field entirely if there is no hint) } ],
      "chart": { "title": string, "xLabel": string, "yLabel": string, "categories": string[], "yMax": number, "legend": string[] (omit if no legend) } or null if there is no chart
    }
  ]
}

If a section has no sub-questions, subQuestions should be an empty array. If there are no sections at all, return an empty sections array.`;

export async function extractWorksheetFromImage(
  base64Data: string,
  mediaType: string
): Promise<{ data?: ExtractedWorksheet; error?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: "This feature isn't configured yet — missing API key." };
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
              { type: "text", text: "Transcribe this worksheet into the JSON format described in your instructions." },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic vision API error:", await res.text());
      return { error: "Could not read the image right now. Please try again." };
    }

    const responseData = await res.json();
    const textBlock = (responseData.content || []).find((b: any) => b.type === "text");
    if (!textBlock?.text) {
      return { error: "The AI didn't return any content. Try a clearer photo." };
    }

    // strip potential markdown code fences before parsing
    const cleaned = textBlock.text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();

    let parsed: ExtractedWorksheet;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse extraction JSON:", cleaned.slice(0, 500));
      return { error: "Could not understand the worksheet structure. Try a clearer or better-lit photo." };
    }

    if (!parsed.title || !Array.isArray(parsed.sections)) {
      return { error: "Extraction came back incomplete. Try a clearer photo." };
    }

    return { data: parsed };
  } catch (err) {
    console.error("Vision extraction request failed:", err);
    return { error: "Could not reach the AI service right now." };
  }
}
