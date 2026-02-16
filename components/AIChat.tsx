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
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const characterMap: Record<string, string> = {
        stella: "/pet_puppy.png",
        leo: "/pet_kitten.png",
        pinky: "/pet_panda.png",
        bolt: "/pet_rabbit.png"
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

    const speak = async (text: string) => {
        if (isSpeaking) {
            const audioElements = document.getElementsByTagName('audio');
            for (let i = 0; i < audioElements.length; i++) {
                if (audioElements[i].id === 'stella-voice-chat') {
                    audioElements[i].pause();
                    audioElements[i].remove();
                }
            }
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);

        try {
            const response = await fetch(`${API_BASE}/api/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error("TTS failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.id = 'stella-voice-chat';

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(url);
            };

            audio.play();
        } catch (error) {
            console.error("TTS Error:", error);
            setIsSpeaking(false);
        }
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

    const generateAIResponse = async (userMessage: string): Promise<string> => {
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

            const response = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    characterName: user.characterName || "AI 친구",
                    userName: user.name,
                    conversationHistory: messages.slice(-10) // Send last 10 messages for context
                })
            });

            const data = await response.json();

            if (data.error) {
                return `앗, 지금은 대화하기 어려워! 😅 ${data.error}`;
            }

            return data.response || "음... 뭔가 잘 안 되는 것 같아. 다시 한번 말해줄래? 🤔";
        } catch (error) {
            console.error("Chat API Error:", error);
            return "지금은 인터넷이 불안정한가봐. 잠시 후에 다시 얘기하자! 📡";
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: "user",
            timestamp: new Date()
        };

        const currentInput = inputText; // Save current input
        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        // Get AI response
        try {
            const aiResponseText = await generateAIResponse(currentInput);
            const aiResponse: Message = {
                id: Date.now() + 1,
                text: aiResponseText,
                sender: "ai",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            const errorResponse: Message = {
                id: Date.now() + 1,
                text: "죄송해! 지금은 대화하기 힘들어. 다시 시도해줄래? 😅",
                sender: "ai",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
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
                                    fontSize: "1.5rem", flexShrink: 0, overflow: "hidden"
                                }}>
                                    <img src={characterMap[user.character || "stella"]} alt="Pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                                    {msg.sender === "ai" && (
                                        <button
                                            onClick={() => speak(msg.text)}
                                            style={{
                                                background: "none", border: "none", cursor: "pointer",
                                                fontSize: "0.9rem", color: "#666",
                                                padding: "0 5px"
                                            }}
                                        >
                                            {isSpeaking ? "⏹️" : "🔈"}
                                        </button>
                                    )}
                                    <p style={{
                                        margin: 0,
                                        fontSize: "0.7rem",
                                        opacity: 0.6,
                                        flex: 1,
                                        textAlign: "right"
                                    }}>
                                        {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
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
                            fontSize: "1.5rem", overflow: "hidden"
                        }}>
                            <img src={characterMap[user.character || "stella"]} alt="Pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
