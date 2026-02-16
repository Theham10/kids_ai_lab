"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import ParentalGate from "./ParentalGate";
import ParentalGateMath from "./ParentalGateMath";

export interface UserProfile {
    id: string;
    name: string;
    age: number;
    gender: string;
    character: string;
    characterName: string;
    tier: string;
    credits: number;
    email?: string;
    created_at?: string;
}

interface AuthProps {
    onLogin: (user: UserProfile) => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [mode, setMode] = useState<"landing" | "login" | "join" | "avatar_setup">("landing");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("여자아이");
    const [email, setEmail] = useState("");
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState("stella");
    const [characterName, setCharacterName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const characters = [
        { id: "stella", name: "스텔라", img: "/images/stella_char.webp", desc: "빛나는 별의 마법사" },
        { id: "leo", name: "레오", img: "/images/leo_char.webp", desc: "용감한 사자 기사" },
        { id: "coco", name: "코코", img: "/images/coco_char.webp", desc: "호기심 많은 요정" },
        { id: "tobi", name: "토비", img: "/images/tobi_char.webp", desc: "든든한 아기 곰" },
    ];

    const handleLogin = async () => {
        if (!name) return alert("친구! 이름을 알려줘야 마법이 시작돼! 😊");

        setIsLoading(true);
        const adminNames = ["스텔라", "stella", "admin", "마스터", "master"];
        const isAdmin = adminNames.includes(name.trim().toLowerCase());

        try {
            if (isAdmin) {
                onLogin({
                    id: "admin-" + Date.now(),
                    name: name.trim(),
                    age: 7,
                    gender: "Admin",
                    character: "stella",
                    characterName: "마법 마스터",
                    tier: "Pro",
                    credits: 9999,
                });
                return;
            }

            // Normal Login attempt
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('name', name.trim())
                .single();

            if (data) {
                onLogin({
                    ...data,
                    characterName: data.character_name
                });
            } else {
                // Not found - check local cache as fallback?
                const localUser = localStorage.getItem(`offline_user_${name.trim()}`);
                if (localUser) {
                    const parsed = JSON.parse(localUser);
                    alert("기록장에서 잠시 이름을 못 찾았지만, 우리만의 비밀 수첩에서 찾았어! ✨");
                    onLogin(parsed);
                } else {
                    alert("어라? 기록장에서 이름을 찾을 수 없어. 처음 왔다면 가입을 먼저 해볼까? ✨");
                }
            }
        } catch (err) {
            console.error("Login flow error", err);
            alert("마법 통신망에 잠시 문제가 생겼어. 다시 한번 해볼래? ✨");
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!name || !age || !gender || !characterName) return alert("마법의 재료(이름, 나이)가 부족해! 다 적었는지 확인해줄래? ✨");

        const ageNum = parseInt(age);
        if (!privacyConsent) return alert("부모님의 확인이 필요해! 연구소 규칙에 체크해줄래? 🙏");

        setIsLoading(true);

        const newUser: UserProfile = {
            id: crypto.randomUUID(),
            name: name.trim(),
            age: ageNum,
            gender,
            character: selectedCharacter,
            characterName: characterName.trim(),
            tier: "Free",
            credits: 10, // Generous start
            created_at: new Date().toISOString()
        };

        try {
            // STEP 1: Immediate Success via Local Storage (Zero Latency UX)
            localStorage.setItem("magic_user", JSON.stringify(newUser));
            // Also keep as backup for this specific name
            localStorage.setItem(`offline_user_${newUser.name}`, JSON.stringify(newUser));

            // STEP 2: Background Sync to Supabase
            // We don't 'await' it to avoid blocking the user if network is bad
            supabase
                .from('magic_users')
                .insert([{
                    id: newUser.id,
                    name: newUser.name,
                    age: newUser.age,
                    gender: newUser.gender,
                    tier: newUser.tier,
                    credits: newUser.credits,
                    character: newUser.character,
                    character_name: newUser.characterName,
                    created_at: newUser.created_at
                }])
                .then(({ error }) => {
                    if (error) {
                        console.warn("Background DB sync failed (might be adblock)", error);
                        // We don't tell the user, they are already 'logged in' locally.
                    }
                });

            // STEP 3: Proceed to Main Screen
            onLogin(newUser);

        } catch (err) {
            console.error("Critical join error", err);
            alert("마법 가루가 부족한지 가입이 안돼. 일단 마스터 모드로 입장해볼까?");
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (!name) return alert("친구! 이름을 먼저 알려줘! 😊");
        setMode("avatar_setup");
    };

    const buttonStyle = {
        padding: "1rem 2rem",
        fontSize: "1.2rem",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        width: "100%",
        transition: "all 0.3s ease",
    };

    const inputStyle = {
        width: "100%",
        padding: "1rem",
        fontSize: "1.1rem",
        borderRadius: "12px",
        border: "2px solid #E0E0E0",
        marginBottom: "1rem",
        outline: "none",
        textAlign: "center" as const,
        color: "#333",
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #FAD0C4 0%, #FFD1FF 100%)",
            padding: "20px",
            fontFamily: "'Gamja Flower', cursive"
        }}>
            <AnimatePresence mode="wait">
                {mode === "landing" && (
                    <motion.div
                        key="landing"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            padding: "3rem",
                            borderRadius: "32px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            textAlign: "center",
                            maxWidth: "450px",
                            backdropFilter: "blur(10px)",
                            border: "4px solid #fff"
                        }}
                    >
                        <motion.img
                            src="/images/stella_char.webp"
                            alt="Stella"
                            style={{ width: "120px", borderRadius: "50%", marginBottom: "1.5rem", border: "5px solid #FFD1FF" }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <h1 style={{ fontSize: "2.4rem", color: "#6C5CE7", marginBottom: "0.5rem" }}>스텔라 마법 연구소</h1>
                        <p style={{ color: "#888", marginBottom: "2rem", fontSize: "1.1rem" }}>
                            세상에서 단 하나뿐인 <br /> 너만의 동화를 만들어보자! ✨
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...buttonStyle, background: "#6C5CE7", color: "white" }}
                                onClick={() => setMode("avatar_setup")}
                            >
                                처음 왔어요! (모험 시작 ✨)
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ ...buttonStyle, background: "white", color: "#6C5CE7", border: "3px solid #6C5CE7" }}
                                onClick={() => setMode("login")}
                            >
                                이미 친구예요! (다시 입장 🪄)
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {(mode === "login" || mode === "avatar_setup") && (
                    <motion.div
                        key="form"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        style={{
                            background: "white",
                            padding: "2.5rem",
                            borderRadius: "32px",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            width: "100%",
                            maxWidth: "400px",
                            textAlign: "center"
                        }}
                    >
                        <h2 style={{ color: "#6C5CE7", marginBottom: "1.5rem" }}>
                            {mode === "login" ? "다시 만나서 반가워! 👋" : "너의 이름을 알려줘! ✨"}
                        </h2>

                        <input
                            type="text"
                            placeholder="예: 예쁜별"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />

                        {mode === "avatar_setup" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <p style={{ color: "#888", marginBottom: "1rem" }}>너의 나이는 몇 살이야?</p>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                                        {[4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setAge(n.toString())}
                                                style={{
                                                    padding: "0.5rem 1rem",
                                                    borderRadius: "10px",
                                                    border: age === n.toString() ? "2px solid #6C5CE7" : "1px solid #ddd",
                                                    backgroundColor: age === n.toString() ? "#F3F0FF" : "white",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {n}세
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
                                    <motion.button
                                        onClick={() => setGender("여자아이")}
                                        style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: gender === "여자아이" ? "2px solid #FF7597" : "1px solid #ddd", background: gender === "여자아이" ? "#FFF0F3" : "white" }}
                                    >👧 공주님</motion.button>
                                    <motion.button
                                        onClick={() => setGender("남자아이")}
                                        style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: gender === "남자아이" ? "2px solid #4A90E2" : "1px solid #ddd", background: gender === "남자아이" ? "#F0F7FF" : "white" }}
                                    >👦 왕자님</motion.button>
                                </div>
                            </motion.div>
                        )}

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => setMode("landing")}
                                style={{ ...buttonStyle, background: "#eee", color: "#666", flex: 1 }}
                            >뒤로</button>
                            <button
                                onClick={mode === "login" ? handleLogin : () => setMode("join")}
                                style={{ ...buttonStyle, background: "#6C5CE7", color: "white", flex: 2 }}
                                disabled={isLoading}
                            >
                                {isLoading ? "로딩중..." : (mode === "login" ? "입장하기" : "다음으로")}
                            </button>
                        </div>
                    </motion.div>
                )}

                {mode === "join" && (
                    <motion.div
                        key="join"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "white",
                            padding: "2.5rem",
                            borderRadius: "32px",
                            maxWidth: "500px",
                            textAlign: "center"
                        }}
                    >
                        <h2 style={{ color: "#6C5CE7", marginBottom: "1rem" }}>어떤 친구와 함께할까? 🐾</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            {characters.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => setSelectedCharacter(c.id)}
                                    style={{
                                        padding: "1rem",
                                        borderRadius: "20px",
                                        border: selectedCharacter === c.id ? "3px solid #6C5CE7" : "1px solid #eee",
                                        cursor: "pointer",
                                        background: selectedCharacter === c.id ? "#F3F0FF" : "white"
                                    }}
                                >
                                    <img src={c.img} alt={c.name} style={{ width: "60px", borderRadius: "10px", marginBottom: "0.5rem" }} />
                                    <p style={{ fontWeight: "bold" }}>{c.name}</p>
                                    <p style={{ fontSize: "0.8rem", color: "#888" }}>{c.desc}</p>
                                </div>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="이 친구의 이름은?"
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            style={inputStyle}
                        />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginBottom: "1rem" }}>
                            <input type="checkbox" id="consent" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} />
                            <label htmlFor="consent" style={{ fontSize: "0.9rem", color: "#666" }}>부모님! 아이의 정보를 지켜줄게요 🙏</label>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => setMode("avatar_setup")} style={{ ...buttonStyle, background: "#eee", color: "#666", flex: 1 }}>뒤고</button>
                            <button onClick={handleJoin} style={{ ...buttonStyle, background: "#6C5CE7", color: "white", flex: 2 }}>가입 완료!</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div style={{ position: "absolute", bottom: "20px", fontSize: "0.8rem", color: "#aaa" }}>
                v2.0-magic-offline-first
            </div>
        </div>
    );
}
