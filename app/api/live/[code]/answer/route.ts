import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWorksheet, SubjectId, Difficulty } from "@/lib/subjects";
import { answersMatch } from "@/lib/challenge";

export async function POST(req: Request, { params }: { params: { code: string } }) {
  const liveSession = await prisma.liveSession.findUnique({ where: { code: params.code.toUpperCase() } });
  if (!liveSession) return NextResponse.json({ error: "Session not found." }, { status: 404 });
  if (liveSession.status !== "active") {
    return NextResponse.json({ error: "This question isn't open right now." }, { status: 400 });
  }

  const { participantId, questionIndex, answer } = await req.json();
  const participant = await prisma.liveParticipant.findUnique({ where: { id: participantId } });
  if (!participant || participant.sessionId !== liveSession.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (questionIndex !== liveSession.currentIndex) {
    return NextResponse.json({ error: "That question has already moved on." }, { status: 400 });
  }

  // idempotent — a participant can only answer each question once
  const existing = await prisma.liveAnswer.findUnique({
    where: { participantId_questionIndex: { participantId, questionIndex } },
  });
  if (existing) return NextResponse.json({ error: "Already answered." }, { status: 400 });

  const questions = generateWorksheet({
    subject: liveSession.subject as SubjectId,
    grade: liveSession.grade,
    topic: liveSession.topic,
    difficulty: liveSession.difficulty as Difficulty,
    count: liveSession.questionCount,
    seed: liveSession.seed,
  });
  const correctQuestion = questions[questionIndex];
  const correct = correctQuestion ? answersMatch(correctQuestion.a, answer || "") : false;

  await prisma.liveAnswer.create({
    data: { participantId, questionIndex, submitted: answer || "", correct },
  });

  if (correct) {
    await prisma.liveParticipant.update({ where: { id: participantId }, data: { score: { increment: 1 } } });
  }

  return NextResponse.json({ correct });
}
