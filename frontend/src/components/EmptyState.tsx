import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export const LoadingSkeleton: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
    <CircularProgress size={40} thickness={4} />
  </Box>
);

export const EmptyState: React.FC<{ message: string; isSearch?: boolean }> = ({ message, isSearch = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
    }}
  >
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }}
    >
      {isSearch ? (
        <SearchOffIcon sx={{ fontSize: 60, color: '#667eea', opacity: 0.5 }} />
      ) : (
        <InboxIcon sx={{ fontSize: 60, color: '#667eea', opacity: 0.5 }} />
      )}
    </Box>
    <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 600 }}>
      {message}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}>
      {isSearch
        ? 'Try adjusting your search terms or filters'
        : 'No data found. Get started by creating a new entry.'}
    </Typography>
  </Box>
);
