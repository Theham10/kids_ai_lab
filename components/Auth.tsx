"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParentalGate from "./ParentalGate";
import ParentalGateMath from "./ParentalGateMath";

export type UserProfile = {
    id: string;
    name: string;
    email?: string;
    age?: string;
    gender?: string;
    tier: "Free" | "Pro";
    credits: number;
    character?: string;
    characterName?: string;
};

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
    marginTop: "0.5rem",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
};

const characterMap: Record<string, string> = {
    stella: "✨",
    leo: "🦁",
    pinky: "🦄",
    bolt: "🤖"
};

export default function Auth({ onLogin }: { onLogin: (user: UserProfile) => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [referral, setReferral] = useState("");
    const [selectedCharacter, setSelectedCharacter] = useState("stella");
    const [characterName, setCharacterName] = useState("");
    const [mode, setMode] = useState<"landing" | "avatar_setup" | "choose" | "login" | "join">("landing");
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);

    const handleLogin = () => {
        if (!name) return alert("친구! 이름을 알려줘야 마법이 시작돼! 😊");

        const adminNames = ["스텔라", "stella", "admin", "마스터", "master"];
        const isAdmin = adminNames.includes(name.toLowerCase());

        if (!isAdmin) {
            const savedUsers = JSON.parse(localStorage.getItem("kids_ai_users") || "{}");
            if (!savedUsers[name]) {
                return alert("어라? 기록장에서 이름을 찾을 수 없어. 회원가입을 먼저 해줄래? ✨");
            }
            onLogin(savedUsers[name]);
            return;
        }

        onLogin({
            id: "admin-" + Date.now(),
            name,
            tier: "Pro",
            credits: 9999,
        });
    };

    const handleJoin = () => {
        if (!name || !email || !age || !gender || !characterName) return alert("모든 정보를 채워줘야 고귀한 히어로가 될 수 있어! ✨");

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 4 || ageNum > 10) {
            return alert("꼬마 마법사 연구소는 4세부터 10세까지의 친구들을 위한 곳이에요! 😊");
        }

        if (!privacyConsent) return alert("부모님의 동의가 필요해요! 개인정보 처리방침에 체크해주세요 🙏");

        const newUser: UserProfile = {
            id: "new-" + Date.now(),
            name,
            email,
            age,
            gender,
            tier: "Free",
            credits: referral ? 4 : 3,
            character: selectedCharacter,
            characterName: characterName
        };

        // Save to mock database (localStorage)
        const savedUsers = JSON.parse(localStorage.getItem("kids_ai_users") || "{}");
        savedUsers[name] = newUser;
        localStorage.setItem("kids_ai_users", JSON.stringify(savedUsers));

        onLogin(newUser);
        if (referral) alert(`🎉 친구 추천 보너스 전송 완료!`);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FFF9F0 0%, #FFF3E6 100%)",
            padding: "1.5rem"
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    textAlign: "center",
                    padding: "3rem 2rem",
                    border: "6px solid #A29BFE",
                    background: "white",
                    borderRadius: "40px",
                    boxShadow: "0 20px 50px rgba(108, 92, 231, 0.1)"
                }}
            >
                <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
                    {mode === "landing" ? "🚀" : (characterMap[selectedCharacter] || "✨")}
                </div>

                <AnimatePresence mode="wait">
                    {mode === "landing" && (
                        <motion.div
                            key="landing"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2.5rem", color: "#6C5CE7", marginBottom: "1rem" }}>Magic Lab 🚀</h1>
                            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
                                꼬마 마법사 연구소에 온 걸 환영해! <br />
                                오늘은 어떤 마법을 부려볼까? ✨
                            </p>
                            <div style={{
                                background: "#f9f9ff",
                                padding: "0.8rem 1.5rem",
                                borderRadius: "16px",
                                border: "2px solid #A29BFE",
                                marginBottom: "1.5rem",
                                fontSize: "0.95rem",
                                color: "#6C5CE7",
                                fontWeight: "bold"
                            }}>
                                👶 만 4-10세 어린이를 위한 AI 놀이터
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="button"
                                    style={{ ...buttonStyle, background: "linear-gradient(45deg, #FF6B9D, #FF8C42)" }}
                                    onClick={() => setMode("avatar_setup")}
                                >
                                    처음 왔어? (모험 시작하기! ✨)
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="button"
                                    style={{ ...buttonStyle, background: "white", color: "#6C5CE7", border: "2px solid #6C5CE7" }}
                                    onClick={() => setMode("login")}
                                >
                                    이미 친구야! (로그인하기 🪄)
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                    {mode === "avatar_setup" && (
                        <motion.div
                            key="avatar"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>나만의 AI 친구 만들기</h1>
                            <p style={{ color: "#666", marginBottom: "2rem" }}>함께 모험을 떠날 친구를 고르고 이름도 지어줘!</p>

                            <div style={{ textAlign: "left" }}>
                                <label style={labelStyle}>나의 히어로 이름은?</label>
                                <input type="text" placeholder="예: 무적철수" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

                                <label style={labelStyle}>활동에 도움 줄 AI 친구 이름 지어주기</label>
                                <input
                                    type="text"
                                    placeholder="예: 반짝이, 우주대장"
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value)}
                                    style={{ ...inputStyle, border: "3px solid #6C5CE7", background: "white" }}
                                />

                                <label style={labelStyle}>🌟 함께할 친구 고르기</label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                                    {[
                                        { id: "stella", emoji: "✨" },
                                        { id: "leo", emoji: "🦁" },
                                        { id: "pinky", emoji: "🦄" },
                                        { id: "bolt", emoji: "🤖" }
                                    ].map(char => (
                                        <motion.div
                                            key={char.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedCharacter(char.id)}
                                            style={{
                                                padding: "1.5rem",
                                                borderRadius: "20px",
                                                border: `3px solid ${selectedCharacter === char.id ? "#6C5CE7" : "#eee"}`,
                                                background: selectedCharacter === char.id ? "rgba(108, 92, 231, 0.1)" : "white",
                                                cursor: "pointer",
                                                textAlign: "center",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <div style={{ fontSize: "3rem" }}>{char.emoji}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="button"
                                style={buttonStyle}
                                onClick={() => {
                                    if (!name || !characterName) return alert("너의 이름과 친구의 이름을 알려줘야 모험을 떠날 수 있어! ✨");
                                    setMode("choose");
                                }}
                            >
                                준비 완료! 선택창으로 가기 →
                            </motion.button>
                            <button onClick={() => setMode("landing")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>뒤로 가기</button>
                        </motion.div>
                    )}

                    {mode === "choose" && (
                        <motion.div
                            key="choose"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2.5rem", color: "#6C5CE7" }}>반가워, {name}!</h1>
                            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2.5rem" }}>AI 친구 **{characterName}**와 함께 무엇을 할까?</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="button"
                                    style={{ ...buttonStyle, background: "#6C5CE7" }}
                                    onClick={() => setShowParentalGate(true)}
                                >
                                    기록장에 저장하고 모험 시작! ✨
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="button"
                                    style={{ ...buttonStyle, background: "white", color: "#6C5CE7", border: "2px solid #6C5CE7" }}
                                    onClick={() => setMode("avatar_setup")}
                                >
                                    AI 친구 다시 정하기 🔄
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {mode === "login" && (
                        <motion.div
                            key="login"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "1rem" }}>오랜만이야 히어로!</h1>
                            <input
                                type="text"
                                placeholder="너의 이름을 입력해줘"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                            <motion.button onClick={handleLogin} style={buttonStyle}>연구소 입장! 🪄</motion.button>
                            <button onClick={() => setMode("landing")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>뒤로 가기</button>
                        </motion.div>
                    )}

                    {mode === "join" && (
                        <motion.div
                            key="join"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "1rem" }}>우리들의 모험 기록장</h1>
                            <div style={{ textAlign: "left" }}>
                                <label style={labelStyle}>이메일 (부모님 메일)</label>
                                <input type="email" placeholder="example@magic.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>나이 (4-10세)</label>
                                        <input
                                            type="number"
                                            min="4"
                                            max="10"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            style={inputStyle}
                                            placeholder="4-10세"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>성별</label>
                                        <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
                                            <option value="">선택</option>
                                            <option value="male">남자아이</option>
                                            <option value="female">여자아이</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginTop: "0.5rem", padding: "1rem", background: "#f8f9ff", borderRadius: "20px", border: "1px dashed #A29BFE", marginBottom: "1.5rem" }}>
                                    <label style={{ ...labelStyle, color: "#6C5CE7" }}>🎁 친구 추천 코드</label>
                                    <input type="text" placeholder="친구의 이름" value={referral} onChange={(e) => setReferral(e.target.value)} style={{ ...inputStyle, marginBottom: 0 }} />
                                </div>

                                <div style={{
                                    marginTop: "1.5rem",
                                    padding: "1.5rem",
                                    background: "#fff",
                                    borderRadius: "20px",
                                    border: "2px solid #6C5CE7",
                                    marginBottom: "1rem"
                                }}>
                                    <label style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={privacyConsent}
                                            onChange={(e) => setPrivacyConsent(e.target.checked)}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                marginTop: "0.2rem",
                                                cursor: "pointer",
                                                accentColor: "#6C5CE7"
                                            }}
                                        />
                                        <div style={{ flex: 1, fontSize: "0.95rem", color: "#2d3436", lineHeight: "1.6" }}>
                                            <strong style={{ color: "#6C5CE7" }}>[필수]</strong> 부모님,
                                            <a
                                                href="/privacy"
                                                target="_blank"
                                                style={{ color: "#6C5CE7", textDecoration: "underline", fontWeight: "bold" }}
                                            >
                                                개인정보 처리방침
                                            </a>
                                            을 읽고 동의합니다.
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <motion.button onClick={handleJoin} style={{ ...buttonStyle, background: "#6BCB77" }}>기록 완료! 모험 떠나기 🚀</motion.button>
                            <button onClick={() => setMode("choose")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>뒤로 가기</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showParentalGate && (
                    <ParentalGateMath
                        onSuccess={() => {
                            setShowParentalGate(false);
                            setMode("join");
                        }}
                        onCancel={() => setShowParentalGate(false)}
                    />
                )}

                <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.5, color: "#666" }}>
                    세상의 모든 어린이를 위한 안전하고 가치 있는 AI 연구소
                </p>
            </motion.div>
        </div>
    );
}
