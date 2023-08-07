import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useLocation, Routes, Route } from 'react-router-dom';
import LogRegPage from '../components/LogRegPage';
import ChatListPage from '../components/ChatListPage';
import ChatPage from '../components/ChatPage';
import TopNav from './TopNav';
import SidebarContext from './SidebarContext';

const AppContent = ({ themeMode, toggleThemeMode, theme }) => {
  const location = useLocation();
  const themeObj = useTheme();

  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [isSidebarOpen, setSidebarOpen] = useState(!isSmallDevice && location.pathname.startsWith('/chat/'))
  // Modify the showSidebar logic to also consider isSidebarOpen
  const marginLeft = (isSidebarOpen && !isSmallDevice) ? '240px' : '0px';
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isSmallDevice,
      }}
    >
      <Box
        sx={{
          marginLeft: marginLeft, // This will apply the margin only if the conditions are met
        }}
      >
        <TopNav
          themeMode={themeMode}
          toggleThemeMode={toggleThemeMode}

        />
        <Routes>
          <Route path="/" element={<LogRegPage />} />
          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/chat/:chatId" element={
            <ChatPage />
          } />
        </Routes>
      </Box>
    </SidebarContext.Provider>
  );
};
export default AppContent;
