import React from 'react';
import { SvgIcon, Box, Typography, useTheme } from '@mui/material';

const ValConnectLogo = ({ size = 32 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <SvgIcon
        sx={{
          fontSize: size,
          mr: 1,
        }}
        viewBox="0 0 100 100"
      >
        {/* Define gradients */}
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: theme.palette.secondary.main, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: theme.palette.secondary.dark, stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="whiteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: isDark ? '#ffffff' : '#1A2027', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: isDark ? '#e0e0e0' : '#2f3a45', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Neural network circuit pattern */}
        <g fill="none" stroke={isDark ? '#ffffff' : '#1A2027'} strokeWidth="1" opacity="0.5">
          {/* Left side neural connections */}
          <path d="M25,15 C35,25 30,35 40,40" />
          <path d="M40,40 C45,45 45,55 50,65" />
          <path d="M25,15 C20,30 30,45 40,55" />
          <path d="M40,55 C45,65 48,75 50,85" />
          
          {/* Right side neural connections */}
          <path d="M75,15 C65,25 70,35 60,40" />
          <path d="M60,40 C55,45 55,55 50,65" />
          <path d="M75,15 C80,30 70,45 60,55" />
          <path d="M60,55 C55,65 52,75 50,85" />
        </g>

        {/* Neural nodes */}
        <g fill={theme.palette.secondary.main}>
          <circle cx="25" cy="15" r="2" />
          <circle cx="40" cy="40" r="2" />
          <circle cx="40" cy="55" r="2" />
          <circle cx="50" cy="65" r="2" />
          <circle cx="50" cy="85" r="2" />
          <circle cx="75" cy="15" r="2" />
          <circle cx="60" cy="40" r="2" />
          <circle cx="60" cy="55" r="2" />
          
          {/* Additional connection points */}
          <circle cx="45" cy="30" r="1.5" />
          <circle cx="55" cy="30" r="1.5" />
          <circle cx="45" cy="50" r="1.5" />
          <circle cx="55" cy="50" r="1.5" />
          <circle cx="50" cy="75" r="1.5" />
        </g>

        {/* Main V shape - inverted */}
        <path
          d="M50,90 L15,10 L50,50 L85,10 L50,90"
          fill="url(#whiteGradient)"
          stroke={isDark ? '#ffffff' : '#1A2027'}
          strokeWidth="2"
          filter={`drop-shadow(0 0 4px ${isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'})`}
        />
        <path
          d="M50,85 L20,15 L50,50 L80,15 L50,85"
          fill="url(#mainGradient)"
          opacity="1"
        />

        {/* Top glow effects */}
        <path
          d="M15,10 L50,50 L20,15"
          fill={theme.palette.secondary.main}
          opacity="0.3"
        />
        <path
          d="M85,10 L50,50 L80,15"
          fill={theme.palette.secondary.main}
          opacity="0.3"
        />
      </SvgIcon>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          textShadow: isDark 
            ? '0 0 10px rgba(255, 255, 255, 0.3)'
            : '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        ValConnect
      </Typography>
    </Box>
  );
};

export default ValConnectLogo;
