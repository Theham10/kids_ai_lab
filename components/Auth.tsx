"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
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
    stella: "/pet_puppy.png",
    leo: "/pet_kitten.png",
    pinky: "/pet_panda.png",
    bolt: "/pet_rabbit.png"
};

export default function Auth({ onLogin }: { onLogin: (user: UserProfile) => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [referral, setReferral] = useState(""); // Kept for schema compatibility if needed but hidden in UI
    const [selectedCharacter, setSelectedCharacter] = useState("stella");
    const [characterName, setCharacterName] = useState("");
    const [mode, setMode] = useState<"landing" | "avatar_setup" | "choose" | "login" | "join">("landing");
    const [showParentalGate, setShowParentalGate] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);

    const handleLogin = async () => {
        if (!name) return alert("친구! 이름을 알려줘야 마법이 시작돼! 😊");

        const adminNames = ["스텔라", "stella", "admin", "마스터", "master"];
        const isAdmin = adminNames.includes(name.toLowerCase());

        if (!isAdmin) {
            try {
                // Try to find user by name in Supabase
                const { data, error } = await supabase
                    .from('magic_users')
                    .select('*')
                    .eq('name', name.trim())
                    .single();

                if (error || !data) {
                    return alert("어라? 기록장에서 이름을 찾을 수 없어. 회원가입을 먼저 해줄래? ✨");
                }

                onLogin(data);
                return;
            } catch (err) {
                console.error("Login failed", err);
                return alert("연구소 통신에 문제가 생겼어. 다시 해볼까? ✨");
            }
        }

        onLogin({
            id: "admin-" + Date.now(),
            name,
            tier: "Pro",
            credits: 9999,
        });
    };

    const handleJoin = async () => {
        // Only name and age are strictly required for the kids' experience
        if (!name || !age || !gender || !characterName) return alert("이름이랑 나이를 알려줘야 우리가 같이 모험을 떠날 수 있어! ✨");

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 4 || ageNum > 10) {
            return alert("마법 나라 연구소는 4세부터 10세까지의 친구들을 위한 곳이에요! 😊");
        }

        if (!privacyConsent) return alert("부모님의 동의가 필요해요! 개인정보 처리방침에 체크해주세요 🙏");

        const newUser: any = {
            name: name.trim(),
            age: ageNum,
            gender,
            tier: "Free",
            credits: 5,
            character: selectedCharacter,
            character_name: characterName ? characterName.trim() : "친구",
            created_at: new Date().toISOString()
        };

        if (email) {
            newUser.email = email.trim().toLowerCase();
        }

        try {
            // Save to Supabase
            const { data, error } = await supabase
                .from('magic_users')
                .insert([newUser])
                .select()
                .single();

            if (error) {
                if (error.code === '23505') {
                    return alert("이미 우리 연구소에 있는 이름이야! 뒤로 가서 '입장하기'를 하거나, 다른 예쁜 이름을 써볼까? ✨");
                }
                throw error;
            }

            onLogin({
                ...data,
                characterName: data.character_name
            });
        } catch (err: any) {
            console.error("Join failed", err);
            // Provide a bit more info to the user/parent
            const errorMsg = err.message || "알 수 없는 마법 오류";
            alert(`기록장에 적는 중에 마법이 꼬였어 (오류: ${errorMsg}). 다시 한번만 시도해줘! 🪄`);
        }
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
                <div style={{ marginBottom: "1rem" }}>
                    {mode === "landing" ? (
                        <img src="/stella_char.png" alt="Stella" style={{ width: "120px", height: "120px", borderRadius: "30px", objectFit: "cover", border: "4px solid #A29BFE", margin: "0 auto" }} />
                    ) : (
                        <img src={characterMap[selectedCharacter]} alt="Pet" style={{ width: "120px", height: "120px", borderRadius: "30px", objectFit: "cover", border: "4px solid #A29BFE", margin: "0 auto" }} />
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {mode === "landing" && (
                        <motion.div
                            key="landing"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7", marginBottom: "1rem" }}>안녕! 마법 나라에 <br />온 걸 환영해 ✨</h1>
                            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1rem" }}>
                                오늘은 어떤 마법을 부려볼까? <br />
                                우리 같이 여행을 떠나보자! ✨
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
                            <h1 style={{ fontSize: "2rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>나의 AI 친구를 불러볼까?</h1>
                            <p style={{ color: "#666", marginBottom: "2rem" }}>마법사 친구와 이름을 정해줘!</p>

                            <div style={{ textAlign: "left" }}>
                                <label style={labelStyle}>내 이름은요</label>
                                <input type="text" placeholder="예: 무적철수" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

                                <label style={labelStyle}>마법사 친구의 이름은요</label>
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
                                        { id: "stella", image: "/pet_puppy.png" },
                                        { id: "leo", image: "/pet_kitten.png" },
                                        { id: "pinky", image: "/pet_panda.png" },
                                        { id: "bolt", image: "/pet_rabbit.png" }
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
                                            <img src={char.image} alt={char.id} style={{ width: "80px", height: "80px", borderRadius: "20px", objectFit: "cover" }} />
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
                            <button onClick={() => setMode("landing")} style={{ width: "100%", padding: "0.8rem", fontSize: "1.1rem", background: "#f1f2f6", color: "#666", borderRadius: "16px", marginTop: "1rem", border: "none", cursor: "pointer" }}>뒤로 가기</button>
                        </motion.div>
                    )}

                    {mode === "choose" && (
                        <motion.div
                            key="choose"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <h1 style={{ fontSize: "2.2rem", color: "#6C5CE7" }}>반가워, {name}야!</h1>
                            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2.5rem" }}>AI 친구 **{characterName}**랑 무엇을 할까?</p>

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
                            <button onClick={() => setMode("landing")} style={{ width: "100%", padding: "0.8rem", fontSize: "1.1rem", background: "#f1f2f6", color: "#666", borderRadius: "16px", marginTop: "1rem", border: "none", cursor: "pointer" }}>뒤로 가기</button>
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
                                {/* Email and Referral removed for maximum simplicity as requested by CEO */}
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
                                {/* Referral code removed for simplicity as requested */}

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
                                            부모님! 우리 아이의 정보를 안전하게 지켜주기로 약속할게요.
                                            <a
                                                href="/privacy"
                                                target="_blank"
                                                style={{ color: "#6C5CE7", textDecoration: "underline", fontWeight: "bold", marginLeft: "5px" }}
                                            >
                                                [약속 확인하기]
                                            </a>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <motion.button onClick={handleJoin} style={{ ...buttonStyle, background: "#6BCB77" }}>기록 완료! 모험 떠나기 🚀</motion.button>
                            <button onClick={() => setMode("choose")} style={{ width: "100%", padding: "0.8rem", fontSize: "1.1rem", background: "#f1f2f6", color: "#666", borderRadius: "16px", marginTop: "1rem", border: "none", cursor: "pointer" }}>뒤로 가기</button>
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
