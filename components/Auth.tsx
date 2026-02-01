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
    const [mode, setMode] = useState<"choose" | "login" | "join">("choose");

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
                <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
                    <motion.img
                        src="/mascot.png"
                        alt="AI Mascot"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: "150px", height: "150px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    />
                </div>

                {mode === "choose" && (
                    <>
                        <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>마법 연구소</h1>
                        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>세상에서 가장 똑똑한 AI 놀이터!</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="button"
                                style={{ ...buttonStyle, background: "#6C5CE7" }}
                                onClick={() => setMode("login")}
                            >
                                로그인하기 🗝️
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="button"
                                style={{ ...buttonStyle, background: "white", color: "#6C5CE7", border: "2px solid #6C5CE7" }}
                                onClick={() => setMode("join")}
                            >
                                회원가입하기 ✨
                            </motion.button>
                        </div>
                    </>
                )}

                {mode === "login" && (
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
                        <button onClick={() => setMode("choose")} style={{ background: "none", border: "none", color: "#999", marginTop: "1rem", cursor: "pointer" }}>처음으로 돌아가기</button>
                    </>
                )}

                {mode === "join" && (
                    <>
                        {joinStep === 1 ? (
                            <>
                                <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>새로운 히어로 등록</h1>
                                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>너를 마법 연구소에 알고 싶어!</p>
                                <div style={{ textAlign: "left" }}>
                                    <label style={labelStyle}>이름</label>
                                    <input type="text" placeholder="너의 이름을 입력해" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

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
                                    style={{ ...buttonStyle, background: "linear-gradient(45deg, #A29BFE, #6C5CE7)" }}
                                    onClick={() => {
                                        if (!name || !email || !age || !gender) return alert("모든 정보를 알려줘야 다음 마법으로 넘어갈 수 있어! ✨");
                                        setJoinStep(2);
                                    }}
                                >
                                    단짝 친구 선택하러 가기! →
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <h1 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>나만의 단짝 친구 매칭</h1>
                                <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>같이 모험을 떠날 친구를 고르고 이름도 지어줘!</p>

                                <div style={{ textAlign: "left" }}>
                                    <label style={labelStyle}>단짝 친구의 마법 이름</label>
                                    <input
                                        type="text"
                                        placeholder="예: 반짝이, 우주대장, 초코"
                                        value={characterName}
                                        onChange={(e) => setCharacterName(e.target.value)}
                                        style={{ ...inputStyle, border: "3px solid #6C5CE7", background: "white" }}
                                    />

                                    <label style={labelStyle}>🌟 함께할 친구 고르기</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                                        {[
                                            { id: "stella", name: "스텔라", emoji: "✨", desc: "빛나는 마법 요정" },
                                            { id: "leo", name: "레오", emoji: "🦁", desc: "용감한 아기 사자" },
                                            { id: "pinky", name: "핑키", emoji: "🦄", desc: "꿈꾸는 유니콘" },
                                            { id: "bolt", name: "볼트", emoji: "🤖", desc: "똑똑한 로봇 친구" }
                                        ].map(char => (
                                            <motion.div
                                                key={char.id}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedCharacter(char.id)}
                                                style={{
                                                    padding: "1rem",
                                                    borderRadius: "20px",
                                                    border: `3px solid ${selectedCharacter === char.id ? "#6C5CE7" : "#eee"}`,
                                                    background: selectedCharacter === char.id ? "rgba(108, 92, 231, 0.1)" : "white",
                                                    cursor: "pointer",
                                                    textAlign: "center",
                                                    boxShadow: selectedCharacter === char.id ? "0 10px 20px rgba(108,92,231,0.15)" : "none"
                                                }}
                                            >
                                                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{char.emoji}</div>
                                                <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#2d3436" }}>{char.name}</div>
                                                <div style={{ fontSize: "0.7rem", color: "#999" }}>{char.desc}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button onClick={() => setJoinStep(1)} style={{ flex: 1, background: "#f1f2f6", color: "#666", border: "none", borderRadius: "16px", padding: "1rem" }}>뒤로</button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="button"
                                        style={{ ...buttonStyle, flex: 2, background: "linear-gradient(45deg, #6BCB77, #2ecc71)", marginTop: 0 }}
                                        onClick={handleJoin}
                                    >
                                        모험 시작하기! 🚀
                                    </motion.button>
                                </div>
                            </>
                        )}
                        <button onClick={() => { setMode("choose"); setJoinStep(1); }} style={{ background: "none", border: "none", color: "#999", marginTop: "1.5rem", cursor: "pointer" }}>돌아가기</button>
                    </>
                )}

                <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", opacity: 0.4 }}>
                    세상의 모든 어린이를 위한 안전하고 가치 있는 AI 연구소
                </p>
            </motion.div>
        </div>
    );
}

