import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Analytics = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const engineers = useSelector((state) => state.tasks.engineers);
  const [timeRange, setTimeRange] = useState('7days');
  const [reportType, setReportType] = useState('completion');

  // Generate mock data for charts
  const generateTimeSeriesData = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = subDays(new Date(), 6 - index);
      return {
        date: format(date, 'MMM dd'),
        completed: Math.floor(Math.random() * 10) + 5,
        pending: Math.floor(Math.random() * 8) + 2,
        responseTime: Math.floor(Math.random() * 60) + 30,
      };
    });
  };

  const timeSeriesData = generateTimeSeriesData();

  // Generate mock engineer performance data
  const engineerPerformance = engineers.map(engineer => ({
    name: engineer.name,
    tasksCompleted: Math.floor(Math.random() * 50) + 20,
    avgResponseTime: Math.floor(Math.random() * 45) + 15,
    successRate: Math.floor(Math.random() * 20) + 80,
    efficiency: Math.floor(Math.random() * 15) + 85,
  }));

  const handleExportReport = () => {
    // Implementation for exporting reports
    console.log('Exporting report:', reportType);
  };

  return (
    <Box sx={{ bgcolor: '#003366', minHeight: '100%', pt: 3 }}>
      <Box sx={{ px: 3, color: 'white' }}>
        <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>

        {/* Controls */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="90days">Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="completion">Task Completion</MenuItem>
                  <MenuItem value="response">Response Time</MenuItem>
                  <MenuItem value="efficiency">Engineer Efficiency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportReport}
                fullWidth
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Task Completion Trend */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Task Completion Trend</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#4caf50" name="Completed" />
                    <Line type="monotone" dataKey="pending" stroke="#ff9800" name="Pending" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Response Time Analysis */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Response Time Analysis</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="responseTime" fill="#2196f3" name="Avg Response Time (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Engineer Performance Table */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Engineer</TableCell>
                      <TableCell align="right">Tasks Completed</TableCell>
                      <TableCell align="right">Avg Response Time (min)</TableCell>
                      <TableCell align="right">Success Rate (%)</TableCell>
                      <TableCell align="right">Efficiency Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {engineerPerformance.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="right">{row.tasksCompleted}</TableCell>
                        <TableCell align="right">{row.avgResponseTime}</TableCell>
                        <TableCell align="right">{row.successRate}%</TableCell>
                        <TableCell align="right">{row.efficiency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;
