import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  useTheme,
  IconButton,
  Collapse,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

const EngineerDashboard = () => {
  const theme = useTheme();
  const engineers = useSelector((state) => state.tasks.engineers);
  const tasks = useSelector((state) => state.tasks.tasks);
  const [expandedEngineer, setExpandedEngineer] = useState(null);
  const [viewMode, setViewMode] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const engineerStats = useMemo(() => {
    return engineers.map(engineer => {
      const engineerTasks = tasks.filter(task => task.assignedTo === engineer.id);
      const completedTasks = engineerTasks.filter(task => task.status === 'completed');
      const inProgressTasks = engineerTasks.filter(task => task.status === 'in_progress');
      const pendingTasks = engineerTasks.filter(task => task.status === 'pending');
      
      const priorityDistribution = {
        P1: engineerTasks.filter(task => task.priority === 'P1').length,
        P2: engineerTasks.filter(task => task.priority === 'P2').length,
        P3: engineerTasks.filter(task => task.priority === 'P3').length,
      };

      return {
        ...engineer,
        currentTasks: engineerTasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        pendingTasks: pendingTasks.length,
        priorityDistribution,
        tasks: engineerTasks,
      };
    });
  }, [engineers, tasks]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P1':
        return theme.palette.error.main;
      case 'P2':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getDaysInView = () => {
    switch (viewMode) {
      case 'day':
        return [selectedDate];
      case 'week': {
        const monday = startOfWeek(selectedDate, { weekStartsOn: 1 });
        return Array.from({ length: 5 }, (_, i) => addDays(monday, i));
      }
      case 'month': {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd })
          .filter(date => ![0, 6].includes(date.getDay())); // Exclude weekends
      }
      default:
        return [selectedDate];
    }
  };

  const getTasksForDay = (tasks, date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return tasks.filter(task => {
      const taskStart = new Date(task.startTime);
      const taskEnd = new Date(task.endTime);
      return isWithinInterval(taskStart, { start: dayStart, end: dayEnd }) ||
             isWithinInterval(taskEnd, { start: dayStart, end: dayEnd });
    });
  };

  const timeSlots = Array.from({ length: 17 }, (_, i) => ({
    hour: Math.floor(i/2) + 9,
    minute: (i % 2) * 30,
    label: format(
      new Date().setHours(Math.floor(i/2) + 9, (i % 2) * 30),
      'h:mm a'
    )
  }));

  const renderSchedule = (engineer) => {
    const days = getDaysInView();
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <ButtonGroup variant="outlined" size="small">
            <Button
              onClick={() => setViewMode('day')}
              variant={viewMode === 'day' ? 'contained' : 'outlined'}
            >
              Day
            </Button>
            <Button
              onClick={() => setViewMode('week')}
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
            >
              Week
            </Button>
            <Button
              onClick={() => setViewMode('month')}
              variant={viewMode === 'month' ? 'contained' : 'outlined'}
            >
              Month
            </Button>
          </ButtonGroup>
          <ButtonGroup variant="outlined" size="small">
            <Button onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
              Previous
            </Button>
            <Button onClick={() => setSelectedDate(new Date())}>
              Today
            </Button>
            <Button onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              Next
            </Button>
          </ButtonGroup>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={100}>Time</TableCell>
                {days.map(day => (
                  <TableCell key={day.toISOString()} align="center">
                    {format(day, 'EEE, MMM d')}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map(slot => (
                <TableRow key={`${slot.hour}-${slot.minute}`}>
                  <TableCell>
                    {slot.label}
                  </TableCell>
                  {days.map(day => {
                    const slotStart = new Date(day);
                    slotStart.setHours(slot.hour, slot.minute);
                    const slotEnd = new Date(slotStart);
                    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

                    const tasksInSlot = engineer.tasks.filter(task => {
                      const taskStart = new Date(task.startTime);
                      const taskEnd = new Date(task.endTime);
                      return (taskStart <= slotEnd && taskEnd >= slotStart);
                    });

                    return (
                      <TableCell 
                        key={day.toISOString()} 
                        sx={{ 
                          position: 'relative',
                          height: '40px',
                          p: 0.5,
                          ...(slot.hour === 12 && slot.minute === 0 && {
                            bgcolor: theme.palette.grey[100],
                          })
                        }}
                      >
                        {slot.hour === 12 && slot.minute === 0 ? (
                          <Box sx={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.palette.text.secondary 
                          }}>
                            Lunch Break
                          </Box>
                        ) : tasksInSlot.map(task => (
                          <Chip
                            key={task.id}
                            label={task.title}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: 4,
                              right: 4,
                              transform: 'translateY(-50%)',
                              bgcolor: getPriorityColor(task.priority),
                              color: 'white',
                              '& .MuiChip-label': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }
                            }}
                          />
                        ))}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="text.primary">
        Engineers Overview
      </Typography>

      <Grid container spacing={3}>
        {engineerStats.map((engineer) => (
          <Grid item xs={12} key={engineer.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Grid container spacing={2}>
                    {/* Engineer Info */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                          <EngineeringIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{engineer.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {engineer.specialization}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={engineer.timezone}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<PublicIcon />}
                          label={engineer.country}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </Grid>

                    {/* Performance Metrics */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Efficiency Score
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SpeedIcon color="primary" />
                            <LinearProgress
                              variant="determinate"
                              value={engineer.efficiencyScore * 10}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2">
                              {engineer.efficiencyScore}/10
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Success Rate
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon color="success" />
                            <LinearProgress
                              variant="determinate"
                              value={engineer.successRate}
                              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2">
                              {engineer.successRate}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Average Response Time
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimerIcon color="warning" />
                            <Typography variant="body2">
                              {engineer.avgResponseTime}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Task Statistics */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Current Task Distribution
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: theme.palette.success.light }}>
                            <Typography variant="h6">{engineer.completedTasks}</Typography>
                            <Typography variant="caption">Completed</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: theme.palette.warning.light }}>
                            <Typography variant="h6">{engineer.inProgressTasks}</Typography>
                            <Typography variant="caption">In Progress</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: theme.palette.info.light }}>
                            <Typography variant="h6">{engineer.pendingTasks}</Typography>
                            <Typography variant="caption">Pending</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Priority Distribution
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`P1: ${engineer.priorityDistribution.P1}`}
                            size="small"
                            sx={{ bgcolor: theme.palette.error.main, color: 'white' }}
                          />
                          <Chip
                            label={`P2: ${engineer.priorityDistribution.P2}`}
                            size="small"
                            sx={{ bgcolor: theme.palette.warning.main, color: 'white' }}
                          />
                          <Chip
                            label={`P3: ${engineer.priorityDistribution.P3}`}
                            size="small"
                            sx={{ bgcolor: theme.palette.info.main, color: 'white' }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <IconButton 
                    onClick={() => setExpandedEngineer(expandedEngineer === engineer.id ? null : engineer.id)}
                    sx={{ ml: 2 }}
                  >
                    {expandedEngineer === engineer.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={expandedEngineer === engineer.id}>
                  {renderSchedule(engineer)}
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EngineerDashboard;
