import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const Tasks = () => {
  const theme = useTheme();
  const tasks = useSelector((state) => state.tasks.tasks) || [];
  const engineers = useSelector((state) => state.tasks.engineers) || [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [timezoneFilter, setTimezoneFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  // Get unique timezones and countries
  const uniqueTimezones = useMemo(() => 
    ['all', ...new Set(tasks.map(task => task.timezone || '').filter(Boolean))],
    [tasks]
  );

  const uniqueCountries = useMemo(() => 
    ['all', ...new Set(tasks.map(task => task.country || '').filter(Boolean))],
    [tasks]
  );

  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        getEngineerName(task.assignedTo || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTimezone = timezoneFilter === 'all' || task.timezone === timezoneFilter;
      const matchesCountry = countryFilter === 'all' || task.country === countryFilter;

      return matchesSearch && matchesTimezone && matchesCountry;
    });
  }, [tasks, searchQuery, timezoneFilter, countryFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEngineerName = (engineerId) => {
    const engineer = engineers.find(eng => eng.id === engineerId);
    return engineer ? engineer.name : 'Unassigned';
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

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Get current timezone
  const getCurrentTimezone = () => {
    const options = { timeZoneName: 'short' };
    return new Intl.DateTimeFormat('en-US', options)
      .formatToParts(new Date())
      .find(part => part.type === 'timeZoneName').value;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom color="text.primary">
            Tasks Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`Your timezone: ${getCurrentTimezone()}`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={timezoneFilter}
                    onChange={(e) => setTimezoneFilter(e.target.value)}
                    label="Timezone"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    }
                  >
                    {uniqueTimezones.map(tz => (
                      <MenuItem key={tz} value={tz}>
                        {tz === 'all' ? 'All Timezones' : tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    label="Country"
                    startAdornment={
                      <InputAdornment position="start">
                        <PublicIcon />
                      </InputAdornment>
                    }
                  >
                    {uniqueCountries.map(country => (
                      <MenuItem key={country} value={country}>
                        {country === 'all' ? 'All Countries' : country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tasks Table */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <Tooltip title="Timezone">
                        <AccessTimeIcon />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Country">
                        <PublicIcon />
                      </Tooltip>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : filteredTasks
                  ).map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{getEngineerName(task.assignedTo)}</TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>{task.timezone}</TableCell>
                      <TableCell>{task.country}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tasks;
