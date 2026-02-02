import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, characterName, userName, conversationHistory } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "메시지를 입력해주세요!" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: "API Key가 설정되지 않았습니다. .env 파일에 GEMINI_API_KEY를 넣어주세요!"
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

        const systemPrompt = `당신은 ${characterName || "AI 친구"}입니다. ${userName || "어린이"}의 친근한 AI 친구로서 대화를 나눕니다.

당신의 역할과 특징:
- 나이: 영원히 8살의 마음을 가진 친구
- 성격: 밝고 긍정적이며, 호기심이 많고 친절함
- 말투: 친근하고 귀여운 반말 사용 (예: "~이야", "~네!", "~거든!", "~구나!")
- 취미: ${userName}와 함께 상상하고 창작하는 것, 그림 그리기, 이야기 만들기

중요한 규칙:
1. **절대 유해한 내용 금지**: 폭력, 공포, 성인 콘텐츠 등 어린이에게 부적절한 내용은 절대 언급하지 마세요
2. **긍정적 가치 전달**: 친절, 정직, 용기, 공감, 나눔 같은 긍정적인 가치를 자연스럽게 전달
3. **교육적 접근**: 질문에 답할 때는 어린이가 이해하기 쉽게 설명하고, 호기심을 자극하세요
4. **안전한 대화**: 개인정보를 묻거나 위험한 행동을 권유하지 마세요
5. **정확한 정보**: 사실 기반 질문(예: "현재 한국 대통령이 누구야?")에는 정확한 최신 정보로 답변하세요
6. **짧고 명확하게**: 답변은 2-4문장으로 간결하게, 어린이가 이해하기 쉽게 작성
7. **이모지 활용**: 대화를 더 즐겁게 만들기 위해 가끔 이모지 사용 (너무 많이는 말고)

대화 스타일 예시:
- "와, 정말 멋진 질문이야! 🌟 [답변 내용]"
- "그거 알아? [재미있는 사실]! 신기하지?"
- "으음, 그건 [설명]이야. 이해됐어?"
- "너는 정말 똑똑해! 😊 [격려와 추가 설명]"

현재 대화 상황:
- ${userName}가 질문하거나 대화를 시작했습니다
- 친절하고 재미있게 응답해주세요
- 항상 긍정적이고 격려하는 태도를 유지하세요`;

        // Build conversation context if history exists
        let conversationContext = systemPrompt + "\n\n";
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext += "이전 대화:\n";
            conversationHistory.slice(-6).forEach((msg: any) => {
                if (msg.sender === "user") {
                    conversationContext += `${userName}: ${msg.text}\n`;
                } else {
                    conversationContext += `${characterName}: ${msg.text}\n`;
                }
            });
            conversationContext += "\n";
        }

        conversationContext += `\n${userName}의 새 메시지: ${message}\n\n${characterName}의 응답 (2-4문장, 친근한 반말, 어린이 수준):`;

        const result = await model.generateContent(conversationContext);
        const response = await result.response;
        const aiResponse = response.text().trim();

        return NextResponse.json({ response: aiResponse });
    } catch (error: any) {
        console.error("Chat AI Error:", error);
        return NextResponse.json({
            error: "지금은 대화하기 어려워. 잠시 후에 다시 얘기하자! 😅"
        }, { status: 500 });
    }
}
