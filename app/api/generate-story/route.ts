import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
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
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ]
        });

        const systemPrompt = `You are a professional Disney/Pixar storyteller and child development expert.
        Your job is to write a magical, heartwarming, and deeply EDUCATIONAL 4-chapter story for children (ages 4-10) in KOREAN.
        
        CRITICAL SAFETY RULES:
        - NEVER include violence, scary content, or adult themes
        - NEVER mention real people, brands, or copyrighted characters
        - ALWAYS focus on positive values: kindness, honesty, courage, empathy, sharing
        - Stories MUST be appropriate for young children
        
        The stories must go beyond simple entertainment and provide meaningful life lessons (인성 교육, 교훈).
        
        The stories must go beyond simple entertainment and provide meaningful life lessons (인성 교육, 교훈).
        
        Story Rules:
        1. Always include the reader, ${userName || "친구"}, as the main character or a close companion of the subject.
        2. Format: 4 chapters clearly labeled:
           [제 1장: 신비한 모험의 시작]
           (Story content)
           
           [제 2장: 어려운 시련과 도전]
           (Story content)
           
           [제 3장: 교훈을 통한 성장]
           (Story content)
           
           [제 4장: 지혜의 샘 (부모님과 함께 읽는 오늘의 교훈)]
           (Summarize the specific life lesson or moral value in a gentle, educational tone for both kids and parents. Focus on values like: sharing, honesty, courage, empathy, or patience.)

        3. Style: Whimsical, poetic, and cinematic (like a Pixar movie script).
        4. Focus: High-quality descriptive language, fairy-tale atmosphere, and a clear educational message.
        5. Length: Each chapter should be 4-5 descriptive sentences.
        
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
