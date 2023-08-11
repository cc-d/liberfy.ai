import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useLocation, Routes, Route } from 'react-router-dom';
import LogRegPage from '../components/LogRegPage';
import ChatListPage from '../components/ChatListPage';
import ChatPage from '../components/ChatPage';
import TopNav from './TopNav';
import { useAuthContext } from '../App/AuthContext';
import ChatSidebar from '../components/Sidebar';
import apios from '../utils/apios';
import { DBChat, DBComp } from '../api'; // Import DBChat type as required

const AppContent = ({ themeMode, toggleThemeMode, theme }) => {
  const { user } = useAuthContext();
  const loc = useLocation();
  const chatPageRE = /\/chat\/\d+\/?/;
  const [isSidebarOpen, setSidebarOpen] = useState(chatPageRE.test(loc.pathname));
  const [chat, setChat] = useState<DBChat | null>(null);

  const [activeCompId, setActiveCompId] = useState<number | null>(null);
  console.log('AppContent', 'chat', chat, 'activeCompId', activeCompId)
  const toggleSidebar = (openclose?: boolean) => {
    if (openclose === true || openclose === false) {
      setSidebarOpen(openclose);
    } else {
      setSidebarOpen(!isSidebarOpen);

    }
  };

  const addCompletion = (completion: DBComp) => {
    if (chat && chat.completions) {
      setChat({
        ...chat,
        completions: [...chat.completions, completion]
      })
    }
  }

  const getCompFromId = (cid: number | null) => {
    if (chat && chat.completions) {
      const fComp: DBComp | undefined = chat.completions.find((comp) => comp.id === cid);
      if (fComp) {
        return fComp;
      }
    }
    return null;
  }

  // Completion Modal
  const [showCompModal, setShowCompModal] = useState(false);
  const handleCompModalOpen = () => {
    setShowCompModal(true);
  };
  const handleCompModalClose = () => {
    setShowCompModal(false);
  };


  const [showSidebar, setShowSidebar] = useState(false);

  console.log('chat', chat, 'user', user, 'loc', loc, 'isSidebarOpen', isSidebarOpen, 'showSidebar', showSidebar)

  return (
    <Box display="flex">
      {user && loc.pathname !== '/' && (
        <ChatSidebar
          chat={chat}
          user={user}
          addCompletion={addCompletion}
          getCompFromId={getCompFromId}
          activeCompId={activeCompId}
          setActiveCompId={setActiveCompId}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          handleCompModalClose={handleCompModalClose}
          handleCompModalOpen={handleCompModalOpen}
          showCompModal={showCompModal}
          setChat={setChat}
        />
      )}
      <Box flex="1">
        <TopNav
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <Routes>
          <Route path="/" element={<LogRegPage />} />
          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/chat/:useChatId"
            element={

                <ChatPage
                  chat={chat}
                  setChat={setChat}
                  activeCompId={activeCompId}
                  setActiveCompId={setActiveCompId}
                  getCompFromId={getCompFromId}
                  addCompletion={addCompletion}
                />

            } />
        </Routes>
      </Box>
    </Box>
  );
};

export default AppContent;
