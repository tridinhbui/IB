import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache the response for 1 day (86400 seconds) to reduce DB calls
export const revalidate = 86400;

export async function GET() {
    try {
        const questions = await prisma.essayQuestion.findMany({
            include: {
                category: true,
            },
        });

        // Map to the format the UI expects
        const formattedQuestions = questions.map((q) => ({
            category: q.category.name,
            question: q.questionText,
            answer: q.suggestedAnswer,
        }));

        return NextResponse.json(formattedQuestions);
    } catch (error) {
        console.error('Error fetching essay questions:', error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
