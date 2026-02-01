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
    marginTop: "0.5rem"
};

export default function Auth({ onLogin }: { onLogin: (user: UserProfile) => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [referral, setReferral] = useState("");
    const [selectedCharacter, setSelectedCharacter] = useState("stella");
    const [characterName, setCharacterName] = useState("");
    const [joinStep, setJoinStep] = useState(1);
    const [mode, setMode] = useState<"avatar_setup" | "choose" | "login" | "join">("avatar_setup");

    const handleLogin = () => {
        if (!name) return alert("친구! 이름을 알려줘야 마법이 시작돼! 😊");

        const adminNames = ["스텔라", "stella"];
        const isAdmin = adminNames.includes(name.toLowerCase());

        onLogin({
            id: isAdmin ? "admin-" + Math.random().toString(36).substr(2, 5) : "user-" + Math.random().toString(36).substr(2, 5),
            name,
            tier: isAdmin ? "Pro" : "Free",
            credits: isAdmin ? 9999 : 3,
        });
    };

    const handleJoin = () => {
        if (!name || !email || !age || !gender || !characterName) return alert("단짝 친구의 이름까지 지어줘야 모험을 떠날 수 있어! ✨");

        onLogin({
            id: "new-" + Math.random().toString(36).substr(2, 9),
            name,
            email,
            age,
            gender,
            tier: "Free",
            credits: referral ? 4 : 3,
            character: selectedCharacter,
            characterName: characterName
        });

        if (referral) {
            alert(`🎉 친구 '${referral}'님의 추천으로 보너스 크레딧 1개가 추가되었어!`);
        }
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
        </div>

                {
        mode === "avatar_setup" && (
            <>
                <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>나만의 단짝 친구 만들기</h1>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>같이 모험을 떠날 친구를 고르고 이름도 지어줘!</p>

                <div style={{ textAlign: "left" }}>
                    <label style={labelStyle}>너의 이름은?</label>
                    <input type="text" placeholder="예: 스텔라" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>단짝 친구의 마법 이름</label>
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
                            { id: "stella", name: "스텔라", emoji: "✨", desc: "빛나는 요정" },
                            { id: "leo", name: "레오", emoji: "🦁", desc: "용감한 사자" },
                            { id: "pinky", name: "핑키", emoji: "🦄", desc: "꿈구는 유니콘" },
                            { id: "bolt", name: "볼트", emoji: "🤖", desc: "똑똑한 로봇" }
                        ].map(char => (
                            <motion.div
                                key={char.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCharacter(char.id)}
                                style={{
                                    padding: "0.80rem",
                                    borderRadius: "20px",
                                    border: `3px solid ${selectedCharacter === char.id ? "#6C5CE7" : "#eee"}`,
                                    background: selectedCharacter === char.id ? "rgba(108, 92, 231, 0.1)" : "white",
                                    cursor: "pointer",
                                    textAlign: "center"
                                }}
                            >
                                <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{char.emoji}</div>
                                <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#2d3436" }}>{char.name}</div>
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
                        if (!name || !characterName) return alert("너의 이름과 친구의 이름을 모두 알려줘! ✨");
                        setMode("choose");
                    }}
                >
                    준비 완료! 선택창으로 가기 →
                </motion.button>
                <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer", fontSize: "0.85rem" }}>이미 계정이 있어? 로그인하기</button>
            </>
        )
    }

    {
        mode === "choose" && (
            <>
                <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>반가워, {name}!</h1>
                <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>단짝 친구 {characterName}와 함께 무엇을 할까?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="button"
                        style={{ ...buttonStyle, background: "#6C5CE7" }}
                        onClick={() => setMode("join")}
                    >
                        기록장에 저장하고 시작하기! ✨
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="button"
                        style={{ ...buttonStyle, background: "white", color: "#6C5CE7", border: "2px solid #6C5CE7" }}
                        onClick={() => setMode("avatar_setup")}
                    >
                        단짝 친구 다시 고르기 🔄
                    </motion.button>
                </div>
            </>
        )
    }

    {
        mode === "login" && (
            <>
                <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>다시 만나서 반가워!</h1>
                <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>누구인지 알려줄래?</p>
                <input
                    type="text"
                    placeholder="너의 이름을 입력해"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="button"
                    style={buttonStyle}
                    onClick={handleLogin}
                >
                    로그인 완료! 🪄
                </motion.button>
                <button onClick={() => setMode("avatar_setup")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>처음으로 돌아가기</button>
            </>
        )
    }

    {
        mode === "join" && (
            <>
                <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>기록장에 이름 올리기</h1>
                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>너와 {characterName}의 소중한 모험을 기록해둘게!</p>
                <div style={{ textAlign: "left" }}>
                    <label style={labelStyle}>이메일 (부모님 메일도 좋아!)</label>
                    <input type="email" placeholder="example@magic.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>나이</label>
                            <input type="number" placeholder="7" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>성별</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
                                <option value="">선택</option>
                                <option value="male">남자아이</option>
                                <option value="female">여자아이</option>
                                <option value="secret">비밀!</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: "0.5rem", padding: "1rem", background: "rgba(108, 92, 231, 0.05)", borderRadius: "16px", border: "1px dashed #A29BFE", marginBottom: "1.5rem", textAlign: "left" }}>
                        <label style={{ ...labelStyle, color: "#6C5CE7", fontSize: "0.8rem", marginBottom: "0.5rem" }}>🎁 친구 추천 코드 (보너스 +1 💎)</label>
                        <input
                            type="text"
                            placeholder="친구의 이름을 입력해줘 ✨"
                            value={referral}
                            onChange={(e) => setReferral(e.target.value)}
                            style={{ ...inputStyle, marginBottom: 0, borderColor: "#A29BFE" }}
                        />
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="button"
                    style={{ ...buttonStyle, background: "linear-gradient(45deg, #6BCB77, #2ecc71)" }}
                    onClick={handleJoin}
                >
                    기록장 완성하고 시작하기! 🚀
                </motion.button>
                <button onClick={() => setMode("choose")} style={{ background: "none", border: "none", color: "#999", marginTop: "1.5rem", cursor: "pointer" }}>뒤로 가기</button>
            </>
        )
    }

    <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.4 }}>
        세상의 모든 어린이를 위한 안전하고 가치 있는 AI 연구소
    </motion.div>
        </div >
    );
}

