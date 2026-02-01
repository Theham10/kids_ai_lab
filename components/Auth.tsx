"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export type UserProfile = {
    id: string;
    name: string;
    email?: string;
    age?: string;
    gender?: string;
    tier: "Free" | "Pro";
    credits: number;
};

export default function Auth({ onLogin }: { onLogin: (user: UserProfile) => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [showRegister, setShowRegister] = useState(false);

    const handleNext = () => {
        if (!name) return alert("반가워! 이름을 알려줄래? 😊");

        const adminNames = ["스텔라", "stella"];
        if (adminNames.includes(name.toLowerCase())) {
            return onLogin({
                id: "admin-" + Math.random().toString(36).substr(2, 5),
                name,
                tier: "Pro",
                credits: 9999,
            });
        }
        setShowRegister(true);
    };

    const handleRegister = () => {
        if (!email || !age || !gender) return alert("모든 정보를 입력해야 기록장에 이름을 올릴 수 있어! ✨");

        onLogin({
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            age,
            gender,
            tier: "Free",
            credits: 3,
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
                style={{ maxWidth: "450px", width: "100%", textAlign: "center", padding: "2.5rem 1.5rem", border: "5px solid #A29BFE" }}
            >
                <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
                    <motion.img
                        src="/mascot.png"
                        alt="AI Mascot"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: "150px", height: "150px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    />
                </div>

                {!showRegister ? (
                    <>
                        <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>마법 연구소 입장</h1>
                        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>누가 연구소를 찾아왔을까?</p>
                        <input
                            type="text"
                            placeholder="이름을 입력해줘 (예: 민준)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                            onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="button"
                            style={buttonStyle}
                            onClick={handleNext}
                        >
                            다음 단계로! 🪄
                        </motion.button>
                    </>
                ) : (
                    <>
                        <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>꼬마 히어로 기록장</h1>
                        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>너에 대해 조금 더 알고 싶어!</p>
                        <div style={{ textAlign: "left" }}>
                            <label style={labelStyle}>이메일 (부모님 메일도 좋아!)</label>
                            <input type="email" placeholder="hello@magic.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>나이</label>
                                    <input type="number" placeholder="7" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>성별</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
                                        <option value="">선택해줘</option>
                                        <option value="male">남자아이</option>
                                        <option value="female">여자아이</option>
                                        <option value="secret">비밀이야!</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="button"
                            style={{ ...buttonStyle, background: "linear-gradient(45deg, #6BCB77, #2ecc71)" }}
                            onClick={handleRegister}
                        >
                            마법 연구소 가입하기! ✨
                        </motion.button>
                        <button onClick={() => setShowRegister(false)} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>이름 다시 쓰기</button>
                    </>
                )}

                <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.4 }}>
                    세상의 모든 어린이를 위한 안전하고 가치 있는 AI 연구소
                </p>
            </motion.div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "0.9rem",
    borderRadius: "16px",
    border: "2px solid #f1f2f6",
    marginBottom: "0.8rem",
    fontSize: "1.1rem",
    outline: "none",
    background: "#fafafa",
};

const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    color: "#999",
    marginBottom: "0.4rem",
    marginLeft: "0.5rem",
    fontWeight: "bold"
};

const buttonStyle = {
    padding: "1rem",
    fontSize: "1.2rem",
    justifyContent: "center",
    width: "100%",
    background: "linear-gradient(45deg, #A29BFE, #6C5CE7)",
    color: "white",
    marginTop: "0.5rem"
};
