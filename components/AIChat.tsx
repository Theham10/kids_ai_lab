"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

export default function AIChat({ onBack, user }: { onBack: () => void; user: any }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const characterMap: Record<string, string> = {
        stella: "✨",
        leo: "🦁",
        pinky: "🦄",
        bolt: "🤖"
    };

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history from localStorage
    useEffect(() => {
        const savedChat = localStorage.getItem(`chat_history_${user.character}`);
        if (savedChat) {
            try {
                const parsed = JSON.parse(savedChat);
                setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
            } catch (e) {
                console.error("Failed to load chat history", e);
            }
        } else {
            // Welcome message
            setMessages([{
                id: 1,
                text: `안녕 ${user.name}! 나는 ${user.characterName}이야! 무엇이든 물어봐! 🌟`,
                sender: "ai",
                timestamp: new Date()
            }]);
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_history_${user.character}`, JSON.stringify(messages));
        }
    }, [messages, user.character]);

    const generateAIResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        // Simple response patterns
        if (lowerMsg.includes("안녕") || lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
            return `안녕! ${user.name}! 오늘 하루는 어때? 😊`;
        }
        if (lowerMsg.includes("이름") || lowerMsg.includes("name")) {
            return `내 이름은 ${user.characterName}이야! 너의 AI 친구야! 💫`;
        }
        if (lowerMsg.includes("도와") || lowerMsg.includes("help")) {
            return "물론이지! 무엇을 도와줄까? 질문이 있으면 언제든지 물어봐! 🌈";
        }
        if (lowerMsg.includes("좋아하") || lowerMsg.includes("favorite") || lowerMsg.includes("like")) {
            return "나는 너와 함께 상상하고 창작하는 걸 제일 좋아해! 그림도 그리고 이야기도 만들면서 말이야! 🎨✨";
        }
        if (lowerMsg.includes("재미") || lowerMsg.includes("fun")) {
            return "같이 스토리 마법이나 매직 캔버스에서 놀아볼까? 정말 재미있을 거야! 🚀";
        }
        if (lowerMsg.includes("고마") || lowerMsg.includes("thank")) {
            return "천만에! 언제든지 나를 찾아줘! 항상 여기 있을게! 💖";
        }
        if (lowerMsg.includes("사랑") || lowerMsg.includes("love")) {
            return "나도 너를 사랑해! 우리 영원한 친구야! 🌟💕";
        }
        if (lowerMsg.includes("뭐해") || lowerMsg.includes("what are you doing")) {
            return "너와 대화하는 중이지! 이게 내가 제일 좋아하는 일이야! 😄";
        }

        // Default responses
        const defaultResponses = [
            "흥미로운 질문이네! 더 자세히 말해줄래? 🤔",
            "와, 정말 재미있는 얘기야! 더 들려줘! 🌟",
            "그렇구나! 나도 그것에 대해 더 알고 싶어! 💭",
            "좋은 생각이야! 우리 같이 더 탐험해볼까? 🚀",
            `${user.name}, 너는 정말 똑똑해! 💡`,
            "오~ 대단한데! 계속 얘기해봐! ✨"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Simulate AI thinking and response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: generateAIResponse(inputText),
                sender: "ai",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 800 + Math.random() * 1200);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="card" style={{ maxWidth: "900px", margin: "0 auto", height: "85vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "2px solid #f1f2f6" }}>
                <button onClick={onBack} className="button" style={{ background: "none", boxShadow: "none", color: "#666", padding: 0 }}>
                    ← 돌아가기
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
                        border: "3px solid #f1f2f6"
                    }}>
                        {characterMap[user.character || "stella"]}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#2d3436" }}>{user.characterName}</h3>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#999" }}>AI 친구</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem 0",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                display: "flex",
                                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                gap: "10px"
                            }}
                        >
                            {msg.sender === "ai" && (
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.5rem", flexShrink: 0
                                }}>
                                    {characterMap[user.character || "stella"]}
                                </div>
                            )}
                            <div style={{
                                maxWidth: "70%",
                                padding: "1rem 1.5rem",
                                borderRadius: msg.sender === "user" ? "20px 20px 5px 20px" : "20px 20px 20px 5px",
                                background: msg.sender === "user"
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    : "#f8f9fa",
                                color: msg.sender === "user" ? "white" : "#2d3436",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                            }}>
                                <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.5" }}>{msg.text}</p>
                                <p style={{
                                    margin: "0.5rem 0 0 0",
                                    fontSize: "0.7rem",
                                    opacity: 0.6,
                                    textAlign: "right"
                                }}>
                                    {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {msg.sender === "user" && (
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FF9F43, #FF8C42)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.2rem", fontWeight: "bold", color: "white", flexShrink: 0
                                }}>
                                    {user.name[0]}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: "flex", gap: "10px", alignItems: "center" }}
                    >
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem"
                        }}>
                            {characterMap[user.character || "stella"]}
                        </div>
                        <div style={{
                            padding: "1rem 1.5rem",
                            borderRadius: "20px 20px 20px 5px",
                            background: "#f8f9fa",
                            display: "flex",
                            gap: "5px"
                        }}>
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                style={{ fontSize: "1.5rem" }}
                            >●</motion.span>
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                style={{ fontSize: "1.5rem" }}
                            >●</motion.span>
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                style={{ fontSize: "1.5rem" }}
                            >●</motion.span>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "2px solid #f1f2f6",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-end"
            }}>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`${user.characterName}에게 메시지를 보내보세요...`}
                    style={{
                        flex: 1,
                        padding: "1rem 1.5rem",
                        borderRadius: "20px",
                        border: "2px solid #e0e0e0",
                        fontSize: "1rem",
                        fontFamily: "inherit",
                        resize: "none",
                        minHeight: "60px",
                        maxHeight: "120px",
                        outline: "none",
                        transition: "border-color 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!inputText.trim() || isTyping}
                    className="button"
                    style={{
                        background: inputText.trim() && !isTyping
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#e0e0e0",
                        color: "white",
                        padding: "1rem 2rem",
                        fontSize: "1.1rem",
                        border: "none",
                        cursor: inputText.trim() && !isTyping ? "pointer" : "not-allowed"
                    }}
                >
                    전송 💬
                </motion.button>
            </div>
        </div>
    );
}
