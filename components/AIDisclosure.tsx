"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIDisclosure({
    onClose
}: {
    onClose: () => void;
}) {
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const steps = [
        {
            title: "안녕! 반가워요 ✨",
            text: "나는 너의 마법사 친구 스텔라야! 우리 마법 연구소를 안전하게 사용하는 방법을 알려줄게!",
            image: "/stella_wave.png",
            color: "#A29BFE"
        },
        {
            title: "똑똑한 마법사 로봇 🤖",
            text: "우리 연구소에는 똑똑한 마법사 로봇이 있어. 네가 상상하는 이야기를 멋지게 들려주고, 예쁜 그림도 그려준단다!",
            image: "/stella_magic.png",
            color: "#FF8C42"
        },
        {
            title: "안심하고 놀아요 🛡️",
            text: "걱정 마! 로봇은 비밀을 잘 지키고, 나쁜 내용은 보여주지 않아. 부모님도 항상 우리를 도와주실 거야!",
            image: "/stella_char.png",
            color: "#FF6B6B"
        },
        {
            title: "우리들의 약속 🤝",
            text: "마지막 약속! 로봇은 진짜 친구는 아니야. 그러니까 큰 비밀은 말하지 말자. 이상한 게 나오면 꼭 부모님께 말해줘!",
            image: "/stella_char.png",
            color: "#6BCB77"
        },
        {
            title: "이제 출발! 🚀",
            text: "이제 모든 준비가 끝났어! 우리 같이 신비한 마법 여행을 떠나볼까?",
            image: "/stella_wave.png",
            color: "#4D96FF"
        }
    ];

    const speak = async (text: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setIsSpeaking(true);
        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error("TTS failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            await audio.play();
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
        }
    };

    useEffect(() => {
        speak(steps[step].text);
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [step]);

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "2rem",
                backdropFilter: "blur(8px)"
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ x: 50, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -50, opacity: 0, scale: 1.1 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    style={{
                        maxWidth: "500px",
                        width: "100%",
                        padding: "3rem 2rem",
                        background: "white",
                        borderRadius: "40px",
                        textAlign: "center",
                        position: "relative",
                        border: `6px solid ${steps[step].color}`,
                        boxShadow: `0 30px 60px rgba(0,0,0,0.3)`
                    }}
                >
                    {/* Character Avatar */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: isSpeaking ? [0, -2, 2, 0] : 0
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: isSpeaking ? 0.3 : 2,
                            ease: "easeInOut"
                        }}
                        style={{ marginBottom: "2rem" }}
                    >
                        <img
                            src={steps[step].image}
                            alt="Stella"
                            style={{
                                width: "180px",
                                height: "180px",
                                borderRadius: "40px",
                                objectFit: "cover",
                                border: `4px solid ${steps[step].color}`,
                                boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                            }}
                        />
                    </motion.div>

                    <motion.h2
                        layoutId="title"
                        style={{ color: steps[step].color, fontSize: "2.2rem", marginBottom: "1.5rem", fontWeight: "bold" }}
                    >
                        {steps[step].title}
                    </motion.h2>

                    <div style={{ minHeight: "100px", marginBottom: "2.5rem" }}>
                        <p style={{ fontSize: "1.4rem", color: "#444", lineHeight: "1.6", wordBreak: "keep-all" }}>
                            {steps[step].text}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "2rem" }}>
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: i === step ? "30px" : "12px",
                                    height: "12px",
                                    borderRadius: "10px",
                                    background: i === step ? steps[step].color : "#eee",
                                    transition: "all 0.3s ease"
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextStep}
                        style={{
                            width: "100%",
                            padding: "1.2rem",
                            borderRadius: "20px",
                            border: "none",
                            background: steps[step].color,
                            color: "white",
                            fontSize: "1.4rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            boxShadow: `0 10px 20px -5px ${steps[step].color}66`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                        }}
                    >
                        {step === steps.length - 1 ? "마법 여행 시작하기! 🚀" : "다음 이야기 듣기 ➔"}
                    </button>

                    {isSpeaking && (
                        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "4px" }}>
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [5, 15, 5] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    style={{ width: "4px", background: steps[step].color, borderRadius: "2px" }}
                                />
                            ))}
                            <span style={{ fontSize: "0.8rem", color: "#999", marginLeft: "5px" }}>스텔라가 설명하고 있어요...</span>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
