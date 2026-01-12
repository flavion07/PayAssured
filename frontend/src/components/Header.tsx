import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(120deg, #0EA5E9 0%, #0F766E 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(14, 165, 233, 0.25)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Notification Icon */}
        <IconButton
          sx={{
            color: 'white',
            mx: 0.5,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            A
          </Avatar>
          {!isMobile && (
            <Box>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
                Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
                Manager
              </Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
