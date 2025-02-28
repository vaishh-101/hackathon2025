import React, { useState, useRef, useEffect } from 'react';
import './Home.css';

function Home() {
  // Initial message from Techie Tinder
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Techie Tinder",
      text: "Hi, welcome to Techie Tinder! Go ahead and Find a Perfect Match. 😄",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDate = (date) => {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    // Create a new message for the user
    const userMessage = {
      id: messages.length + 1,
      sender: "Harry Potter",
      text: input,
      time: new Date(),
    };
  
    // Update state with the user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
  
    try {
      // Make a POST request to the API endpoint
      const response = await fetch("https://c4d1-27-107-27-130.ngrok-free.app/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }), // Sending user input
      });
    
      const data = await response.json(); // Parse the JSON response
    
      // Filter out empty objects from the response
      const filteredData = data.response.filter(obj => Object.keys(obj).length > 0);
    
      // If no valid data is found, set a fallback message
      if (filteredData.length === 0) {
        const fallbackMessage = {
          id: messages.length + 1,
          sender: "Techie Tinder",
          text: "Wing-GAR-dium Levi-O-Sa 🪄", // Fallback message
          time: new Date(),
        };
    
        setMessages(prevMessages => [...prevMessages, fallbackMessage]);
        return;
      }
    
      // Create a message for each valid entity
      const botMessages = filteredData.map((entity, index) => ({
        id: messages.length + index + 1,
        sender: "Techie Tinder",
        text: `${entity.name ? `Name: ${entity.name}` : ""} 
               ${entity.designation ? ` | Designation: ${entity.designation}` : ""} 
               ${entity.current_project ? ` | Project: ${entity.current_project}` : ""} 
               ${entity.primary_skill ? ` | Skill: ${entity.primary_skill}` : ""}`,
        time: new Date(),
      }));
    
      // Update state with all bot responses
      setMessages(prevMessages => [...prevMessages, ...botMessages]);
    
    } catch (error) {
      const fallbackMessage = {
        id: messages.length + 1,
        sender: "Techie Tinder",
        text: "Wing-GAR-dium Levi-O-Sa 🪄🔮🧹", // Fallback message
        time: new Date(),
      };
      console.error("Error fetching data:", fallbackMessage);
      setMessages(prevMessages => [...prevMessages, fallbackMessage]);
    }
  }    

  return (
    <div>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> <h3>Techie-Tinder </h3>
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog"></i>
            </span>
          </div>
        </header>

        <main className="msger-chat" ref={chatRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`msg ${message.sender === "Techie Tinder" ? "left-msg" : "right-msg"}`}
            >
              <div
                className="msg-img"
                style={{
                  backgroundImage:
                    message.sender === "Techie Tinder"
                      ? "url(https://cdn.vectorstock.com/i/500p/39/44/cartoon-robot-isolated-on-a-white-background-vector-25753944.jpg)"
                      : "url(data:image/png;base64,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)",
                }}
              ></div>
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{message.sender}</div>
                  <div className="msg-info-time">{formatDate(message.time)}</div>
                </div>
                <div className="msg-text">{message.text}</div>
              </div>
            </div>
          ))}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}>
          <input
            type="text"
            className="msger-input"
            placeholder="Enter your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="msger-send-btn">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default Home;
