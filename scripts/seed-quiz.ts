import { prisma } from "../lib/prisma";
import { allQuestions } from "../lib/questions";

async function main() {
    console.log("Starting seed...");

    // 1. Get all unique sections
    const sections = Array.from(new Set(allQuestions.map((q) => q.section)));

    for (const sectionName of sections) {
        const slug = sectionName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Create or find category
        const category = await prisma.quizCategory.upsert({
            where: { slug },
            update: { name: sectionName },
            create: {
                name: sectionName,
                slug,
            },
        });

        console.log(`Processing category: ${sectionName} (${category.id})`);

        const questionsInSection = allQuestions.filter((q) => q.section === sectionName);

        for (const q of questionsInSection) {
            await prisma.quizQuestion.upsert({
                where: { questionId: q.id },
                update: {
                    questionText: q.question,
                    choices: q.choices || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    type: q.type,
                    categoryId: category.id,
                },
                create: {
                    questionId: q.id,
                    questionText: q.question,
                    choices: q.choices || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    type: q.type,
                    categoryId: category.id,
                },
            });
        }
        console.log(`Synced ${questionsInSection.length} questions for ${sectionName}`);
    }

    console.log("Seed finished successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
