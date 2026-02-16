"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StoryMagic({ onBack, user, onDecrementCredits }: { onBack: () => void, user: any, onDecrementCredits: () => void }) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [story, setStory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [illustrations, setIllustrations] = useState<{ [key: number]: string }>({});

    const API_BASE = "";

    const isOutOfCredits = user?.tier !== "Pro" && (user?.credits ?? 0) <= 0;

    const generateStory = async () => {
        console.log("Generating story for:", prompt);
        console.log("User data:", user);
        console.log("isOutOfCredits:", isOutOfCredits);

        if (!prompt) return;
        if (isOutOfCredits) return;
        setIsGenerating(true);
        setStory(null);
        setCurrentPage(0);
        setIllustrations({});

        try {
            const response = await fetch(`${API_BASE}/api/generate-story`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, userName: user.name })
            });

            const data = await response.json();
            if (data.error) {
                alert(data.error);
                setIsGenerating(false);
                return;
            }

            setStory(data.story);

            // Pre-generate the first scene's illustration if story exists
            const scenes = data.story.split('\n\n');
            if (scenes.length > 0) {
                const firstScene = scenes[0].replace(/\[.*?\]/g, "").replace(/\.+$/, "").trim(); // Remove trailing periods
                const seed = Math.floor(Math.random() * 100000);
                const firstImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(firstScene + " in dreamlike 3d disney style, bright colors, friendly characters")}?width=1024&height=1024&nologo=true&seed=${seed}`;
                setIllustrations({ 0: firstImg });
            }

            setIsGenerating(false);
            onDecrementCredits();
        } catch (error) {
            console.error("Story Error:", error);
            alert("이야기 주머니가 잠시 잠겼어요. 다시 시도해볼까요?");
            setIsGenerating(false);
        }
    };

    const speak = async (text: string) => {
        // If already speaking, stop it
        if (isSpeaking) {
            const audioElements = document.getElementsByTagName('audio');
            for (let i = 0; i < audioElements.length; i++) {
                if (audioElements[i].id === 'stella-voice') {
                    audioElements[i].pause();
                    audioElements[i].remove();
                }
            }
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);

        try {
            const response = await fetch(`${API_BASE}/api/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error("TTS failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.id = 'stella-voice';

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            audio.play();
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
            // Fallback to browser TTS if ElevenLabs fails (optional, but user wants to delete robotic)
            // For now, let's just log and show error
            alert("목소리 마법이 잠시 약해졌어요. 잠시 후에 다시 시도해볼까요?");
        }
    };

    const storyPages = story ? story.split('\n\n') : [];

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (!illustrations[newPage]) {
            const pageText = storyPages[newPage]?.replace(/\[.*?\]/g, "").trim() || "";
            if (pageText) {
                const sanitizedText = pageText.replace(/\.+$/, "").trim(); // Remove trailing periods
                const seed = Math.floor(Math.random() * 100000);
                const newIllustrationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(sanitizedText + " in dreamlike 3d disney style, bright colors, friendly characters")}?width=1024&height=1024&nologo=true&seed=${seed}`;
                setIllustrations(prev => ({
                    ...prev,
                    [newPage]: newIllustrationUrl
                }));
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); onBack(); }}
                className="button"
                style={{ background: "none", boxShadow: "none", color: "#666", padding: 0, marginBottom: "1rem" }}
            >
                ← 돌아가기
            </button>

            <h2 style={{ color: "var(--primary)", fontSize: "2.2rem" }}>마법 동화책 ✨</h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>어떤 신비로운 이야기를 만들어볼까?</p>

            <div style={{ margin: "2.5rem 0" }}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: 우주로 간 고양이"
                    className="input-magic"
                    style={{
                        width: "100%",
                        padding: "1.2rem",
                        borderRadius: "16px",
                        border: "3px solid #f1f2f6",
                        fontSize: "1.2rem",
                        marginBottom: "1.5rem",
                        outline: "none",
                        background: "#fff",
                        transition: "all 0.3s ease"
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && generateStory()}
                />
                <button
                    className="button button-primary"
                    onClick={generateStory}
                    disabled={isGenerating || isOutOfCredits}
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "1.2rem",
                        fontSize: "1.3rem",
                        background: isOutOfCredits ? "#ccc" : "linear-gradient(45deg, #FF8C42, #FFB347)",
                        boxShadow: isOutOfCredits ? "none" : "0 8px 20px rgba(255, 140, 66, 0.3)"
                    }}
                >
                    {isGenerating ? "마법 지팡이 휘두르는 중... 🪄" : isOutOfCredits ? "마법 에너지가 부족해! 🏜️" : "✨ 내 동화책 만들기!"}
                </button>
                {isOutOfCredits && (
                    <div style={{
                        marginTop: "1.5rem", background: "#f9f9ff", padding: "1.5rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "1rem", border: "2px solid #A29BFE"
                    }}>
                        <span style={{ fontSize: "1.5rem" }}>💎</span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                            <div style={{ fontWeight: "bold", color: "#6C5CE7" }}>모든 마법 에너지를 사용했어!</div>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>프로 마술사가 되면 무제한으로 동화를 만들 수 있어!</div>
                        </div>
                        <button className="button" style={{ background: "#A29BFE", padding: "0.5rem 1rem", fontSize: "0.9rem" }}>업그레이드</button>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isGenerating && (
                    <motion.div
                        key="gen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: "center", padding: "2rem" }}
                    >
                        <motion.img
                            src="/mascot.png"
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            style={{ width: "120px", height: "120px", borderRadius: "24px", marginBottom: "1.5rem" }}
                        />
                        <p style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.2rem" }}>AI가 열심히 이야기를 상상하고 있어요...</p>
                    </motion.div>
                )}

                {story && (
                    <motion.div
                        key={`page-${currentPage}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{
                            background: "#fff",
                            padding: "2.5rem",
                            borderRadius: "24px",
                            border: "3px dashed var(--primary)",
                            lineHeight: "2.2",
                            fontSize: "1.3rem",
                            position: "relative",
                            boxShadow: "0 15px 40px rgba(255, 140, 66, 0.15)",
                            color: "#2d3436",
                            minHeight: "400px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <div style={{ marginBottom: "2rem" }}>
                            {illustrations[currentPage] ? (
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={illustrations[currentPage]}
                                    style={{ width: "100%", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", marginBottom: "1.5rem" }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "200px", background: "#f1f2f6", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: "#999" }}>
                                    그림을 그려오고 있어요... 🎨
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                <div style={{ background: "var(--primary)", color: "white", padding: "4px 15px", borderRadius: "99px", fontSize: "0.9rem", fontWeight: "bold", display: "inline-block" }}>
                                    {storyPages[currentPage]?.match(/\[(.*?)\]/)?.[1] || `제 ${currentPage + 1}장`}
                                </div>
                                <button
                                    onClick={() => speak(storyPages[currentPage]?.replace(/\[.*?\]\n/, ""))}
                                    style={{
                                        background: isSpeaking ? "#FF6B9D" : "#eee",
                                        color: isSpeaking ? "white" : "#666",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        cursor: "pointer",
                                        fontSize: "1.2rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                                    }}
                                    title={isSpeaking ? "멈추기" : "읽어주기"}
                                >
                                    {isSpeaking ? "⏹️" : "🔈"}
                                </button>
                            </div>
                            <p style={{ whiteSpace: "pre-wrap" }}>
                                {storyPages[currentPage]?.replace(/\[.*?\]\n/, "")}
                            </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", alignItems: "center" }}>
                            <button
                                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                                className="button"
                                style={{ background: "#eee", color: "#666", padding: "0.8rem 1.2rem", visibility: currentPage === 0 ? "hidden" : "visible" }}
                            >
                                ← 이전
                            </button>
                            <span style={{ fontSize: "0.9rem", color: "#999", fontWeight: "bold" }}>{currentPage + 1} / {storyPages.length}</span>
                            {currentPage < storyPages.length - 1 ? (
                                <button
                                    onClick={() => handlePageChange(Math.min(storyPages.length - 1, currentPage + 1))}
                                    className="button button-primary"
                                    style={{ padding: "0.8rem 1.5rem" }}
                                >
                                    다음 페이지 →
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setStory(null); setPrompt(""); }}
                                    className="button"
                                    style={{ background: "#2ecc71", color: "white", padding: "0.8rem 1.5rem" }}
                                >
                                    다 읽었어요! 🎉
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #eee" }}>
                            <button
                                onClick={() => speak(storyPages[currentPage]?.replace(/\[.*?\]\n/, ""))}
                                className="button"
                                style={{
                                    width: "100%",
                                    background: isSpeaking ? "#FF6B6B" : "linear-gradient(45deg, #FF9F43, #FF8C42)",
                                    color: "white",
                                    fontSize: "1.2rem",
                                    boxShadow: "0 5px 15px rgba(255, 159, 67, 0.3)"
                                }}
                            >
                                {isSpeaking ? "⏹️ 목소리 멈추기" : "🎙️ 마법 아이 목소리로 듣기 (ElevenLabs)"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}