import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

async function main() {
    const filePath = path.join(process.cwd(), 'ib_questions.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`Found ${data.length} questions to seed.`);

    for (const item of data) {
        const categoryName = item.category;
        const categorySlug = slugify(categoryName);

        // Upsert Category
        const category = await prisma.essayCategory.upsert({
            where: { name: categoryName },
            update: {},
            create: {
                name: categoryName,
                slug: categorySlug,
            },
        });

        // Create Question
        await prisma.essayQuestion.create({
            data: {
                questionText: item.question,
                suggestedAnswer: item.answer,
                categoryId: category.id,
            },
        });
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
