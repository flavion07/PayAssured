import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F97316',
      light: '#FDBA74',
      dark: '#C2410C',
      contrastText: '#0F172A',
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
    },
    warning: {
      main: '#F59E0B',
      light: '#FACC15',
      dark: '#D97706',
    },
    error: {
      main: '#DC2626',
      light: '#F87171',
      dark: '#B91C1C',
    },
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    background: {
      default: '#F6F8FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Sora", "Inter", "Segoe UI", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.7rem',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.1rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.28,
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.32,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.45,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.07), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.08), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.15)',
    ...Array(19).fill('0px 25px 50px -12px rgba(0, 0, 0, 0.15)'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(120deg, #0EA5E9 0%, #22C55E 100%)',
          '&:hover': {
            background: 'linear-gradient(120deg, #0284C7 0%, #16A34A 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
          borderRadius: 18,
          border: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F8FAFC',
            fontWeight: 700,
            color: '#475569',
            borderBottom: '2px solid #E2E8F0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8FAFC',
            transition: 'background-color 0.2s ease',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});
