/**
 * Sends the smallest possible request to the Anthropic API with the same key
 * and model the tutor and scanner use, and reports exactly why it fails.
 * Never returns the key itself.
 */
export type AiHealth = {
  ok: boolean;
  model: string;
  keyConfigured: boolean;
  status?: number;
  errorType?: string;
  message?: string;
  hint?: string;
};

const HINTS: Record<string, string> = {
  authentication_error: "The API key is invalid or has been revoked. Create a new key in the Anthropic Console and update ANTHROPIC_API_KEY in Vercel, then redeploy.",
  permission_error: "The API key doesn't have permission for this model or workspace. Check the key's workspace in the Anthropic Console.",
  not_found_error: "The model name isn't available. Remove ANTHROPIC_MODEL in Vercel (to use the default) or set it to a current model ID.",
  rate_limit_error: "The account hit its rate limit. Try again shortly, or raise limits in the Anthropic Console.",
  overloaded_error: "Anthropic is temporarily overloaded. Try again in a few minutes.",
  billing_error: "The Anthropic account has no remaining credit. Add credit under Billing in the Anthropic Console.",
};

export async function checkAnthropic(model?: string): Promise<AiHealth> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const usedModel = model || process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  if (!apiKey) {
    return { ok: false, model: usedModel, keyConfigured: false, hint: "ANTHROPIC_API_KEY is not set in Vercel." };
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({ model: usedModel, max_tokens: 1, messages: [{ role: "user", content: "ping" }] }),
      cache: "no-store",
    });
    if (res.ok) return { ok: true, model: usedModel, keyConfigured: true, status: res.status };
    let errorType = "unknown_error";
    let message = "";
    try {
      const body = await res.json();
      errorType = body?.error?.type || errorType;
      message = String(body?.error?.message || "").slice(0, 300);
    } catch {}
    // Out-of-credit comes back as invalid_request_error with a billing message.
    if (errorType === "invalid_request_error" && /credit balance/i.test(message)) errorType = "billing_error";
    return { ok: false, model: usedModel, keyConfigured: true, status: res.status, errorType, message, hint: HINTS[errorType] };
  } catch (err: any) {
    return { ok: false, model: usedModel, keyConfigured: true, errorType: "network_error", message: String(err?.message || err).slice(0, 300), hint: "The server couldn't reach api.anthropic.com." };
  }
}

/** Short, log-friendly description of a failed Anthropic response. */
export async function describeAnthropicError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return `${res.status} ${body?.error?.type || ""}: ${String(body?.error?.message || "").slice(0, 300)}`;
  } catch {
    return `${res.status}`;
  }
}
