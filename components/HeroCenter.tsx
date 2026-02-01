"use client";
import { motion } from "framer-motion";

export default function HeroCenter({ onBack, user }: { onBack: () => void, user: any }) {
    const medals = [
        { name: "이야기 왕", icon: "👑", desc: "첫 번째 동화를 썼어요!" },
        { name: "꼬마 화가", icon: "🎨", desc: "그림을 3개 이상 그렸어요!" },
        { name: "마법 탐험대", icon: "🚀", desc: "모든 연구소를 방문했어요!" }
    ];

    return (
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}>
                ← 돌아가기
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: "5rem", marginBottom: "1rem" }}
                >
                    {user.tier === "Pro" ? "🦸‍♀️" : "👶"}
                </motion.div>
                <h2 style={{ color: "var(--success)", fontSize: "2.5rem" }}>{user.name}의 히어로 센터</h2>
                <p style={{ fontSize: "1.2rem", color: "#666" }}>내가 얻은 업적과 마법 훈장들을 모아보는 곳이야!</p>
            </div>

            <div style={{ marginTop: "3rem" }}>
                <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>🎖️ 마법 훈장</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                    {medals.map((medal, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            style={{
                                background: "#f9f9f9",
                                padding: "1.5rem",
                                borderRadius: "20px",
                                textAlign: "center",
                                border: "2px solid #eee"
                            }}
                        >
                            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{medal.icon}</div>
                            <h4 style={{ color: "#2d3436" }}>{medal.name}</h4>
                            <p style={{ fontSize: "0.85rem", color: "#999" }}>{medal.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "3rem", padding: "2rem", background: "linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%)", borderRadius: "24px", textAlign: "center" }}>
                <h3 style={{ color: "#4D96FF" }}>스텔라 포인트: {user.tier === "Pro" ? "무제한 ✨" : "150 P"}</h3>
                <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>열심히 활동해서 더 큰 영웅이 되어봐!</p>
            </div>
        </div>
    );
}
