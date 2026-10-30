import { NextResponse } from "next/server";
import { sendTopicRequestEmail } from "@/lib/email";

// Light spam protection: a hidden "website" field bots fill in, plus a small
// per-IP limit (per server instance — enough to stop casual floods).
const recent = new Map<string, number[]>();
const LIMIT = 5, WINDOW_MS = 60 * 60 * 1000;

const SUBJECTS = ["math", "english", "science", "physics", "chemistry", "biology", "computer", "other", ""];
const ROLES = ["teacher", "parent", "student", "tutor", "other", ""];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.website) return NextResponse.json({ success: true }); // honeypot: pretend success

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    const now = Date.now();
    const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (hits.length >= LIMIT) return NextResponse.json({ error: "Thanks — we've got your requests. Please try again later." }, { status: 429 });
    hits.push(now); recent.set(ip, hits);

    const topic = String(body.topic || "").trim();
    const subject = SUBJECTS.includes(body.subject) ? body.subject : "";
    const grade = /^(1[0-2]|[1-9])$/.test(String(body.grade || "")) ? String(body.grade) : "";
    const role = ROLES.includes(body.role) ? body.role : "";
    // Never keep a student's email — younger users shouldn't share contact details.
    const email = body.role === "student" ? "" : String(body.email || "").trim();
    const page = String(body.page || "").slice(0, 200);

    if (topic.length < 3) return NextResponse.json({ error: "Please tell us which topic you need." }, { status: 400 });
    if (topic.length > 300) return NextResponse.json({ error: "Please keep it under 300 characters." }, { status: 400 });
    if (email && (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return NextResponse.json({ error: "That email address doesn't look right (or leave it blank)." }, { status: 400 });
    }

    // Also logged so requests are never lost if email isn't configured.
    console.log("[topic-request]", JSON.stringify({ topic, subject, grade, role, hasEmail: !!email, page }));
    const result = await sendTopicRequestEmail({ topic, subject, grade, role, email: email || undefined, page });
    if (!result.ok && !result.skipped) return NextResponse.json({ error: "Could not send your request right now. Please try again shortly." }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Topic request error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
