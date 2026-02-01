"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export type UserProfile = {
    id: string;
    name: string;
    tier: "Free" | "Pro";
    credits: number;
};

export default function Auth({ onLogin }: { onLogin: (user: UserProfile) => void }) {
    const [name, setName] = useState("");

    const handleStart = () => {
        if (!name) return alert("반가워! 이름을 알려줄래? 😊");

        // Admin checking logic
        const adminNames = ["스텔라", "stella"];
        const isAdmin = adminNames.includes(name.toLowerCase());

        onLogin({
            id: Math.random().toString(36).substr(2, 9),
            name,
            tier: isAdmin ? "Pro" : "Free",
            credits: isAdmin ? 9999 : 3,
        });
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FFF9F0 0%, #FFF3E6 100%)",
            padding: "1rem"
        }}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="card"
                style={{ maxWidth: "450px", width: "100%", textAlign: "center", padding: "3rem 2rem", border: "5px solid #A29BFE" }}
            >
                <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
                    <motion.img
                        src="/mascot.png"
                        alt="AI Mascot"
                        animate={{
                            y: [-10, 10, -10]
                        }}
                        transition={{
                            duration: 4, repeat: Infinity, ease: "easeInOut"
                        }}
                        style={{ width: "180px", height: "180px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    />
                </div>

                <h1 style={{ fontSize: "2.5rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>마법 연구소 입장</h1>
                <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2.5rem" }}>이름을 쓰고 마법을 시작해봐!</p>

                <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                    <input
                        type="text"
                        placeholder="이름을 입력해줘 (예: 스텔라)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "1.2rem",
                            borderRadius: "20px",
                            border: "3px solid #eee",
                            marginBottom: "1rem",
                            fontSize: "1.3rem",
                            outline: "none",
                            background: "#fafafa",
                            textAlign: "center"
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="button"
                    style={{
                        padding: "1.2rem",
                        fontSize: "1.5rem",
                        justifyContent: "center",
                        width: "100%",
                        background: "linear-gradient(45deg, #A29BFE, #6C5CE7)",
                        color: "white"
                    }}
                    onClick={handleStart}
                >
                    마법 시작하기! ✨
                </motion.button>

                <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.4 }}>
                    세상의 모든 어린이를 위한 안전한 AI 연구소
                </p>
            </motion.div>
        </div>
    );
}
