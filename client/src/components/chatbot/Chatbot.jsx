import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import chatbotIcon from "../../assets/chatbot-icon.jpg";

const Chatbot = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hi ${user?.name || "there"}! 👋 I'm your FarmingHub Assistant. How can I help you today?`,
            sender: "bot",
        },
    ]);

    const isDark = theme === "dark";

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, messages, isTyping]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Initial greeting update if user logs in while chat is open
    useEffect(() => {
        if (messages.length === 1 && user?.name) {
            setMessages([
                {
                    id: 1,
                    text: `Hi ${user.name}! 👋 I'm your FarmingHub Assistant. How can I help you today?`,
                    sender: "bot",
                },
            ]);
        }
    }, [user]);

    const handleSend = async (textToSend) => {
        const text = (typeof textToSend === "string" ? textToSend : input).trim();
        if (!text) return;

        const userMsg = { id: Date.now(), text: text, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            if (response.ok && data.text) {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: data.text, sender: "bot" },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: "Error: " + (data.error || "Failed to reach AI Assistant. Please try again."), sender: "bot" },
                ]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: "Sorry, I am having trouble connecting right now. Please check your internet or try again later.", sender: "bot" },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    // Voice Recognition (Web Speech API)
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN"; // Supports Indian accented English
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognition.start();
    };

    // Render message with basic bold markdown support
    const renderFormattedText = (rawText) => {
        if (!rawText) return "";
        const parts = rawText.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={idx}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    if (!isOpen) return null;

    const bgColor = isDark ? "#1b241b" : "#ffffff";
    const textColor = isDark ? "#f0f4ee" : "#212529";
    const borderColor = isDark ? "rgba(76, 175, 80, 0.25)" : "#dee2e6";

    return (
        <div
            className="position-fixed shadow-lg rounded-4 overflow-hidden d-flex flex-column"
            style={{
                bottom: "24px",
                right: "24px",
                width: "380px",
                maxWidth: "calc(100vw - 32px)",
                height: "540px",
                maxHeight: "calc(100vh - 100px)",
                zIndex: 9999,
                backgroundColor: bgColor,
                border: `1.5px solid ${borderColor}`,
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                animation: "chatbotFadeIn 0.25s ease-out"
            }}
        >
            {/* Header */}
            <div
                className="p-3 d-flex justify-content-between align-items-center text-white"
                style={{
                    background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.15)"
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={chatbotIcon}
                        alt="Assistant"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #ffd54f",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}
                    />
                    <div>
                        <h6 className="m-0 fw-bold" style={{ fontSize: "0.95rem", letterSpacing: "0.2px" }}>
                            FarmingHub Assistant
                        </h6>
                        <small style={{ fontSize: "0.75rem", color: "#a5d6a7" }}>
                            🟢 Online | Smart Farming AI
                        </small>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="btn btn-sm text-white rounded-circle d-flex align-items-center justify-content-center p-0"
                    style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(255,255,255,0.18)",
                        fontSize: "1.2rem",
                        lineHeight: 1
                    }}
                    title="Close Chat"
                    aria-label="Close Chat"
                >
                    &times;
                </button>
            </div>

            {/* Messages Area */}
            <div
                className="flex-grow-1 p-3 overflow-auto"
                style={{
                    backgroundColor: isDark ? "#121a12" : "#f4f8f3",
                    scrollBehavior: "smooth"
                }}
            >
                {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                        <div
                            key={msg.id}
                            className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}
                        >
                            <div
                                className="p-2 px-3 rounded-4 shadow-sm"
                                style={{
                                    maxWidth: "84%",
                                    backgroundColor: isUser
                                        ? "#2e7d32"
                                        : isDark
                                        ? "#223122"
                                        : "#ffffff",
                                    color: isUser
                                        ? "#ffffff"
                                        : isDark
                                        ? "#e8f5e9"
                                        : "#1e2d1e",
                                    borderBottomRightRadius: isUser ? "4px" : "1rem",
                                    borderBottomLeftRadius: isUser ? "1rem" : "4px",
                                    border: isUser ? "none" : `1px solid ${borderColor}`,
                                    whiteSpace: "pre-line",
                                    fontSize: "0.92rem",
                                    lineHeight: "1.45"
                                }}
                            >
                                {renderFormattedText(msg.text)}
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="d-flex justify-content-start mb-3">
                        <div
                            className="p-2 px-3 rounded-4 small shadow-sm d-flex align-items-center gap-2"
                            style={{
                                backgroundColor: isDark ? "#223122" : "#ffffff",
                                color: isDark ? "#a5d6a7" : "#2e7d32",
                                border: `1px solid ${borderColor}`
                            }}
                        >
                            <span className="spinner-grow spinner-grow-sm" role="status"></span>
                            <span>Assistant is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div
                className="px-3 py-2 d-flex gap-2 overflow-auto"
                style={{
                    borderTop: `1px solid ${borderColor}`,
                    backgroundColor: isDark ? "#182218" : "#f9fcf8",
                    scrollbarWidth: "none"
                }}
            >
                {["Soil Types?", "How to Sell?", "Rainfall Predict?", "Crop Advisory"].map((chip) => (
                    <button
                        key={chip}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="btn btn-outline-success btn-sm rounded-pill text-nowrap"
                        style={{
                            fontSize: "0.8rem",
                            padding: "4px 12px",
                            transition: "all 0.2s"
                        }}
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div
                className="p-3"
                style={{
                    borderTop: `1px solid ${borderColor}`,
                    backgroundColor: isDark ? "#1b241b" : "#ffffff"
                }}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="d-flex gap-2 align-items-center"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        placeholder="Ask FarmingHub AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            backgroundColor: isDark ? "#223122" : "#f4f8f3",
                            color: textColor,
                            borderColor: borderColor,
                            borderRadius: "20px",
                            boxShadow: "none",
                            fontSize: "0.92rem",
                            padding: "8px 16px"
                        }}
                    />
                    <button
                        type="button"
                        onClick={startListening}
                        className={`btn rounded-circle d-flex align-items-center justify-content-center ${isListening ? "btn-danger" : "btn-outline-success"}`}
                        style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            border: isListening ? "none" : undefined
                        }}
                        title={isListening ? "Listening..." : "Speak (Voice Input)"}
                    >
                        <i className={`bi ${isListening ? "bi-mic-fill" : "bi-mic"}`}></i>
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "40px",
                            height: "40px",
                            flexShrink: 0,
                            background: "linear-gradient(135deg, #2e7d32, #4caf50)",
                            border: "none"
                        }}
                        title="Send Message"
                        disabled={!input.trim()}
                    >
                        <i className="bi bi-send-fill text-white"></i>
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes chatbotFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
