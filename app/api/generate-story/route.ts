import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, userName } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "이야기 주제를 알려줘!" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: "대표님! Gemini API Key가 설정되지 않았습니다. .env 파일에 GEMINI_API_KEY를 넣어주세요!"
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `You are a professional Disney/Pixar storyteller.
        Your job is to write a magical, heartwarming, and adventurous 3-chapter story for children in KOREAN.
        
        Story Rules:
        1. Always include the reader, ${userName || "친구"}, as the main character or a close companion of the subject.
        2. Format: 3 chapters clearly labeled like:
           [제 1장: 제목]
           (Story content)
           
           [제 2장: 제목]
           (Story content)
           
           [제 3장: 제목]
           (Story content)
        3. Style: Whimsical, educational, safe, and cinematic (like a Pixar movie script).
        4. Focus: High-quality descriptive language, fairy-tale atmosphere, and a happy ending.
        5. Length: Each chapter should be about 3-5 long sentences.
        
        Output ONLY the Korean story text following the chapter format.`;

        const result = await model.generateContent([systemPrompt, `Input: ${prompt}`]);
        const response = await result.response;
        const storyText = response.text().trim();

        return NextResponse.json({ story: storyText });
    } catch (error: any) {
        console.error("Story Gemini Error:", error);
        return NextResponse.json({ error: "이야기 주머니가 잠시 잠겼어요. 다시 지팡이를 휘둘러볼까?" }, { status: 500 });
    }
}
