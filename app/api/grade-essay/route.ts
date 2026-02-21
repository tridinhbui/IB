import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, referenceAnswer, userAnswer } = body;

        if (!question || !userAnswer) {
            return NextResponse.json(
                { error: "Missing question or userAnswer" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an expert Investment Banking interview coach. You grade candidates' answers to IB interview questions.

You MUST respond with valid JSON only, no markdown, no extra text. Use this exact format:
{
  "score": <number 0-10>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvements": ["improvement1", "improvement2"],
  "summary": "One sentence overall assessment"
}

Grading criteria:
- 9-10: Perfect answer, demonstrates deep understanding, well-structured, covers all key points
- 7-8: Strong answer, covers most key points, minor gaps
- 5-6: Adequate answer, covers some key points but missing important details
- 3-4: Weak answer, major gaps in understanding
- 1-2: Poor answer, largely incorrect or irrelevant
- 0: No meaningful content or completely wrong

Be fair but thorough. Compare against the reference answer for completeness and accuracy.`;

        const userPrompt = `**Interview Question:**
${question}

**Reference Answer (ideal):**
${referenceAnswer || "No reference answer provided."}

**Candidate's Answer:**
${userAnswer}

Grade this answer. Return JSON only.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 500,
            temperature: 0.3,
        });

        const content = completion.choices[0]?.message?.content || "";

        // Parse JSON from response
        let result;
        try {
            result = JSON.parse(content);
        } catch {
            // Fallback: try to extract JSON from response
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                result = JSON.parse(match[0]);
            } else {
                throw new Error("Invalid AI output format");
            }
        }

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error("Grade essay error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to grade essay";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
