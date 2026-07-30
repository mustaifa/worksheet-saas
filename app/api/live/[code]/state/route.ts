import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWorksheet, SubjectId, Difficulty, topicLabel } from "@/lib/subjects";

export async function GET(req: Request, { params }: { params: { code: string } }) {
  const liveSession = await prisma.liveSession.findUnique({
    where: { code: params.code.toUpperCase() },
    include: { participants: { orderBy: { score: "desc" } } },
  });
  if (!liveSession) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const questions = generateWorksheet({
    subject: liveSession.subject as SubjectId,
    grade: liveSession.grade,
    topic: liveSession.topic,
    difficulty: liveSession.difficulty as Difficulty,
    count: liveSession.questionCount,
    seed: liveSession.seed,
  });

  const current = questions[liveSession.currentIndex];

  return NextResponse.json({
    status: liveSession.status,
    currentIndex: liveSession.currentIndex,
    questionCount: liveSession.questionCount,
    showAnswer: liveSession.showAnswer,
    topicLabel: topicLabel(liveSession.subject as SubjectId, liveSession.topic),
    grade: liveSession.grade,
    subject: liveSession.subject,
    question: current ? current.q : null,
    correctAnswer: liveSession.showAnswer && current ? current.a : null,
    participants: liveSession.participants.map((p) => ({ id: p.id, nickname: p.nickname, score: p.score })),
  });
}
