"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import ParentalGate from "./ParentalGate";

export default function Settings({ onBack, user, onUpdateUser }: {
    onBack: () => void,
    user: any,
    onUpdateUser: (updatedUser: any) => void
}) {
    const [showParentalGate, setShowParentalGate] = useState(true);
    const [name, setName] = useState(user.name);
    const [characterName, setCharacterName] = useState(user.characterName);
    const [character, setCharacter] = useState(user.character);

    const characters = [
        { id: "stella", name: "스텔라", emoji: "✨", desc: "마법의 별" },
        { id: "leo", name: "레오", emoji: "🦁", desc: "용감한 사자" },
        { id: "pinky", name: "핑키", emoji: "🦄", desc: "신비한 유니콘" },
        { id: "bolt", name: "볼트", emoji: "🤖", desc: "똑똑한 로봇" }
    ];

    const handleSave = () => {
        const updatedUser = {
            ...user,
            name,
            characterName,
            character
        };
        localStorage.setItem("magic_user", JSON.stringify(updatedUser));
        onUpdateUser(updatedUser);
        alert("설정이 저장되었어요! ✨");
        onBack();
    };

    if (showParentalGate) {
        return (
            <ParentalGate
                userEmail={user.email}
                onSuccess={() => setShowParentalGate(false)}
                onCancel={onBack}
            />
        );
    }

    return (
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <button
                onClick={onBack}
                className="button"
                style={{ background: "none", boxShadow: "none", color: "#666", padding: 0, marginBottom: "2rem" }}
            >
                ← 돌아가기
            </button>

            <h2 style={{ fontSize: "2.5rem", color: "#6C5CE7", marginBottom: "2rem", textAlign: "center" }}>
                ⚙️ 설정
            </h2>

            <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#2d3436" }}>
                    👤 이름
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "2px solid #f1f2f6",
                        fontSize: "1.1rem"
                    }}
                />
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#2d3436" }}>
                    🎭 단짝 친구 이름
                </label>
                <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "2px solid #f1f2f6",
                        fontSize: "1.1rem"
                    }}
                />
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
                <label style={{ display: "block", marginBottom: "1rem", fontWeight: "bold", color: "#2d3436" }}>
                    ✨ 캐릭터 선택
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                    {characters.map((char) => (
                        <motion.div
                            key={char.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCharacter(char.id)}
                            style={{
                                padding: "1.5rem",
                                borderRadius: "20px",
                                border: character === char.id ? "3px solid #6C5CE7" : "3px solid #f1f2f6",
                                background: character === char.id ? "#f9f9ff" : "white",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.2s"
                            }}
                        >
                            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{char.emoji}</div>
                            <div style={{ fontWeight: "bold", color: "#2d3436" }}>{char.name}</div>
                            <div style={{ fontSize: "0.85rem", color: "#999" }}>{char.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="button"
                style={{
                    width: "100%",
                    background: "linear-gradient(45deg, #6C5CE7, #A29BFE)",
                    color: "white",
                    fontSize: "1.3rem",
                    padding: "1.2rem"
                }}
            >
                💾 저장하기
            </motion.button>
        </div>
    );
}
