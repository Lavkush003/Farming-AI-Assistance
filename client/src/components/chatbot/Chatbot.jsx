import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const Chatbot = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
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
        scrollToBottom();
    }, [messages, isTyping]);

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

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text: text, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: data.text, sender: "bot" },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: "Error: " + (data.error || "Failed to reach AI"), sender: "bot" },
                ]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: "Sorry, I am having trouble connecting right now.", sender: "bot" },
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
        recognition.lang = "en-IN"; // Supports Hindi/Marathi accented English too
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

    if (!isOpen) return null;

    const bgColor = isDark ? "#212529" : "#ffffff";
    const textColor = isDark ? "#f8f9fa" : "#212529";
    const borderColor = isDark ? "#495057" : "#dee2e6";
    // Farmer themed green gradient header
    const headerFormat = "text-white";

    return (
        <div
            className="position-fixed shadow-lg rounded-4 overflow-hidden d-flex flex-column"
            style={{
                bottom: "80px",
                right: "20px",
                width: "350px",
                height: "500px",
                zIndex: 9999,
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.3s ease"
            }}
        >
            {/* Header */}
            <div className={`p-3 d-flex justify-content-between align-items-center ${headerFormat}`} style={{ background: "linear-gradient(135deg, #2e7d32, #4caf50)" }}>
                <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">👨‍🌾</span>
                    <h6 className="m-0 fw-bold">FarmingHub Assistant</h6>
                </div>
                <button onClick={onClose} className="btn btn-sm text-white rounded-circle" style={{ width: "30px", height: "30px", padding: 0, backgroundColor: "rgba(255,255,255,0.2)" }}>&times;</button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: isDark ? "#121212" : "#f1f8e9" }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                    >
                        <div
                            className={`p-2 px-3 rounded-4 shadow-sm`}
                            style={{
                                maxWidth: "80%",
                                backgroundColor: msg.sender === "user" ? "#4caf50" : (isDark ? "#2c2c2c" : "#ffffff"),
                                color: msg.sender === "user" ? "#ffffff" : (isDark ? "#ffffff" : "#212529"),
                                borderBottomRightRadius: msg.sender === "user" ? "4px" : "1rem",
                                borderBottomLeftRadius: msg.sender === "bot" ? "4px" : "1rem",
                                whiteSpace: "pre-line",
                                fontSize: "0.95rem"
                            }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="d-flex justify-content-start mb-3">
                        <div className="p-2 px-3 rounded-4 small opacity-75 shadow-sm" style={{ backgroundColor: isDark ? "#2c2c2c" : "#ffffff", color: isDark ? "#fff" : "#000" }}>
                            <span className="typing-dots">Typing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-3 py-2 d-flex gap-2 overflow-auto" style={{ borderTop: `1px solid ${borderColor}`, backgroundColor: isDark ? "#1e1e1e" : "#fafafa" }}>
                {["Soil Types?", "How to Sell?", "Rainfall Predict?"].map((chip) => (
                    <button
                        key={chip}
                        onClick={() => handleSend(chip)}
                        className="btn btn-outline-success btn-sm rounded-pill text-nowrap"
                        style={{ fontSize: "0.85rem", transition: "all 0.2s" }}
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3" style={{ borderTop: `1px solid ${borderColor}`, backgroundColor: isDark ? "#212529" : "#ffffff" }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="d-flex gap-2"
                >
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={{
                            backgroundColor: isDark ? "#2c2c2c" : "#f8f9fa",
                            color: textColor,
                            borderColor: isDark ? "#495057" : "#ced4da",
                            borderRadius: "20px",
                            boxShadow: "none"
                        }}
                    />
                    <button
                        type="button"
                        onClick={startListening}
                        className={`btn rounded-circle d-flex align-items-center justify-content-center ${isListening ? 'btn-danger' : 'btn-outline-success'}`}
                        style={{ width: "40px", height: "40px", border: isListening ? "none" : undefined, animation: isListening ? "pulse 1s infinite" : "none" }}
                        title="Speak"
                    >
                        <i className={`bi ${isListening ? 'bi-mic-fill' : 'bi-mic'}`}></i>
                    </button>
                    <button type="submit" className="btn btn-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #2e7d32, #4caf50)", border: "none" }}>
                        <i className="bi bi-send-fill text-white"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
