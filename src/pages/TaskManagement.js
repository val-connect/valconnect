import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  TablePagination,
  Stack,
  Autocomplete,
} from '@mui/material';
import { addTask, reshuffleTasks } from '../redux/taskSlice';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';

// Reuse TaskRow component from ManagerDashboard
const TaskRow = ({ task, engineer }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{task.customerId}</TableCell>
        <TableCell>{task.locationId}</TableCell>
        <TableCell>
          <Chip
            label={task.priority}
            color={
              task.priority === 'P1' ? 'error' :
              task.priority === 'P2' ? 'warning' : 'success'
            }
            size="small"
          />
        </TableCell>
        <TableCell>{engineer?.name || 'Unassigned'}</TableCell>
        <TableCell>{format(new Date(task.startTime), 'MMM dd, HH:mm')}</TableCell>
        <TableCell>
          <Chip
            label={task.status}
            color={task.status === 'completed' ? 'success' : 'warning'}
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Task Details
              </Typography>
              <Typography variant="body2" paragraph>
                {task.description}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Duration: {format(new Date(task.startTime), 'HH:mm')} - {format(new Date(task.endTime), 'HH:mm')}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TaskManagement = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const engineers = useSelector((state) => state.tasks.engineers);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    priority: [],
    status: [],
    engineer: null,
    dateRange: null,
  });

  const [newTask, setNewTask] = useState({
    customerId: '',
    locationId: '',
    priority: 'P3',
    engineerId: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  const engineerMap = engineers.reduce((acc, eng) => {
    acc[eng.id] = eng;
    return acc;
  }, {});

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.engineer && task.engineerId !== filters.engineer.id) return false;
    // Add date range filter if needed
    return true;
  });

  const handleAddTask = () => {
    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
    };

    dispatch(reshuffleTasks({ engineerId: newTask.engineerId, newTask: taskToAdd }));
    setOpen(false);
    setNewTask({
      customerId: '',
      locationId: '',
      priority: 'P3',
      engineerId: '',
      startTime: '',
      endTime: '',
      description: '',
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ bgcolor: '#003366', minHeight: '100%', pt: 3 }}>
      <Box sx={{ px: 3, color: 'white' }}>
        <Typography variant="h4" gutterBottom>Task Management</Typography>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                multiple
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                label="Priority"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="P1">P1</MenuItem>
                <MenuItem value="P2">P2</MenuItem>
                <MenuItem value="P3">P3</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                label="Status"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              sx={{ width: 300 }}
              options={engineers}
              getOptionLabel={(option) => option.name}
              value={filters.engineer}
              onChange={(event, newValue) => {
                setFilters({ ...filters, engineer: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="Engineer" />}
            />
          </Stack>
        </Paper>

        {/* Tasks Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Customer</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Engineer</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((task) => (
                    <TaskRow 
                      key={task.id} 
                      task={task} 
                      engineer={engineerMap[task.engineerId]} 
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      {/* Add Task Dialog - Reuse from ManagerDashboard */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Customer ID"
              value={newTask.customerId}
              onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
            />
            <TextField
              label="Location ID"
              value={newTask.locationId}
              onChange={(e) => setNewTask({ ...newTask, locationId: e.target.value })}
            />
            <FormControl>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="P1">P1</MenuItem>
                <MenuItem value="P2">P2</MenuItem>
                <MenuItem value="P3">P3</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Engineer</InputLabel>
              <Select
                value={newTask.engineerId}
                onChange={(e) => setNewTask({ ...newTask, engineerId: e.target.value })}
                label="Engineer"
              >
                {engineers.map((eng) => (
                  <MenuItem key={eng.id} value={eng.id}>{eng.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Time"
              type="datetime-local"
              value={newTask.startTime}
              onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={newTask.endTime}
              onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        Add New Task
      </Button>
    </Box>
  );
};

export default TaskManagement;
