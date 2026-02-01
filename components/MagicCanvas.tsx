"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MagicCanvas({
    onBack,
    user,
    onSaveToGallery,
    gallery
}: {
    onBack: () => void,
    user: any,
    onSaveToGallery: (img: string) => void,
    gallery: string[]
}) {
    const [idea, setIdea] = useState("");
    const [status, setStatus] = useState<"idle" | "sketching" | "coloring" | "polishing" | "done">("idle");
    const [image, setImage] = useState<string | null>(null);

    const paintMagic = () => {
        if (!idea) return;
        setImage(null);

        // Multi-step progress simulation
        setStatus("sketching");
        setTimeout(() => {
            setStatus("coloring");
            setTimeout(() => {
                setStatus("polishing");
                setTimeout(() => {
                    const uniqueSeed = Date.now() + Math.floor(Math.random() * 1000000);
                    const newImg = `https://image.pollinations.ai/prompt/${encodeURIComponent(idea)}?width=1024&height=1024&nologo=true&seed=${uniqueSeed}&enhance=true`;
                    setImage(newImg);
                    setStatus("done");
                    onSaveToGallery(newImg);
                }, 1500);
            }, 1500);
        }, 1500);
    };

    const getStatusText = () => {
        switch (status) {
            case "sketching": return "밑그림 그리는 중... ✏️";
            case "coloring": return "색칠하는 중... 🎨";
            case "polishing": return "반짝반짝 다듬는 중... ✨";
            default: return "";
        }
    };

    return (
        <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}>
                    ← 돌아가기
                </button>
                {user.tier === "Pro" && (
                    <span style={{ background: "var(--secondary)", color: "white", padding: "6px 15px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: "bold" }}>
                        Pro 마술사 ✨
                    </span>
                )}
            </div>

            <h2 style={{ color: "var(--secondary)", fontSize: "2.2rem" }}>매직 캔버스 🎨</h2>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>스텔라의 상상을 글로 적으면 AI가 멋진 그림으로 그려줄게!</p>

            <div style={{ margin: "2.5rem 0" }}>
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
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        className="button button-secondary"
                        onClick={paintMagic}
                        disabled={status !== "idle" && status !== "done"}
                        style={{ flex: 2, justifyContent: "center", fontSize: "1.3rem" }}
                    >
                        {status === "idle" ? "그림 그리기! ✨" : status === "done" ? "다시 생성하기 🔄" : getStatusText()}
                    </button>
                    {status === "done" && (
                        <button
                            className="button"
                            onClick={() => { setIdea(""); setImage(null); setStatus("idle"); }}
                            style={{ flex: 1, justifyContent: "center", background: "#eee", color: "#666" }}
                        >
                            새로 시작 🆕
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {status !== "idle" && status !== "done" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: "center", padding: "3rem" }}
                    >
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            style={{ fontSize: "4rem", marginBottom: "1rem" }}
                        >
                            🌈
                        </motion.div>
                        <div style={{ width: "100%", background: "#eee", height: "10px", borderRadius: "5px", overflow: "hidden", marginTop: "1rem", maxWidth: "400px", margin: "1rem auto" }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: status === "sketching" ? "33%" : status === "coloring" ? "66%" : "100%" }}
                                style={{ height: "100%", background: "var(--secondary)" }}
                            />
                        </div>
                        <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--secondary)", marginTop: "1rem" }}>{getStatusText()}</p>
                    </motion.div>
                )}

                {image && status === "done" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: "center" }}
                    >
                        <img
                            src={image}
                            alt="Generated Art"
                            style={{
                                maxWidth: "100%",
                                borderRadius: "32px",
                                boxShadow: "0 20px 50px rgba(255, 107, 157, 0.2)",
                                border: "8px solid white"
                            }}
                        />
                        <h3 style={{ marginTop: "1.5rem", fontSize: "1.8rem" }}>와! 정말 멋진 작품이야! 😍</h3>
                    </motion.div>
                )}
            </AnimatePresence>

            {gallery.length > 0 && (
                <div style={{ marginTop: "4rem" }}>
                    <h3 style={{ marginBottom: "1.5rem", color: "#2d3436" }}>🖼️ 마법 갤러리 (지금까지 만든 그림)</h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "1rem"
                    }}>
                        {gallery.map((img, i) => (
                            <motion.img
                                key={i}
                                src={img}
                                whileHover={{ scale: 1.1 }}
                                style={{ width: "100%", borderRadius: "12px", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                                onClick={() => setImage(img)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
