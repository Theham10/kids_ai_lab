"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MagicCanvas({
    onBack,
    user,
    onSaveToGallery,
    gallery,
    onDecrementCredits
}: {
    onBack: () => void,
    user: any,
    onSaveToGallery: (img: string) => void,
    gallery: string[],
    onDecrementCredits: () => void
}) {
    const [idea, setIdea] = useState("");
    const [status, setStatus] = useState<"idle" | "refining" | "sketching" | "coloring" | "polishing" | "done">("idle");
    const [style, setStyle] = useState("disney");
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

    const isOutOfCredits = user.tier !== "Pro" && user.credits <= 0;

    const paintMagic = async () => { // Renamed to generateArt in instruction, but keeping original name for now and applying changes
        if (!idea) return;
        if (isOutOfCredits) return;
        setIsGenerating(true); // Added from instruction
        setImageUrl(null); // Replaced setImage(null)

        setStatus("refining");

        try {
            // Intelligent Prompt Refinement via Gemini
            const response = await fetch(`${API_BASE}/api/refine-prompt`, { // Corrected endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: idea }) // Refine prompt only needs the idea (prompt)
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                setStatus("idle");
                return;
            }

            const finalPrompt = data.refinedPrompt.replace(/```[a-z]*\n/g, "").replace(/```/g, "").replace(/\.+$/, "").trim(); // Remove trailing periods

            const uniqueSeed = Date.now() + Math.floor(Math.random() * 1000000);
            const newImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${uniqueSeed}`;

            // Sequential loading simulation for magical effect
            setStatus("sketching");
            await new Promise(r => setTimeout(r, 800));
            setStatus("coloring");
            await new Promise(r => setTimeout(r, 800));
            setStatus("polishing");
            await new Promise(r => setTimeout(r, 800));

            setImageUrl(newImg);
            setStatus("done");
            setIsGenerating(false);
            onSaveToGallery(newImg);
            onDecrementCredits();

        } catch (error) {
            console.error("Magic Error:", error);
            alert("마법 연결이 조금 불안정해요. 다시 시도해볼까요?");
            setStatus("idle");
            setIsGenerating(false);
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "refining": return "Gemini가 상상력을 업그레이드 중... 🧠✨";
            case "sketching": return "업그레이드된 설계도로 밑그림 그리는 중... 🏗️";
            case "coloring": return "디즈니 마법 물감을 입히는 중... 🎨";
            case "polishing": return "작품의 완성도를 높이는 중... ✨";
            default: return "";
        }
    };

    return (
        <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
            {/* Magic Lightbox Modal */}
            <AnimatePresence>
                {lightboxImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImg(null)}
                        style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999,
                            display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out"
                        }}
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            src={lightboxImg}
                            style={{ maxWidth: "95%", maxHeight: "95%", borderRadius: "24px", boxShadow: "0 0 50px rgba(255,255,255,0.2)" }}
                        />
                        <div style={{ position: "absolute", top: "30px", right: "30px", color: "white", fontSize: "1.5rem", background: "rgba(255,255,255,0.2)", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onBack(); }}
                    className="button"
                    style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}
                >
                    ← 돌아가기
                </button>
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ background: "linear-gradient(45deg, #FF6B9D, #FF8C42)", color: "white", padding: "6px 15px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: "bold" }}>
                        DISNEY MAGIC ON 👑
                    </div>
                    {user.tier === "Pro" && (
                        <span style={{ background: "var(--secondary)", color: "white", padding: "6px 15px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: "bold" }}>
                            Pro 마술사 ✨
                        </span>
                    )}
                </div>
            </div>

            <h2 style={{ color: "var(--secondary)", fontSize: "2.2rem" }}>매직 캔버스 🎨</h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>아이들을 위한 가장 아름다운 **디즈니 스타일**의 그림을 그려줍니다!</p>

            <div style={{ margin: "2rem 0" }}>

                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="예: 초콜릿 폭포와 솜사탕 구름이 있는 과자 나라"
                    style={{
                        width: "100%",
                        padding: "1.5rem",
                        borderRadius: "24px",
                        border: "3px solid #f1f2f6",
                        fontSize: "1.2rem",
                        minHeight: "120px",
                        marginBottom: "1.5rem",
                        fontFamily: "inherit",
                        outline: "none"
                    }}
                />
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                        className="button button-secondary"
                        onClick={paintMagic}
                        disabled={(status !== "idle" && status !== "done") || isOutOfCredits}
                        style={{
                            flex: "none",
                            width: "fit-content",
                            padding: "0.8rem 2rem",
                            justifyContent: "center",
                            fontSize: "1rem",
                            background: isOutOfCredits ? "#ccc" : (status === "done" ? "#6C5CE7" : "var(--secondary)")
                        }}
                    >
                        {isOutOfCredits ? "마법 가루가 부족해! 🏜️" : status === "idle" ? "디즈니 마법 그리기! ✨" : status === "done" ? "다시 생성하기 🔄" : getStatusText()}
                    </button>
                    {isOutOfCredits && (
                        <div style={{
                            background: "#FFF4E5", border: "2px solid #FFAD33", padding: "1.5rem", borderRadius: "20px",
                            textAlign: "center", flex: 1
                        }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✨</div>
                            <div style={{ fontWeight: "bold", color: "#663C00", fontSize: "1.1rem", marginBottom: "0.5rem" }}>오늘의 마법은 여기까지!</div>
                            <div style={{ fontSize: "0.95rem", color: "#663C00" }}>더 만들고 싶으면 부모님께 말씀드려요 🙋</div>
                        </div>
                    )}
                    {status === "done" && !isOutOfCredits && (
                        <button
                            className="button"
                            onClick={() => { setIdea(""); setImageUrl(null); setStatus("idle"); }}
                            style={{ flex: "none", padding: "0.8rem 1.5rem", justifyContent: "center", background: "#f1f2f6", color: "#666", fontSize: "1rem" }}
                        >
                            새로 시작 🆕
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {status !== "idle" && status !== "done" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        style={{
                            textAlign: "center",
                            padding: "5rem 2rem",
                            background: "linear-gradient(135deg, #f9f9ff 0%, #fff 100%)",
                            borderRadius: "40px",
                            border: "3px solid #6C5CE7",
                            marginTop: "2rem",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px rgba(108, 92, 231, 0.15)"
                        }}
                    >
                        {/* Background Pulsing Magic Circle */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.1, 0.3, 0.1],
                                rotate: 360
                            }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            style={{
                                position: "absolute",
                                top: "50%", left: "50%",
                                width: "400px", height: "400px",
                                marginTop: "-200px", marginLeft: "-200px",
                                background: "radial-gradient(circle, #a29bfe 0%, transparent 70%)",
                                zIndex: 0
                            }}
                        />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <motion.div
                                animate={{
                                    y: [-15, 15, -15],
                                    rotate: [0, 20, -20, 0],
                                    filter: ["drop-shadow(0 0 10px #6C5CE7)", "drop-shadow(0 0 30px #a29bfe)", "drop-shadow(0 0 10px #6C5CE7)"]
                                }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                style={{ fontSize: "6rem", marginBottom: "2rem", display: "inline-block" }}
                            >
                                🪄
                            </motion.div>

                            <h3 style={{ color: "#6C5CE7", fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "bold" }}>
                                {getStatusText()}
                            </h3>

                            <div style={{ width: "100%", background: "#eee", height: "16px", borderRadius: "8px", overflow: "hidden", maxWidth: "500px", margin: "0 auto", border: "2px solid #fff", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: status === "refining" ? "25%" :
                                            status === "sketching" ? "50%" :
                                                status === "coloring" ? "75%" :
                                                    status === "polishing" ? "95%" : "100%"
                                    }}
                                    transition={{ duration: 1 }}
                                    style={{
                                        height: "100%",
                                        background: "linear-gradient(90deg, #6C5CE7, #a29bfe, #6C5CE7)",
                                        backgroundSize: "200% 100%"
                                    }}
                                />
                            </div>

                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ marginTop: "2rem", color: "#666", fontSize: "1.2rem", fontWeight: "500" }}
                            >
                                {status === "refining" && "어떤 예쁜 그림을 그릴지 마법사가 생각 중이에요... 🧪"}
                                {status === "sketching" && "하늘 위 스케치북에 슥슥 밑그림을 그려요... ☁️"}
                                {status === "coloring" && "무지개 색깔로 예쁘게 색칠하고 있어요... 🌈"}
                                {status === "polishing" && "마지막으로 반짝반짝 요정 가루를 뿌려 완성! ✨"}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {isGenerating && (
                    <motion.div
                        key="gen"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        style={{
                            textAlign: "center",
                            padding: "4rem 2rem",
                            background: "linear-gradient(135deg, #FFF9F0 0%, #FFF 100%)",
                            borderRadius: "32px",
                            border: "3px solid var(--primary)",
                            boxShadow: "0 20px 40px rgba(255, 140, 66, 0.1)"
                        }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 360]
                            }}
                            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                            style={{
                                position: "absolute",
                                top: "50%", left: "50%",
                                width: "300px", height: "300px",
                                marginTop: "-150px", marginLeft: "-150px",
                                background: "radial-gradient(circle, rgba(255, 140, 66, 0.2) 0%, transparent 70%)",
                                zIndex: 0
                            }}
                        />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <motion.img
                                src="/stella_char.png"
                                animate={{
                                    y: [-15, 15, -15],
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                style={{ width: "130px", height: "130px", borderRadius: "30px", marginBottom: "2rem", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                            />
                            <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
                                {user.name}의 멋진 그림을 그리고 있어! 🎨
                            </h3>
                            <div style={{ width: "100%", background: "#f1f2f6", height: "12px", borderRadius: "6px", overflow: "hidden", maxWidth: "400px", margin: "0 auto" }}>
                                <motion.div
                                    animate={{
                                        width: ["0%", "30%", "60%", "90%", "100%"]
                                    }}
                                    transition={{ duration: 15, ease: "easeInOut" }}
                                    style={{ height: "100%", background: "linear-gradient(90deg, #FF8C42, #FFB347)" }}
                                />
                            </div>
                            <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "1.1rem" }}>
                                잠시만 기다리면 마법 같은 이야기가 펼쳐질 거예요! ✨
                            </p>
                        </div>
                    </motion.div>
                )}
                {imageUrl && status === "done" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: "center", marginTop: "2rem" }}
                    >
                        <img
                            src={imageUrl}
                            alt="Generated Art"
                            onClick={() => setLightboxImg(imageUrl)}
                            style={{
                                maxWidth: "100%",
                                borderRadius: "32px",
                                boxShadow: "0 20px 60px rgba(108, 92, 231, 0.25)",
                                border: "10px solid white",
                                cursor: "zoom-in"
                            }}
                        />
                        <h3 style={{ marginTop: "2rem", fontSize: "2rem", color: "#2d3436" }}>와! 정말 멋진 작품이야! 😍</h3>
                        <p style={{ color: "#636e72", fontSize: "1.1rem" }}>이미지를 클릭하면 큰 화면으로 볼 수 있어요!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {gallery.length > 0 && (
                <div style={{ marginTop: "4rem" }}>
                    <h3 style={{ marginBottom: "1.5rem", color: "#2d3436" }}>🖼️ 마법 갤러리 (크게 보려면 클릭!)</h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "1rem"
                    }}>
                        {gallery.map((img, i) => (
                            <motion.img
                                key={i}
                                src={img}
                                whileHover={{ scale: 1.1, zIndex: 1 }}
                                style={{ width: "100%", borderRadius: "12px", cursor: "zoom-in", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                                onClick={() => setLightboxImg(img)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}