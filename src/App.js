import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Container,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { getTheme } from './theme';
import ValConnectLogo from './components/ValConnectLogo';
import ManagerDashboard from './pages/ManagerDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
import TaskManagement from './pages/TaskManagement';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';

function TopNav({ toggleColorMode, mode }) {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { path: '/', label: 'Overview', icon: <DashboardIcon /> },
    { path: '/tasks', label: 'Tasks', icon: <AssignmentIcon /> },
    { path: '/engineer', label: 'Engineers', icon: <ScheduleIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  return (
    <AppBar position="fixed" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, minHeight: '80px' }}>
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            <ValConnectLogo />
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color={location.pathname === item.path ? 'secondary' : 'inherit'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                startIcon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                sx: {
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleClose}
                  selected={location.pathname === item.path}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    <Typography>{item.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function App() {
  const [mode, setMode] = useState('dark');
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          bgcolor: 'background.default',
          backgroundImage: mode === 'dark' 
            ? 'radial-gradient(at 50% 0%, rgba(0, 209, 255, 0.1) 0%, rgba(10, 25, 41, 0) 75%)'
            : 'radial-gradient(at 50% 0%, rgba(25, 118, 210, 0.05) 0%, rgba(255, 255, 255, 0) 75%)',
        }}>
          <TopNav toggleColorMode={toggleColorMode} mode={mode} />
          <Box sx={{ pt: 8 }}>
            <Routes>
              <Route path="/" element={<ManagerDashboard />} />
              <Route path="/engineer" element={<EngineerDashboard />} />
              <Route path="/engineer/:id" element={<EngineerDashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/task-management" element={<TaskManagement />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
