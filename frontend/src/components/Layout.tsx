import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar, Header } from '@/components';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(249,115,22,0.08), transparent 30%), linear-gradient(180deg, #F8FAFF 0%, #F3F6FB 100%)',
      }}
    >
      {/* Sidebar */}
      {!isMobile && <Sidebar open />}
      {isMobile && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
