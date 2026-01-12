import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { label: 'Dashboard', icon: DashboardIcon, href: '/' },
    { label: 'Cases', icon: AssignmentIcon, href: '/cases' },
    { label: 'Clients', icon: PersonIcon, href: '/clients' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #0B1729 0%, #0F2A3A 50%, #0A3B3C 100%)',
        color: 'white',
      }}
    >
      {/* Logo/Brand */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #22C55E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            P
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              PayAssured
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
              CRM System
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <ListItem
                button
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  backdropFilter: active ? 'blur(10px)' : 'none',
                  border: active ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid transparent',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': active
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: 'linear-gradient(180deg, #0EA5E9 0%, #22C55E 100%)',
                        borderRadius: '0 4px 4px 0',
                      }
                    : {},
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'white',
                    minWidth: 40,
                    opacity: active ? 1 : 0.7,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Footer */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mb: 0.5 }}>
            Version
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            v1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#0B1729',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        },
      }}
    >
      {content}
    </Drawer>
  );
};
