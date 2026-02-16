"use client";
import { motion } from "framer-motion";

export default function AIDisclosure({
    onClose
}: {
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "2rem",
                overflowY: "auto"
            }}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="card"
                style={{
                    maxWidth: "600px",
                    width: "100%",
                    padding: "2.5rem",
                    background: "white",
                    borderRadius: "32px",
                    maxHeight: "90vh",
                    overflowY: "auto"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <img src="/stella_char.png" alt="Stella" style={{ width: "120px", height: "120px", borderRadius: "30px", objectFit: "cover", border: "4px solid #A29BFE" }} />
                </div>
                <h2 style={{ fontSize: "2rem", color: "#6C5CE7", marginBottom: "1.5rem", textAlign: "center" }}>
                    마법사 로봇 친구는 누구인가요?
                </h2>

                <div style={{ textAlign: "left", lineHeight: "1.8" }}>
                    <div style={{
                        background: "#f9f9ff",
                        padding: "1.5rem",
                        borderRadius: "20px",
                        marginBottom: "1.5rem",
                        border: "2px solid #A29BFE"
                    }}>
                        <h3 style={{ color: "#6C5CE7", fontSize: "1.3rem", marginBottom: "1rem" }}>✨ 마법사 로봇은요...</h3>
                        <ul style={{ paddingLeft: "1.5rem", color: "#2d3436" }}>
                            <li style={{ marginBottom: "0.8rem" }}>어려운 이야기를 <strong>재미있고 쉽게 만들어줘요</strong></li>
                            <li style={{ marginBottom: "0.8rem" }}>내가 생각한 걸 <strong>멋진 그림으로 그려줘요</strong></li>
                            <li style={{ marginBottom: "0.8rem" }}>나의 창작을 도와주는 <strong>똑똑한 마법 도구</strong>예요</li>
                        </ul>
                    </div>

                    <div style={{
                        background: "#fff4e5",
                        padding: "1.5rem",
                        borderRadius: "20px",
                        marginBottom: "1.5rem",
                        border: "2px solid #FFAD33"
                    }}>
                        <h3 style={{ color: "#663C00", fontSize: "1.3rem", marginBottom: "1rem" }}>🛡️ 걱정 마세요! 안전해요</h3>
                        <ul style={{ paddingLeft: "1.5rem", color: "#663C00" }}>
                            <li style={{ marginBottom: "0.8rem" }}>로봇은 <strong>나의 비밀을 어디에도 말하지 않아요</strong></li>
                            <li style={{ marginBottom: "0.8rem" }}>매번 <strong>새롭고 신기한 것</strong>을 만들어줘요</li>
                            <li style={{ marginBottom: "0.8rem" }}>나쁜 내용은 <strong>나오지 않게 막아줘요</strong></li>
                            <li style={{ marginBottom: "0.8rem" }}>부모님이 언제든지 <strong>함께 확인</strong>하고 도와주실 거예요</li>
                        </ul>
                    </div>

                    <div style={{
                        background: "#e8f5e9",
                        padding: "1.5rem",
                        borderRadius: "20px",
                        marginBottom: "2rem",
                        border: "2px solid #6BCB77"
                    }}>
                        <h3 style={{ color: "#2d5016", fontSize: "1.3rem", marginBottom: "1rem" }}>🎯 기억하자!</h3>
                        <ul style={{ paddingLeft: "1.5rem", color: "#2d5016" }}>
                            <li style={{ marginBottom: "0.8rem" }}>AI는 <strong>도구</strong>일 뿐이에요 (진짜 친구는 아니야!)</li>
                            <li style={{ marginBottom: "0.8rem" }}>이상한 결과가 나오면 <strong>부모님께 말씀드려요</strong></li>
                            <li style={{ marginBottom: "0.8rem" }}>혼자만의 비밀이나 개인정보는 <strong>절대 입력하지 마세요</strong></li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="button"
                    style={{
                        width: "100%",
                        padding: "1.2rem",
                        borderRadius: "16px",
                        border: "none",
                        background: "linear-gradient(45deg, #6C5CE7, #A29BFE)",
                        color: "white",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    알겠어요! 마법 여행 시작! 🚀
                </button>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "#999" }}>
                    궁금한 점이 있으면 언제든지 부모님께 물어보세요!
                </p>
            </motion.div>
        </motion.div>
    );
}
