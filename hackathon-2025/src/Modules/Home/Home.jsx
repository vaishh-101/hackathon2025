import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Home.css";

const BOT_NAME = "Tech Assistant";
const USER_NAME = "You";
const API_URL = "https://6e39-27-107-27-130.ngrok-free.app/prompt";
const BOT_IMAGE =
  "https://cdn.vectorstock.com/i/500p/39/44/cartoon-robot-isolated-on-a-white-background-vector-25753944.jpg";

function Home() {

  const [showWait, setshowWait] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: BOT_NAME,
      text: "Welcome to Tech Assistant! How can I assist you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const formatDate = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const addMessage = (sender, text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender, text, time: new Date() },
    ]);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (!trimmedInput) return;
  
      addMessage(USER_NAME, trimmedInput);
      setInput(""); // Immediately clear input
  
      const greetings = ["hi", "hello", "hey", "greetings"];
      if (greetings.includes(trimmedInput.toLowerCase())) {
        addMessage(BOT_NAME, "Hello! How can I assist you today?");
        return;
      }
  
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmedInput }),
        });
  
        if (!response.ok) throw new Error("Failed to fetch response");
  
        const data = await response.json();
        
        const filteredData = data.response?.raw_results?.filter(
          (obj) => Object.keys(obj).length > 0
        );
  
        if (!filteredData || filteredData.length === 0) {
          addMessage(
            BOT_NAME,
            "No Response"
          );
          return;
        }
  
        // Convert response to text format
        const messageText = filteredData
        .map((entity) => JSON.stringify(entity, null, 2)) // Pretty-print JSON
        .join("\n\n"); // Separate objects with a newline
      
  
        addMessage(BOT_NAME, messageText);
      } catch (error) {
        console.error("Error fetching data:", error);
        addMessage(BOT_NAME, "No Response");
      }
    },
    [input]
  );
  
  
  return (
    <div className={`msger ${theme}`}>
      <header className="msger-header">
        <div className="msger-header-title">
          <i className="fas fa-comment-alt"></i>
          <h3>Tech Assistant</h3>
        </div>
      </header>

      <main className="msger-chat" ref={chatRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`msg ${message.sender === BOT_NAME ? "left-msg" : "right-msg"}`}
          >
            <div
              className="msg-img"
              style={{
                backgroundImage: message.sender === BOT_NAME ? `url(${BOT_IMAGE})` : "none",
              }}
            />
            <div className="msg-bubble">
              <div className="msg-info">
                <span className="msg-info-name">{message.sender}</span>
                <span className="msg-info-time">{formatDate(message.time)}</span>
              </div>
              <pre className="msg-text">{message.text}</pre>
            </div>
          </div>
        ))}
      </main>

      <form className="msger-inputarea" onSubmit={handleSubmit}>
        <input
          type="text"
          className="msger-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="msger-send-btn">
          Send
        </button>
      </form>
    </div>
  );
}

export default Home;
