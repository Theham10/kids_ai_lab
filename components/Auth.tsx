"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

export interface UserProfile {
    id: string;
    name: string;
    age: number;
    gender: string;
    character: string;
    characterName: string;
    tier: string;
    credits: number;
    created_at?: string;
}

interface AuthProps {
    onLogin: (user: UserProfile) => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [mode, setMode] = useState<"landing" | "login" | "join" | "setup">("landing");
    const [name, setName] = useState("");
    const [age, setAge] = useState(7);
    const [gender, setGender] = useState("여자아이");
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
        if (!name.trim()) return alert("친구! 이름을 알려줘야 마법이 시작돼! 😊");

        setIsLoading(true);
        const trimmedName = name.trim();
        const adminNames = ["스텔라", "stella", "admin", "마스터", "master"];

        if (adminNames.includes(trimmedName.toLowerCase())) {
            onLogin({
                id: "admin-" + Date.now(),
                name: trimmedName,
                age: 7,
                gender: "Master",
                character: "stella",
                characterName: "마법 마스터",
                tier: "Pro",
                credits: 9999,
            });
            return;
        }

        try {
            // 1. Try DB first
            const { data, error } = await supabase
                .from('magic_users')
                .select('*')
                .eq('name', trimmedName)
                .single();

            if (data) {
                onLogin({ ...data, characterName: data.character_name });
                return;
            }

            // 2. Fallback to LocalStorage if DB fails/blocked
            const cached = localStorage.getItem(`magic_cache_${trimmedName}`);
            if (cached) {
                onLogin(JSON.parse(cached));
                return;
            }

            alert("기록장에서 마법 친구를 찾지 못했어. 처음 모험을 시작한다면 가입을 먼저 해볼까? ✨");
        } catch (e) {
            console.error(e);
            alert("마법 통신이 조금 불안해. 다시 한번 해보거나 가입을 시도해볼까? ✨");
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinAction = () => {
        if (!name.trim() || !characterName.trim()) {
            return alert("이름이랑 친구 이름을 모두 알려줘야 모험을 떠날 수 있어! ✨");
        }

        setIsLoading(true);

        const newUser: UserProfile = {
            id: crypto.randomUUID(),
            name: name.trim(),
            age: age,
            gender: gender,
            character: selectedCharacter,
            characterName: characterName.trim(),
            tier: "Free",
            credits: 10,
            created_at: new Date().toISOString()
        };

        // 🛡️ ZERO-DEFECT STRATEGY: 
        // 1. Save to LocalStorage IMMEDIATELY (Proceed UX)
        localStorage.setItem("magic_user", JSON.stringify(newUser));
        localStorage.setItem(`magic_cache_${newUser.name}`, JSON.stringify(newUser));

        // 2. Proceed to App (User is happy)
        onLogin(newUser);

        // 3. Sync to Supabase in BACKGROUND (No await, no blocking)
        supabase.from('magic_users').insert([{
            id: newUser.id,
            name: newUser.name,
            age: newUser.age,
            gender: newUser.gender,
            character: newUser.character,
            character_name: newUser.characterName,
            tier: newUser.tier,
            credits: newUser.credits,
            created_at: newUser.created_at
        }]).then(({ error }) => {
            if (error) console.warn("Background sync failed (Silent):", error);
        });
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)", padding: "20px"
        }}>
            <AnimatePresence mode="wait">
                {mode === "landing" && (
                    <motion.div
                        key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        style={{ background: "white", padding: "3rem", borderRadius: "40px", textAlign: "center", maxWidth: "450px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
                    >
                        <motion.img src="/images/stella_char.webp" style={{ width: "120px", borderRadius: "30px", marginBottom: "1.5rem" }} animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} />
                        <h1 style={{ color: "#6C5CE7", fontSize: "2.2rem", marginBottom: "1rem" }}>스텔라 마법 상점</h1>
                        <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "2rem" }}>너만의 동화가 기다리고 있어! ✨</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <button className="magic-button primary" onClick={() => setMode("setup")}>처음 왔어요! ✨</button>
                            <button className="magic-button secondary" onClick={() => setMode("login")}>이미 친구예요 🪄</button>
                        </div>
                    </motion.div>
                )}

                {(mode === "login" || mode === "setup") && (
                    <motion.div
                        key="setup" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                        style={{ background: "white", padding: "2.5rem", borderRadius: "40px", width: "100%", maxWidth: "400px", textAlign: "center" }}
                    >
                        <h2 style={{ color: "#6C5CE7", marginBottom: "1.5rem" }}>{mode === "login" ? "다시 만나서 반가워!" : "우리 친구의 이름은?"}</h2>
                        <input className="magic-input" placeholder="너의 이름 (예: 예쁜달)" value={name} onChange={(e) => setName(e.target.value)} />

                        {mode === "setup" && (
                            <div style={{ marginTop: "1rem" }}>
                                <p style={{ color: "#888", marginBottom: "0.5rem" }}>나이는 몇 살인가요? ({age}살)</p>
                                <input type="range" min="4" max="10" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#6C5CE7" }} />
                                <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                                    <div className={`tag ${gender === "여자아이" ? "active" : ""}`} onClick={() => setGender("여자아이")}>👧 공주님</div>
                                    <div className={`tag ${gender === "남자아이" ? "active" : ""}`} onClick={() => setGender("남자아이")}>👦 왕자님</div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", marginTop: "2rem" }}>
                            <button className="magic-button mini" onClick={() => setMode("landing")}>뒤로</button>
                            <button className="magic-button primary flex2" onClick={mode === "login" ? handleLogin : () => setMode("join")}>
                                {isLoading ? "마법 부리는 중..." : "다음으로 ✨"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {mode === "join" && (
                    <motion.div
                        key="join" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ background: "white", padding: "2.5rem", borderRadius: "40px", width: "100%", maxWidth: "500px", textAlign: "center" }}
                    >
                        <h2 style={{ color: "#6C5CE7", marginBottom: "1.5rem" }}>모험을 함께할 친구야! 🐾</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "1.5rem" }}>
                            {characters.map(c => (
                                <div key={c.id} className={`char-card ${selectedCharacter === c.id ? "active" : ""}`} onClick={() => setSelectedCharacter(c.id)}>
                                    <img src={c.img} style={{ width: "50px", borderRadius: "10px" }} />
                                    <p style={{ fontWeight: "bold" }}>{c.name}</p>
                                </div>
                            ))}
                        </div>
                        <input className="magic-input" placeholder="이 친구의 이름은? (예: 솜사탕)" value={characterName} onChange={(e) => setCharacterName(e.target.value)} />

                        <div style={{ display: "flex", gap: "10px", marginTop: "2rem" }}>
                            <button className="magic-button mini" onClick={() => setMode("setup")}>뒤로</button>
                            <button className="magic-button primary flex2" onClick={handleJoinAction}>기록 완료! 떠나자 🚀</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .magic-button { border: none; padding: 1rem; border-radius: 20px; font-weight: bold; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 1.1rem; }
                .primary { background: #6C5CE7; color: white; width: 100%; box-shadow: 0 10px 20px rgba(108, 92, 231, 0.3); }
                .secondary { background: #F3F0FF; color: #6C5CE7; width: 100%; border: 2px solid #6C5CE7; }
                .mini { background: #eee; color: #666; padding: 0.8rem 1.5rem; }
                .flex2 { flex: 2; }
                .magic-input { width: 100%; padding: 1rem; border-radius: 15px; border: 2px solid #eee; font-size: 1.1rem; outline: none; text-align: center; color: #6C5CE7; }
                .magic-input:focus { border-color: #6C5CE7; }
                .tag { flex: 1; padding: 0.8rem; border-radius: 12px; background: #f5f5f5; cursor: pointer; border: 2px solid transparent; }
                .tag.active { background: #F3F0FF; border-color: #6C5CE7; color: #6C5CE7; }
                .char-card { padding: 1rem; border-radius: 20px; border: 2px solid #eee; cursor: pointer; transition: all 0.2s; }
                .char-card.active { border-color: #6C5CE7; background: #F3F0FF; }
            `}</style>

            <div style={{ position: "absolute", bottom: "10px", color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>
                PRIME v3.0 - STABLE
            </div>
        </div>
    );
}
