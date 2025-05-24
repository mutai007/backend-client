import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('backend-client-1gq4e8rzp-johns-projects-70a0c201.vercel.app');

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (message.trim() === '') return;

    const newMessage = {
      id: Date.now() + Math.random(),
      text: message,
      timestamp: Date.now(),
      sender: name.trim(),
    };

    socket.emit('chat message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="App">
      <div className="chat-container">
        {/* Input for name */}
        <div className="name-input">
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className="message you">
              <div className="message-header">
                <strong className="sender-name">{msg.sender}</strong>
                <small className="timestamp">{formatTime(msg.timestamp)}</small>
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(msg.id)}
                  title="Delete message"
                >
                  ×
                </button>
              </div>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
