const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function testGemini() {
    let apiKey = "";
    try {
        const envContent = fs.readFileSync(".env", "utf8");
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    } catch (e) {
        console.error("Failed to read .env", e);
    }

    if (!apiKey) {
        console.error("GEMINI_API_KEY missing");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
        const result = await model.generateContent("Hello, world!");
        const response = await result.response;
        console.log("Gemini Output:", response.text());
    } catch (err) {
        console.error("Gemini Error:", err);
    }
}

testGemini();
