import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const progress = await prisma.userQuizProgress.findMany({
            where: { userId: user.id },
            include: { category: true },
        });

        const formattedProgress = progress.map((p: any) => ({
            categoryId: p.categoryId,
            section: p.category.name,
            questionsDone: p.questionsDone,
            correctAnswers: p.correctAnswers,
            accuracy: p.questionsDone > 0 ? Math.round((p.correctAnswers / p.questionsDone) * 100) : 0,
        }));

        let totalQuestionsDone = 0;
        let totalCorrectAnswers = 0;

        formattedProgress.forEach((p: any) => {
            totalQuestionsDone += p.questionsDone;
            totalCorrectAnswers += p.correctAnswers;
        });

        const overallAccuracy = totalQuestionsDone > 0 ? Math.round((totalCorrectAnswers / totalQuestionsDone) * 100) : 0;

        const recentAttempts = await prisma.quizAttempt.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });

        console.log(`[API GET] Stats: ProgressRecords=${progress.length}, Attempts=${recentAttempts.length}`);

        return NextResponse.json({
            overall: {
                totalQuestionsDone,
                totalCorrectAnswers,
                overallAccuracy,
            },
            sections: formattedProgress,
            recentResults: recentAttempts,
        });

    } catch (error: any) {
        console.error('Error fetching quiz progress:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz progress', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { sectionBreakdown, difficulty, score, total, accuracy } = body;

        console.log(`[API POST] User: ${user.email} (${user.id})`);
        console.log(`[API POST] Payload:`, body);

        if (!sectionBreakdown || typeof sectionBreakdown !== 'object') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        console.log(`Processing update for user ${user.id}:`, sectionBreakdown);

        // sectionBreakdown looks like: { "Accounting": { correct: 3, total: 5 }, "Fit & Behavioral": { correct: 2, total: 2 } }
        for (const [sectionName, stats] of Object.entries(sectionBreakdown)) {
            const { correct: sectionCorrect, total: sectionTotal } = stats as { correct: number, total: number };

            console.log(`Working on section: ${sectionName}`, stats);

            // Find or create category
            let category = await prisma.quizCategory.findFirst({
                where: { name: sectionName }
            });

            if (!category) {
                console.log(`[API POST] Category '${sectionName}' not found. Creating it...`);
                category = await prisma.quizCategory.create({
                    data: {
                        name: sectionName,
                        slug: sectionName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                    }
                });
            }

            // Upsert progress
            const updated = await prisma.userQuizProgress.upsert({
                where: {
                    userId_categoryId: {
                        userId: user.id,
                        categoryId: category.id,
                    }
                },
                update: {
                    questionsDone: { increment: sectionTotal },
                    correctAnswers: { increment: sectionCorrect },
                },
                create: {
                    userId: user.id,
                    categoryId: category.id,
                    questionsDone: sectionTotal,
                    correctAnswers: sectionCorrect,
                }
            });
            console.log(`[API POST] Updated UserQuizProgress:`, updated.id);
        }

        // Record the overall attempt
        const sectionNames = Object.keys(sectionBreakdown);
        const attemptSection = sectionNames.length === 1 ? sectionNames[0] : "Mixed";

        try {
            console.log(`[API POST] Creating attempt record for session...`);
            const attempt = await prisma.quizAttempt.create({
                data: {
                    userId: user.id,
                    section: attemptSection,
                    difficulty: difficulty || "Beginner",
                    score: score || 0,
                    total: total || 0,
                    accuracy: accuracy || 0,
                }
            });
            console.log(`[API POST] Success creating QuizAttempt:`, attempt.id);
        } catch (attemptError) {
            console.error(`[API POST] ERROR creating QuizAttempt:`, attemptError);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error updating quiz progress:', error);
        return NextResponse.json(
            { error: 'Failed to update quiz progress', details: error.message },
            { status: 500 }
        );
    }
}
