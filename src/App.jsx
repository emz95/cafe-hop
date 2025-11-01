import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import SetupScreen from './screens/SetupScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import CafeTripPostScreen from './screens/CafeTripPostScreen';
import RequestScreen from './screens/RequestScreen';
import ChatScreen from './screens/ChatScreen';
import FriendScreen from './screens/FriendScreen';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/setup" element={<SetupScreen />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/post" element={<CafeTripPostScreen />} />
        <Route path="/requests" element={<RequestScreen />} />
        <Route path="/chats" element={<ChatScreen />} />
        <Route path="/friends" element={<FriendScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
