import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ProfilePicture from '../components/ProfilePicture';
import UserProfileModal from '../components/UserProfileModal';

const API_BASE = 'http://localhost:3000/api';

const ChatScreen = () => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState(null);

  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 👉 Get auth info from localStorage
  const token = localStorage.getItem('token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();
  const userId = user?._id;

  // Helper: format chat list timestamp
  function formatChatTimestamp(isoString) {
    if (!isoString) return '';
    const dt = new Date(isoString);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // Helper: format message timestamp
  function formatMessageTimestamp(isoString) {
    if (!isoString) return '';
    const dt = new Date(isoString);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // 🔹 Fetch all chats for the current user
  useEffect(() => {
    if (!userId || !token) {
      setError('Not logged in');
      setLoadingChats(false);
      return;
    }

    const controller = new AbortController();

    async function loadChats() {
      try {
        setLoadingChats(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}/groupchats/chats/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (!res.ok) {
          // Handle 401 specifically
          if (res.status === 401) {
            console.warn('Unauthorized - token may be expired');
            setError('Session expired. Please log in again.');
            return;
          }
          // For other errors, just use empty array (user might not have chats yet)
          console.warn(`Failed to fetch chats (status ${res.status}), using empty array`);
          setChats([]);
          return;
        }

        // data: [{ _id, chatName, post, updatedAt? }, ...]
        const mappedChats = (data || []).map((chat) => ({
          id: chat._id,
          title: chat.chatName || 'Group Chat',
          timestamp: formatChatTimestamp(chat.updatedAt),
          lastMessage: '', // placeholder until backend supports last message
          unreadCount: 0,  // placeholder for now
        }));

        setChats(mappedChats);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error loading chats:', err);
        setError(err.message || 'Failed to load chats');
      } finally {
        setLoadingChats(false);
      }
    }

    loadChats();

    return () => {
      controller.abort();
    };
  }, [userId, token]);

  // 🔹 Fetch messages for a specific chat
  const loadMessagesForChat = useCallback(async (chatId, { showSpinner = true } = {}) => {
    if (!token) {
      setMessagesError('Not logged in');
      return;
    }

    try {
      if (showSpinner) setLoadingMessages(true);
      setMessagesError(null);

      const res = await fetch(
        `${API_BASE}/messages/${chatId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `Failed to fetch messages (status ${res.status})`;
        throw new Error(message);
      }

      // data: [{ _id, text, createdAt, sender: { _id, username }, ... }, ...]
      // Backend sorts newest first; flip to oldest→newest
      const ordered = [...(data || [])].reverse();

      const mappedMessages = ordered.map((msg) => {
        const senderObj = msg.sender || {};
        const isMe =
          userId &&
          senderObj._id &&
          String(senderObj._id) === String(userId);

        return {
          id: msg._id,
          sender: isMe ? 'me' : senderObj.username || 'Unknown',
          senderId: senderObj._id,
          text: msg.text,
          timestamp: formatMessageTimestamp(msg.createdAt),
          isMe,
        };
      });

      setMessages(mappedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessagesError(err.message || 'Failed to load messages');
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  }, [token, userId]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    setMessagesError(null);
    // initial load with spinner
    loadMessagesForChat(chat.id, { showSpinner: true });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setMessages([]);
    setMessagesError(null);
    setLoadingMessages(false);
  };

  // 🔹 Poll for new messages every 1 second while a chat is open
  useEffect(() => {
    if (!selectedChat || !token) return;

    const chatId = selectedChat.id;

    const intervalId = setInterval(() => {
      // silent refresh: no spinner, just update the list
      loadMessagesForChat(chatId, { showSpinner: false });
    }, 1000); // 1 second

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedChat, token, loadMessagesForChat]); // re-setup if selectedChat or token changes

  // 🔹 Send a real message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || !selectedChat) return;
    if (!token) {
      setMessagesError('Not logged in');
      return;
    }

    try {
      setMessagesError(null);

      const res = await fetch(
        `${API_BASE}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            group: selectedChat.id, // matches Message.group field
            text: trimmed,
          }),
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `Failed to send message (status ${res.status})`;
        throw new Error(message);
      }

      // createMessage returns the raw Message doc (sender is just an ObjectId),
      // but we know it's from "me", so we can build the UI message locally.
      const createdAt = data && data.createdAt
        ? data.createdAt
        : new Date().toISOString();

      const newMsg = {
        id: data && data._id ? data._id : `temp-${Date.now()}`,
        sender: 'me',
        text: trimmed,
        timestamp: formatMessageTimestamp(createdAt),
        isMe: true,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setMessagesError(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="chat-screen">
      <Header />
      <div className="main-content">
        {!selectedChat ? (
          // 🔹 Chat list view
          <>
            <div className="main-header">
              <h2>Chats</h2>
            </div>

            {loadingChats ? (
              <div className="empty-state">
                <p>Loading your chats...</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <p>{error}</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="empty-state">
                <p>No chats yet. Start a conversation with your cafe buddies!</p>
              </div>
            ) : (
              <div className="chats-container">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="chat-preview"
                    onClick={() => handleChatClick(chat)}
                  >
                    <ProfilePicture username={chat.title} size="small" />
                    <div className="chat-info">
                      <div className="chat-header">
                        <h4>{chat.title}</h4>
                        <span className="chat-time">{chat.timestamp}</span>
                      </div>
                      <p className="last-message">
                        {chat.lastMessage || 'Open chat'}
                      </p>
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
          // 🔹 Individual chat view
          <>
            <div className="chat-detail-header">
              <button className="back-button" onClick={handleBackToList}>
                ← Back to Chats
              </button>
              <div className="chat-detail-user">
                <ProfilePicture username={selectedChat.title} size="small" />
                <h3>{selectedChat.title}</h3>
              </div>
            </div>

            <div className="chat-messages-container">
              {loadingMessages ? (
                <div className="empty-state">
                  <p>Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="empty-state">
                  <p>{messagesError}</p>
                </div>
              ) : (
                <div className="chat-messages">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${
                        msg.isMe ? 'message-sent' : 'message-received'
                      }`}
                    >
                      {!msg.isMe && (
                        <div className="message-avatar" onClick={() => setSelectedUserId(msg.senderId)} style={{ cursor: 'pointer' }}>
                          <ProfilePicture username={msg.sender} size="small" />
                        </div>
                      )}
                      <div className="message-content">
                        {!msg.isMe && (
                          <span className="message-sender clickable" onClick={() => setSelectedUserId(msg.senderId)}>{msg.sender}</span>
                        )}
                        <div className="message-bubble">
                          <p className="message-text">{msg.text}</p>
                          <span className="message-time">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {messages.length === 0 && !loadingMessages && !messagesError && (
                    <div className="empty-state">
                      <p>No messages yet. Say hi 👋</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-medium"
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
};

export default ChatScreen;
