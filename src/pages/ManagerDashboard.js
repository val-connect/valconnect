import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  useTheme,
  Drawer,
  IconButton,
  Switch,
  ListItemSecondaryAction,
  Tooltip,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Pending as PendingIcon,
  Engineering as EngineeringIcon,
  Settings as SettingsIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { updateDashboardWidgets } from '../redux/taskSlice';

const ResponsiveGridLayout = WidthProvider(Responsive);

const ManagerDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const engineers = useSelector((state) => state.tasks.engineers);
  const activeWidgets = useSelector((state) => state.tasks.dashboardWidgets);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    
    const p1Tasks = tasks.filter(task => task.priority === 'P1').length;
    const p2Tasks = tasks.filter(task => task.priority === 'P2').length;
    const p3Tasks = tasks.filter(task => task.priority === 'P3').length;

    const engineerStats = engineers.map(engineer => {
      const engineerTasks = tasks.filter(task => task.assignedTo === engineer.id);
      return {
        ...engineer,
        taskCount: engineerTasks.length,
        completedTasks: engineerTasks.filter(task => task.status === 'completed').length,
      };
    });

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      p1Tasks,
      p2Tasks,
      p3Tasks,
      engineerStats,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    };
  }, [tasks, engineers]);

  const pieChartData = useMemo(() => [
    { name: 'Completed', value: stats.completedTasks, color: theme.palette.success.main },
    { name: 'In Progress', value: stats.inProgressTasks, color: theme.palette.warning.main },
    { name: 'Pending', value: stats.pendingTasks, color: theme.palette.info.main },
  ], [stats, theme.palette]);

  const recentActivities = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 5)
      .map(task => {
        const engineer = engineers.find(e => e.id === task.assignedTo);
        return {
          ...task,
          engineerName: engineer ? engineer.name : 'Unassigned',
        };
      });
  }, [tasks, engineers]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'in_progress':
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
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

  const layouts = {
    lg: [
      { i: 'totalTasks', x: 0, y: 0, w: 3, h: 2, minW: 2 },
      { i: 'taskStatus', x: 3, y: 0, w: 3, h: 2, minW: 2 },
      { i: 'priorityDistribution', x: 6, y: 0, w: 3, h: 2, minW: 2 },
      { i: 'teamPerformance', x: 9, y: 0, w: 3, h: 2, minW: 2 },
      { i: 'taskDistributionPie', x: 0, y: 2, w: 6, h: 4, minW: 4 },
      { i: 'recentActivity', x: 6, y: 2, w: 6, h: 4, minW: 4 },
      { i: 'engineerPerformance', x: 0, y: 6, w: 12, h: 4, minW: 6 },
    ],
  };

  const widgetComponents = {
    totalTasks: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Total Tasks
        </Typography>
        <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
          {stats.totalTasks}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completion Rate: {stats.completionRate.toFixed(1)}%
        </Typography>
      </Paper>
    ),
    taskStatus: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Task Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip
            label={`Completed: ${stats.completedTasks}`}
            size="small"
            color="success"
          />
          <Chip
            label={`In Progress: ${stats.inProgressTasks}`}
            size="small"
            color="warning"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`Pending: ${stats.pendingTasks}`}
            size="small"
            color="info"
          />
        </Box>
      </Paper>
    ),
    priorityDistribution: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Priority Distribution
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip
            label={`P1: ${stats.p1Tasks}`}
            size="small"
            sx={{ bgcolor: theme.palette.error.main, color: 'white' }}
          />
          <Chip
            label={`P2: ${stats.p2Tasks}`}
            size="small"
            sx={{ bgcolor: theme.palette.warning.main, color: 'white' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`P3: ${stats.p3Tasks}`}
            size="small"
            sx={{ bgcolor: theme.palette.info.main, color: 'white' }}
          />
        </Box>
      </Paper>
    ),
    teamPerformance: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Team Performance
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Overall Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stats.completionRate}
            sx={{ flexGrow: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {engineers.length} Engineers Active
        </Typography>
      </Paper>
    ),
    taskDistributionPie: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Task Distribution
        </Typography>
        <Box sx={{ flexGrow: 1, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    ),
    recentActivity: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {recentActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getPriorityColor(activity.priority) }}>
                    {getStatusIcon(activity.status)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2">
                        {activity.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={activity.priority}
                        sx={{ bgcolor: getPriorityColor(activity.priority), color: 'white' }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Assigned to: {activity.engineerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {format(new Date(activity.startTime), 'MMM d, yyyy h:mm a')}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={activity.status.replace('_', ' ').toUpperCase()}
                          sx={{
                            bgcolor: activity.status === 'completed'
                              ? theme.palette.success.light
                              : activity.status === 'in_progress'
                              ? theme.palette.warning.light
                              : theme.palette.info.light,
                          }}
                        />
                      </Box>
                    </>
                  }
                />
              </ListItem>
              {index < recentActivities.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    ),
    engineerPerformance: (
      <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Engineer Performance
        </Typography>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {stats.engineerStats.map((engineer, index) => (
            <React.Fragment key={engineer.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <EngineeringIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={engineer.name}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tasks: {engineer.taskCount} | Completed: {engineer.completedTasks}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(engineer.completedTasks / engineer.taskCount) * 100 || 0}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
              {index < stats.engineerStats.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    ),
  };

  const handleWidgetToggle = (key) => (e) => {
    dispatch(updateDashboardWidgets({
      ...activeWidgets,
      [key]: e.target.checked
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manager Dashboard
        </Typography>
        <IconButton onClick={() => setSettingsOpen(true)} color="primary">
          <SettingsIcon />
        </IconButton>
      </Box>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        margin={[16, 16]}
      >
        {Object.entries(widgetComponents).map(([key, component]) => (
          activeWidgets[key] && (
            <div key={key} className="widget" style={{ overflow: 'auto' }}>
              <Box sx={{ height: '100%', position: 'relative' }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    zIndex: 1,
                    opacity: 0.3,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <DragIndicatorIcon />
                </IconButton>
                {component}
              </Box>
            </div>
          )
        ))}
      </ResponsiveGridLayout>

      <Drawer
        anchor="right"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Widget Settings
          </Typography>
          <List>
            {Object.entries(activeWidgets).map(([key, active]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key.split(/(?=[A-Z])/).join(' ')}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={active}
                    onChange={handleWidgetToggle(key)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ManagerDashboard;
