"use client";
import { motion } from "framer-motion";

export default function HeroCenter({ onBack, user }: { onBack: () => void, user: any }) {
    const badges = [
        { id: 1, name: "초보 마술사", icon: "🪄", color: "#A29BFE", achieved: true },
        { id: 2, name: "동화 작가", icon: "📖", color: "#FF8C42", achieved: true },
        { id: 3, name: "일류 화가", icon: "🎨", color: "#FF6B9D", achieved: true },
        { id: 4, name: "모션 챔피언", icon: "🎬", color: "#4D96FF", achieved: user.tier === "Pro" },
        { id: 5, name: "상상력 대장", icon: "🧠", color: "#6BCB77", achieved: true },
    ];

    return (
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "2rem" }}>
                <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}>
                    ← 돌아가기
                </button>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ marginBottom: "3rem" }}
            >
                <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                        src="/mascot.png"
                        alt="Hero Avatar"
                        style={{ width: "150px", height: "150px", borderRadius: "50%", border: "8px solid white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    />
                    <div style={{
                        position: "absolute", bottom: 0, right: 0,
                        background: "linear-gradient(45deg, #FFD700, #FFA500)",
                        color: "white", padding: "8px 15px", borderRadius: "20px",
                        fontSize: "0.9rem", fontWeight: "bold", border: "4px solid white"
                    }}>
                        LV. 99 👑
                    </div>
                </div>
                <h2 style={{ fontSize: "2.5rem", marginTop: "1.5rem", color: "#2d3436" }}>{user.name} 히어로</h2>
                <p style={{ color: "#636e72", fontSize: "1.2rem" }}>세상을 아름답게 바꾸는 꼬마 마술사 ✨</p>
            </motion.div>

            <div style={{ textAlign: "left", marginTop: "3rem" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#2d3436" }}>나의 마법 배지 🏆</h3>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            whileHover={{ y: -5 }}
                            style={{
                                background: badge.achieved ? "white" : "#f1f2f6",
                                padding: "1.5rem",
                                borderRadius: "24px",
                                textAlign: "center",
                                opacity: badge.achieved ? 1 : 0.4,
                                border: badge.achieved ? `3px solid ${badge.color}` : "3px solid #eee",
                                boxShadow: badge.achieved ? `0 10px 20px ${badge.color}20` : "none"
                            }}
                        >
                            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{badge.icon}</div>
                            <div style={{ fontWeight: "bold", color: "#2d3436" }}>{badge.name}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: "4rem", padding: "2rem", background: "#f9f9ff", borderRadius: "24px", textAlign: "left" }}>
                <h3 style={{ marginBottom: "1rem" }}>히어로 정보 🦄</h3>
                <div style={{ display: "flex", gap: "2rem" }}>
                    <div>
                        <div style={{ fontSize: "0.9rem", color: "#999" }}>현재 티어</div>
                        <div style={{ fontWeight: "bold", color: "#6C5CE7" }}>{user.tier} Creator</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "0.9rem", color: "#999" }}>생성한 마법</div>
                        <div style={{ fontWeight: "bold", color: "#2d3436" }}>99+ 건</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "0.9rem", color: "#999" }}>마법 크레딧</div>
                        <div style={{ fontWeight: "bold", color: "#2d3436" }}>{user.credits === 9999 ? "무제한 ♾️" : `${user.credits}개`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
