"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MagicStyle = "jelly" | "stars" | "superhero" | "rainbow";

export default function MagicMotion({
    onBack,
    user,
    gallery
}: {
    onBack: () => void,
    user: any,
    gallery: string[]
}) {
    const [isWiggling, setIsWiggling] = useState(false);
    const [hasMagic, setHasMagic] = useState(false);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [activeStyle, setActiveStyle] = useState<MagicStyle>("jelly");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const magicStyles = [
        { id: "jelly", name: "말랑말랑 젤리", icon: "🍮", color: "#FF6B9D" },
        { id: "stars", name: "반짝별 우주", icon: "🚀", color: "#4D96FF" },
        { id: "superhero", name: "슈퍼 히어로", icon: "🦸", color: "#FF8C42" },
        { id: "rainbow", name: "무지개 댄스", icon: "🌈", color: "#6BCB77" },
    ];

    const startMotion = () => {
        if (!selectedImg) return alert("먼저 그림을 골라줘! 🎨");

        setIsWiggling(true);
        setHasMagic(false);

        setTimeout(() => {
            setHasMagic(true);
            setIsWiggling(false);
        }, 2500);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                setSelectedImg(f.target?.result as string);
                setHasMagic(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderMagicEffect = () => {
        const commonProps = {
            src: selectedImg!,
            style: { width: "100%", height: "100%", objectFit: "cover" as const }
        };

        switch (activeStyle) {
            case "jelly":
                return (
                    <motion.img
                        {...commonProps}
                        animate={{
                            scaleX: [1, 1.1, 0.9, 1.05, 1],
                            scaleY: [1, 0.9, 1.1, 0.95, 1],
                            borderRadius: ["32px", "40px", "24px", "32px"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                );
            case "stars":
                return (
                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                        <motion.img
                            {...commonProps}
                            animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                        {/* Flying Stars Effect */}
                        {[...Array(15)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: Math.random() * 400 - 200, y: Math.random() * 400 - 200, opacity: 0, scale: 0 }}
                                animate={{
                                    x: [0, (Math.random() - 0.5) * 600],
                                    y: [0, (Math.random() - 0.5) * 600],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0]
                                }}
                                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                                style={{ position: "absolute", top: "50%", left: "50%", fontSize: "1.5rem", pointerEvents: "none" }}
                            >
                                ⭐
                            </motion.div>
                        ))}
                    </div>
                );
            case "superhero":
                return (
                    <motion.img
                        {...commonProps}
                        animate={{
                            scale: [1, 1.2, 1],
                            filter: ["brightness(1) contrast(1)", "brightness(1.5) contrast(1.2)", "brightness(1) contrast(1)"],
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
                    />
                );
            case "rainbow":
                return (
                    <motion.img
                        {...commonProps}
                        animate={{
                            filter: ["hue-rotate(0deg) saturate(1)", "hue-rotate(360deg) saturate(2)", "hue-rotate(0deg) saturate(1)"],
                            y: [-10, 10, -10]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                );
            default:
                return <img {...commonProps} />;
        }
    };

    return (
        <div className="card" style={{ maxWidth: "1000px", margin: "0 auto", border: "5px solid #A29BFE", position: "relative" }}>
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); onBack(); }}
                className="button"
                style={{ background: "none", boxShadow: "none", color: "#666", padding: 0, marginBottom: "1rem" }}
            >
                ← 돌아가기
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ color: "#6C5CE7", fontSize: "2.4rem" }}>무한 매직 모션 🎬</h2>
                <div style={{ background: "linear-gradient(45deg, #FF6B9D, #A29BFE)", color: "white", padding: "8px 20px", borderRadius: "99px", fontSize: "0.9rem", fontWeight: "bold", boxShadow: "0 4px 15px rgba(108, 92, 231, 0.2)" }}>
                    무료 무제한 모션 가동 중 ✨
                </div>
            </div>
            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "2rem" }}>그림에 어떤 매법을 부려볼까? 원하는 스타일을 고르고 마법을 시작해봐!</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2.5rem" }}>
                {/* Left: Configuration */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Section 1: Style Selection */}
                    <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "24px", border: "2px solid #eee" }}>
                        <h4 style={{ marginBottom: "1rem", color: "#2d3436" }}>1. 마법 스타일 고르기</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {magicStyles.map((style) => (
                                <motion.button
                                    key={style.id}
                                    whileHover={{ y: -5, boxShadow: `0 8px 20px ${style.color}30` }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveStyle(style.id as MagicStyle)}
                                    style={{
                                        padding: "1.2rem",
                                        borderRadius: "20px",
                                        border: activeStyle === style.id ? `4px solid ${style.color}` : "2px solid #eee",
                                        background: activeStyle === style.id ? `${style.color}15` : "white",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "8px",
                                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                        boxShadow: activeStyle === style.id ? `0 10px 25px ${style.color}40` : "0 4px 10px rgba(0,0,0,0.02)"
                                    }}
                                >
                                    <span style={{ fontSize: "2.5rem", filter: activeStyle === style.id ? "none" : "grayscale(0.5) opacity(0.7)" }}>{style.icon}</span>
                                    <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: activeStyle === style.id ? style.color : "#999" }}>{style.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Image Selection */}
                    <div style={{ background: "#f8f9fa", padding: "1.5rem", borderRadius: "24px", border: "2px solid #eee" }}>
                        <h4 style={{ marginBottom: "1rem", color: "#2d3436" }}>2. 그림 고르기 (갤러리/파일)</h4>
                        <div style={{ display: "flex", overflowX: "auto", gap: "10px", paddingBottom: "10px" }}>
                            {gallery.length > 0 ? gallery.map((img, i) => (
                                <motion.img
                                    key={i} src={img}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => { setSelectedImg(img); setHasMagic(false); }}
                                    style={{
                                        minWidth: "80px", height: "80px", borderRadius: "12px",
                                        cursor: "pointer", border: selectedImg === img ? "4px solid #6C5CE7" : "2px solid white",
                                        objectFit: "cover"
                                    }}
                                />
                            )) : <p style={{ fontSize: "0.8rem", color: "#999", padding: "10px" }}>그린 그림을 골라보세요!</p>}
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                        <button
                            className="button"
                            style={{ background: "#fff", color: "#6C5CE7", border: "2px solid #6C5CE7", width: "100%", marginTop: "1rem" }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            다른 사진 올리기 📂
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="button"
                        style={{ background: "linear-gradient(45deg, #A29BFE, #6C5CE7)", color: "white", padding: "1.5rem", fontSize: "1.5rem", justifyContent: "center" }}
                        disabled={!selectedImg || isWiggling}
                        onClick={startMotion}
                    >
                        {isWiggling ? "마법 가공 중... ✨" : "마법 시작하기! 🧙‍♂️"}
                    </motion.button>
                </div>

                {/* Right: Magic Preview */}
                <div style={{
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    borderRadius: "40px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    minHeight: "500px",
                    boxShadow: "inset 0 0 50px rgba(0,0,0,0.05), 0 25px 60px rgba(0,0,0,0.1)",
                    border: "8px solid white"
                }}>
                    <AnimatePresence mode="wait">
                        {isWiggling ? (
                            <motion.div
                                key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ textAlign: "center", zIndex: 10 }}
                            >
                                <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: "7rem" }}>🪄</motion.div>
                                <p style={{ marginTop: "2rem", color: "white", fontSize: "1.5rem", fontWeight: "bold" }}>마법 가루를 뿌리는 중이에요!</p>
                            </motion.div>
                        ) : hasMagic && selectedImg ? (
                            <motion.div
                                key="result" initial={{ opacity: 0, filter: "blur(20px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
                                style={{ width: "100%", height: "100%" }}
                            >
                                {renderMagicEffect()}
                                <div style={{ position: "absolute", bottom: "30px", left: "30px", background: "rgba(255,255,255,0.9)", padding: "12px 25px", borderRadius: "99px", color: "#333", fontWeight: "bold", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
                                    ✨ {magicStyles.find(s => s.id === activeStyle)?.name} 마법 적용됨!
                                </div>
                            </motion.div>
                        ) : selectedImg ? (
                            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                <img src={selectedImg} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
                                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚡</div>
                                    <h3 style={{ fontSize: "1.8rem" }}>준비 완료!</h3>
                                    <p style={{ opacity: 0.8 }}>마법을 시작해볼까?</p>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ textAlign: "center", color: "#6C5CE7" }}
                            >
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    style={{ fontSize: "8rem", marginBottom: "1rem", filter: "drop-shadow(0 10px 20px rgba(108, 92, 231, 0.2))" }}
                                >
                                    🎨
                                </motion.div>
                                <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>여기에 {user.name}의 그림을 올려줘! ✨</p>
                                <p style={{ opacity: 0.6, fontSize: "1rem", marginTop: "0.5rem" }}>마법의 붓으로 생명을 불어넣어 줄게.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}