import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Mock chat data
const MOCK_CHATS = [
  {
    id: 1,
    username: 'nickwilde',
    lastMessage: 'See you at the cafe tomorrow!',
    timestamp: '2:30 PM',
    unreadCount: 2,
    avatar: 'N'
  },
  {
    id: 2,
    username: 'clawhauser',
    lastMessage: 'Thanks for the coffee recommendation!',
    timestamp: '1:15 PM',
    unreadCount: 0,
    avatar: 'C'
  },
  {
    id: 3,
    username: 'gazelle',
    lastMessage: 'Are you joining the trip on Friday?',
    timestamp: 'Yesterday',
    unreadCount: 1,
    avatar: 'G'
  }
];

const ChatScreen = () => {
  const navigate = useNavigate();
  const [chats] = useState(MOCK_CHATS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Mock messages for selected chat
  const MOCK_MESSAGES = {
    1: [
      { id: 1, sender: 'nickwilde', text: 'Hey! Are you free tomorrow?', timestamp: '2:15 PM', isMe: false },
      { id: 2, sender: 'me', text: 'Yes! What time?', timestamp: '2:20 PM', isMe: true },
      { id: 3, sender: 'nickwilde', text: 'See you at the cafe tomorrow!', timestamp: '2:30 PM', isMe: false }
    ],
    2: [
      { id: 1, sender: 'clawhauser', text: 'Thanks for the coffee recommendation!', timestamp: '1:15 PM', isMe: false },
      { id: 2, sender: 'me', text: 'You\'re welcome! Glad you liked it!', timestamp: '1:20 PM', isMe: true }
    ],
    3: [
      { id: 1, sender: 'gazelle', text: 'Are you joining the trip on Friday?', timestamp: 'Yesterday', isMe: false }
    ]
  };

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setMessages(MOCK_MESSAGES[chat.id] || []);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'me',
        text: newMessage,
        timestamp: 'Just now',
        isMe: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-screen">
      <Header />
      <div className="main-content">
        {!selectedChat ? (
          // Chat list view
          <>
            <div className="main-header">
              <h2>Chats</h2>
            </div>
            
            {chats.length === 0 ? (
              <div className="empty-state">
                <p>No chats yet. Start a conversation with your cafe buddies!</p>
              </div>
            ) : (
              <div className="chats-container">
                {chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className="chat-preview"
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className="profile-picture profile-picture-small">
                      <div className="profile-placeholder">{chat.avatar}</div>
                    </div>
                    <div className="chat-info">
                      <div className="chat-header">
                        <h4>{chat.username}</h4>
                        <span className="chat-time">{chat.timestamp}</span>
                      </div>
                      <p className="last-message">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="unread-badge">{chat.unreadCount}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Individual chat view
          <>
            <div className="chat-detail-header">
              <button className="back-button" onClick={handleBackToList}>
                ← Back to Chats
              </button>
              <div className="chat-detail-user">
                <div className="profile-picture profile-picture-small">
                  <div className="profile-placeholder">{selectedChat.avatar}</div>
                </div>
                <h3>{selectedChat.username}</h3>
              </div>
            </div>
            
            <div className="chat-messages-container">
              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.isMe ? 'message-sent' : 'message-received'}`}>
                    <div className="message-bubble">
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-primary btn-medium">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;