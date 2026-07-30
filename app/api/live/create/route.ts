import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/live";
import { generateWorksheet, SubjectId, Difficulty } from "@/lib/subjects";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { subject, grade, topic, difficulty } = await req.json();
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 });
  }

  const seed = Math.floor(Math.random() * 2147483647);
  const count = 10;

  // sanity-check the combination actually produces questions before creating the session
  const preview = generateWorksheet({ subject: subject as SubjectId, grade: parseInt(grade, 10), topic, difficulty: difficulty as Difficulty, count, seed });
  if (preview.length === 0) {
    return NextResponse.json({ error: "Could not generate that quiz — try a different topic." }, { status: 400 });
  }
  if (preview[0]?.passage) {
    return NextResponse.json({ error: "Reading comprehension isn't available for live quizzes yet — pick another topic." }, { status: 400 });
  }

  const code = await generateUniqueCode();

  const liveSession = await prisma.liveSession.create({
    data: {
      hostUserId: (session.user as any).id,
      code,
      subject,
      grade: parseInt(grade, 10),
      topic,
      difficulty,
      seed,
      questionCount: preview.length,
    },
  });

  return NextResponse.json({ code: liveSession.code });
}
