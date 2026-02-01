"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ParentalGateMath({
    onSuccess,
    onCancel
}: {
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState(false);
    const [question] = useState(() => {
        const num1 = Math.floor(Math.random() * 20) + 10;
        const num2 = Math.floor(Math.random() * 20) + 10;
        return { num1, num2, correctAnswer: num1 + num2 };
    });

    const handleSubmit = () => {
        if (parseInt(answer) === question.correctAnswer) {
            onSuccess();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
            setAnswer("");
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
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "2rem"
            }}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="card"
                style={{
                    maxWidth: "450px",
                    width: "100%",
                    padding: "2.5rem",
                    textAlign: "center",
                    background: "white",
                    borderRadius: "32px"
                }}
            >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
                <h2 style={{ fontSize: "1.8rem", color: "#6C5CE7", marginBottom: "1rem" }}>
                    보호자 확인
                </h2>
                <p style={{ color: "#666", marginBottom: "2rem", fontSize: "1rem" }}>
                    이 영역은 부모님만 접근할 수 있어요.<br />
                    아래 문제를 풀어주세요.
                </p>

                <div style={{
                    background: "#f9f9ff",
                    padding: "1.5rem",
                    borderRadius: "20px",
                    marginBottom: "1.5rem",
                    border: "2px solid #A29BFE"
                }}>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2d3436" }}>
                        {question.num1} + {question.num2} = ?
                    </div>
                </div>

                <input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="답을 입력하세요"
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "1.2rem",
                        borderRadius: "16px",
                        border: error ? "3px solid #ff6b6b" : "2px solid #f1f2f6",
                        textAlign: "center",
                        marginBottom: "1.5rem",
                        outline: "none"
                    }}
                />

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "#ffe5e5",
                            color: "#d63031",
                            padding: "0.8rem",
                            borderRadius: "12px",
                            marginBottom: "1rem",
                            fontSize: "0.9rem"
                        }}
                    >
                        답이 맞지 않아요. 다시 시도해주세요.
                    </motion.div>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: "1rem",
                            borderRadius: "16px",
                            border: "2px solid #ddd",
                            background: "white",
                            color: "#666",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="button"
                        style={{
                            flex: 1,
                            padding: "1rem",
                            borderRadius: "16px",
                            border: "none",
                            background: "linear-gradient(45deg, #6C5CE7, #A29BFE)",
                            color: "white",
                            fontSize: "1rem",
                            cursor: "pointer"
                        }}
                    >
                        확인
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
