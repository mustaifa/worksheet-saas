import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorksheet, SubjectId, Difficulty } from "@/lib/subjects";
import { answersMatch, isPassingScore, pickRandomReward } from "@/lib/challenge";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "You must be signed in." }, { status: 401 });

  const { attemptId, answers } = await req.json();
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }

  const attempt = await prisma.challengeAttempt.findUnique({ where: { id: attemptId }, include: { child: true } });
  if (!attempt || attempt.child.parentId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (attempt.status === "completed") {
    return NextResponse.json({ error: "This challenge was already submitted." }, { status: 400 });
  }

  // regenerate the exact same question set from the stored seed to get the real answers
  const questions = generateWorksheet({
    subject: attempt.subject as SubjectId,
    grade: attempt.grade,
    topic: attempt.topic,
    difficulty: attempt.difficulty as Difficulty,
    count: attempt.count,
    seed: attempt.seed,
  });

  let score = 0;
  const results = questions.map((item, i) => {
    const correct = answersMatch(item.a, answers[i] || "");
    if (correct) score++;
    return { q: item.q, correctAnswer: item.a, submitted: answers[i] || "", correct };
  });

  const passed = isPassingScore(score, questions.length);

  await prisma.challengeAttempt.update({
    where: { id: attemptId },
    data: { status: "completed", score, passed, completedAt: new Date() },
  });

  let prize: string | null = null;
  if (passed) {
    prize = await pickRandomReward(attempt.childId, attempt.difficulty);
    if (prize) {
      await prisma.rewardClaim.create({
        data: { childId: attempt.childId, attemptId: attempt.id, prizeLabel: prize },
      });
    }
  }

  return NextResponse.json({ score, total: questions.length, passed, prize, results });
}
