import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2979ff',
        light: '#5393ff',
        dark: '#1c54b2',
      },
      secondary: {
        main: '#00B4D8',
        light: '#33c3e0',
        dark: '#007d97',
      },
      error: {
        main: '#ff1744',
        light: '#ff4569',
        dark: '#b2102f',
      },
      warning: {
        main: '#ff9100',
        light: '#ffa733',
        dark: '#b26500',
      },
      info: {
        main: '#00b0ff',
        light: '#33bfff',
        dark: '#007bb2',
      },
      success: {
        main: '#00c853',
        light: '#33d375',
        dark: '#008c3a',
      },
      background: {
        default: isDark ? '#121212' : '#f5f5f5',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#2A2A2A',
        secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : '#626262',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 500,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
      subtitle1: {
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: isDark 
              ? '0 4px 6px rgba(0, 0, 0, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: isDark
                ? '0 6px 12px rgba(0, 0, 0, 0.3)'
                : '0 4px 8px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                : '0 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            color: isDark ? '#ffffff' : '#2A2A2A',
            boxShadow: isDark 
              ? '0 2px 4px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: isDark ? '#ffffff' : '#2A2A2A',
          },
          secondary: {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#626262',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#424242' : '#616161',
            color: '#ffffff',
            fontSize: '0.75rem',
          },
        },
      },
    },
  });
};
