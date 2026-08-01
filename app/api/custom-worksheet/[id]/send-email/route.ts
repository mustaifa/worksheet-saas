import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOwnedWorksheet } from "@/lib/customWorksheet";
import { sendCustomWorksheetEmail } from "@/lib/email";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const ws = await getOwnedWorksheet((session.user as any).id, params.id);
  if (!ws) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { emails } = await req.json();
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "Add at least one email address." }, { status: 400 });
  }
  if (emails.length > 50) {
    return NextResponse.json({ error: "That's a lot of emails at once — try 50 or fewer." }, { status: 400 });
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/w/${ws.shareCode}`;
  const teacherName = (session.user as any).name || null;

  const results = await Promise.all(
    emails.map((email: string) => sendCustomWorksheetEmail(email.trim(), teacherName, ws.title, shareUrl))
  );
  const failedCount = results.filter((r) => !r.ok && !r.skipped).length;

  return NextResponse.json({ sent: emails.length - failedCount, failed: failedCount });
}
