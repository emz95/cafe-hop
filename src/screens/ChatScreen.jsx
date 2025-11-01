import React from 'react';
import Header from '../components/Header';

const ChatScreen = () => {
  return (
    <div className="chat-screen">
      <Header />
      <div className="chat-content">
        <h2>Chats</h2>
        <div className="chats-list">
          <p>No chats yet</p>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;