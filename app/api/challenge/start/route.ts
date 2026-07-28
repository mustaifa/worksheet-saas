import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOwnedChild } from "@/lib/family";
import { generateWorksheet, SubjectId, Difficulty } from "@/lib/subjects";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { childId, subject, grade, topic, difficulty } = await req.json();
  const child = await getOwnedChild((session.user as any).id, childId);
  if (!child) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty." }, { status: 400 });
  }

  const seed = Math.floor(Math.random() * 2147483647);
  const count = 10;
  const questions = generateWorksheet({
    subject: subject as SubjectId,
    grade: parseInt(grade, 10),
    topic,
    difficulty: difficulty as Difficulty,
    count,
    seed,
  });

  if (questions.length === 0) {
    return NextResponse.json({ error: "Could not generate that challenge — try a different topic." }, { status: 400 });
  }

  const attempt = await prisma.challengeAttempt.create({
    data: {
      childId,
      subject,
      grade: parseInt(grade, 10),
      topic,
      difficulty,
      seed,
      count: questions.length,
      status: "in_progress",
    },
  });

  // strip answers before sending to the client
  const questionsOnly = questions.map((q) => ({ q: q.q }));

  return NextResponse.json({ attemptId: attempt.id, questions: questionsOnly });
}
