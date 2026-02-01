import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "상상을 입력해줘!" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set in environment variables.");
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

        const systemPrompt = `You are a professional Disney/Pixar artistic prompt engineer. 
        Your job is to transform simple Korean descriptions from children into highly detailed, incredibly cute, 3D Pixar Disney style English prompts for image generation.
        
        CRITICAL SAFETY RULES:
        - NEVER create prompts with violence, weapons, or scary content
        - NEVER include adult themes or inappropriate suggestions
        - ALWAYS keep prompts child-friendly and wholesome
        - Focus on: cute animals, magical landscapes, friendly characters, colorful scenes
        
        Refinement Rules:
        1. Always focus on adorable baby animals (even if not specified, make subjects youthful and cute).
        2. Use keywords like: "Pixar style", "3D render", "big adorable eyes", "fluffy textures", "magical lighting", "cinematic 8k", "child-friendly", "vibrant colors".
        3. Translate the core Korean concepts accurately into descriptive English.
        4. If the input mentions "사자" and "코끼리", ensure they are correctly translated to "baby lion" and "baby elephant".
        
        Output ONLY the refined English prompt string. Do not include any other text.`;

        const result = await model.generateContent([systemPrompt, `Input: ${prompt}`]);
        const response = await result.response;
        const refinedPrompt = response.text().trim();

        return NextResponse.json({ refinedPrompt });
    } catch (error: any) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Gemini 마법이 잠시 쉬고 있어요. 다시 시도해볼까?" }, { status: 500 });
    }
}
