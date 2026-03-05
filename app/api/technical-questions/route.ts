import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Section, Difficulty, QuestionType } from '@/types/question';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
    try {
        const questions = await prisma.quizQuestion.findMany({
            include: {
                category: true,
            },
        });

        const formattedQuestions = questions.map((q) => ({
            id: q.questionId,
            section: (q.category?.name || "Accounting") as Section,
            difficulty: q.difficulty as Difficulty,
            type: q.type as QuestionType,
            question: q.questionText,
            choices: q.choices,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
        }));

        return NextResponse.json(formattedQuestions);
    } catch (error) {
        console.error('Error fetching technical questions:', error);
        return NextResponse.json({
            error: 'Failed to fetch questions'
        }, { status: 500 });
    }
}
