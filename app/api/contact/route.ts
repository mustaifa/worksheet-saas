import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message || message.length < 5) {
      return NextResponse.json({ error: "Please fill in your name, email, and a short message." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }
    const result = await sendContactFormEmail(name, email, message);
    if (!result.ok && !result.skipped) {
      return NextResponse.json({ error: "Could not send your message right now. Please try again shortly." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
