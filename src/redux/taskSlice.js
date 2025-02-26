import { createSlice } from '@reduxjs/toolkit';

const generateSampleTasks = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const taskTypes = [
    'Network Configuration',
    'Security Audit',
    'System Maintenance',
    'Software Update',
    'Hardware Installation',
    'Data Backup',
    'Performance Optimization',
    'Firewall Setup',
    'Cloud Migration',
    'Database Management',
    'VPN Setup',
    'Server Maintenance',
    'Disaster Recovery Test',
    'Network Security Assessment',
    'Infrastructure Upgrade'
  ];

  const customers = [
    { id: 'CUST001', name: 'TechCorp Solutions', country: 'India', timezone: 'IST', locations: ['Mumbai HQ', 'Bangalore Office', 'Delhi Branch', 'Pune Center'] },
    { id: 'CUST002', name: 'Global Innovations Ltd', country: 'United States', timezone: 'EST', locations: ['NYC Office', 'Boston HQ', 'Chicago Branch'] },
    { id: 'CUST003', name: 'DataFlow Systems', country: 'United Kingdom', timezone: 'GMT', locations: ['London HQ', 'Manchester Office', 'Birmingham Tech Park'] },
    { id: 'CUST004', name: 'Quantum Electronics', country: 'Australia', timezone: 'AEST', locations: ['Sydney HQ', 'Melbourne Office', 'Brisbane Center'] },
    { id: 'CUST005', name: 'SmartTech Industries', country: 'Japan', timezone: 'JST', locations: ['Tokyo HQ', 'Osaka Branch', 'Fukuoka Office'] },
    { id: 'CUST006', name: 'Digital Dynamics', country: 'Singapore', timezone: 'SGT', locations: ['Singapore HQ', 'Jurong Office'] },
    { id: 'CUST007', name: 'CloudNet Services', country: 'Germany', timezone: 'CET', locations: ['Berlin HQ', 'Munich Tech Center', 'Hamburg Office'] },
    { id: 'CUST008', name: 'SecureWare Solutions', country: 'Canada', timezone: 'EST', locations: ['Toronto HQ', 'Vancouver Office', 'Montreal Branch'] },
    { id: 'CUST009', name: 'InfraTech Systems', country: 'France', timezone: 'CET', locations: ['Paris HQ', 'Lyon Office', 'Marseille Center'] },
    { id: 'CUST010', name: 'ByteForce Analytics', country: 'India', timezone: 'IST', locations: ['Hyderabad HQ', 'Chennai Office', 'Kolkata Branch'] },
    { id: 'CUST011', name: 'NetPro Consulting', country: 'United States', timezone: 'PST', locations: ['SF HQ', 'LA Office', 'Seattle Branch'] },
    { id: 'CUST012', name: 'CyberSafe Solutions', country: 'United Kingdom', timezone: 'GMT', locations: ['Edinburgh HQ', 'Leeds Office', 'Bristol Center'] }
  ];

  const priorities = ['P1', 'P2', 'P3'];
  const statuses = ['pending', 'in_progress', 'completed'];
  
  const createTask = (id, engineerId, date, startHour, startMin, duration, priority, customerId) => {
    const startTime = new Date(date);
    startTime.setHours(startHour, startMin, 0, 0);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    const customer = customers.find(c => c.id === customerId);
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const location = customer.locations[Math.floor(Math.random() * customer.locations.length)];
    const status = Math.random() < 0.3 ? 'completed' : (Math.random() < 0.5 ? 'in_progress' : 'pending');
    
    return {
      id: `TASK${id}`,
      title: `${taskType} for ${customer.name}`,
      description: `Perform ${taskType.toLowerCase()} tasks at ${customer.name}'s ${location} facility`,
      assignedTo: engineerId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      priority,
      customerId,
      locationId: location,
      status,
      timezone: customer.timezone,
      country: customer.country,
    };
  };

  const tasks = [];
  let taskId = 1;

  // Generate tasks for the whole month for each engineer
  const engineers = ['ENG001', 'ENG002', 'ENG003', 'ENG004', 'ENG005'];
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  engineers.forEach(engineerId => {
    // Assign different customers to each engineer based on their region
    let engineerCustomers;
    switch(engineerId) {
      case 'ENG001': // Rajesh - India focused
        engineerCustomers = customers.filter(c => c.country === 'India' || c.timezone === 'IST');
        break;
      case 'ENG002': // Priya - US focused
        engineerCustomers = customers.filter(c => c.country === 'United States' || c.timezone === 'EST' || c.timezone === 'PST');
        break;
      case 'ENG003': // Amit - UK and Europe focused
        engineerCustomers = customers.filter(c => ['United Kingdom', 'France', 'Germany'].includes(c.country));
        break;
      case 'ENG004': // Deepika - APAC focused
        engineerCustomers = customers.filter(c => ['Australia', 'Singapore', 'Japan'].includes(c.country));
        break;
      case 'ENG005': // Vikram - Global backup
        engineerCustomers = customers;
        break;
    }

    // Generate 2-3 tasks per day for each engineer
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        const tasksPerDay = 2 + Math.floor(Math.random() * 2); // 2-3 tasks per day
        
        for (let i = 0; i < tasksPerDay; i++) {
          const startHour = 9 + Math.floor(Math.random() * 7); // Between 9 AM and 4 PM
          const startMin = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
          const duration = [60, 90, 120][Math.floor(Math.random() * 3)]; // 1, 1.5, or 2 hours
          const priority = priorities[Math.floor(Math.random() * priorities.length)];
          const customer = engineerCustomers[Math.floor(Math.random() * engineerCustomers.length)];
          
          tasks.push(createTask(
            taskId.toString().padStart(3, '0'),
            engineerId,
            date,
            startHour,
            startMin,
            duration,
            priority,
            customer.id
          ));
          
          taskId++;
        }
      }
    }
  });

  return tasks;
};

const initialState = {
  tasks: generateSampleTasks(),
  engineers: [
    {
      id: 'ENG001',
      name: 'John Smith',
      specialization: 'Network Security',
      country: 'United States',
      timezone: 'EST',
      efficiencyScore: 9.2,
      successRate: 95,
      avgResponseTime: '15 minutes',
      regions: ['United States', 'Canada'],
    },
    {
      id: 'ENG002',
      name: 'Emma Wilson',
      specialization: 'Cloud Infrastructure',
      country: 'United Kingdom',
      timezone: 'GMT',
      efficiencyScore: 8.9,
      successRate: 92,
      avgResponseTime: '20 minutes',
      regions: ['United Kingdom', 'France', 'Germany'],
    },
    {
      id: 'ENG003',
      name: 'Raj Patel',
      specialization: 'System Administration',
      country: 'India',
      timezone: 'IST',
      efficiencyScore: 9.5,
      successRate: 97,
      avgResponseTime: '12 minutes',
      regions: ['India', 'Singapore', 'Australia'],
    },
    {
      id: 'ENG004',
      name: 'Maria Garcia',
      specialization: 'Database Management',
      country: 'Spain',
      timezone: 'CET',
      efficiencyScore: 8.7,
      successRate: 90,
      avgResponseTime: '18 minutes',
      regions: ['Spain', 'Italy', 'France'],
    },
    {
      id: 'ENG005',
      name: 'David Chen',
      specialization: 'Network Infrastructure',
      country: 'Singapore',
      timezone: 'SGT',
      efficiencyScore: 9.0,
      successRate: 93,
      avgResponseTime: '16 minutes',
      regions: ['Singapore', 'Japan', 'South Korea'],
    },
  ],
  dashboardWidgets: {
    totalTasks: true,
    taskStatus: true,
    priorityDistribution: true,
    teamPerformance: true,
    recentActivity: true,
    engineerPerformance: true,
    taskDistributionPie: true,
  },
  analytics: {
    totalTasks: 248,
    tasksGrowth: '+8%',
    completionRate: 94,
    completionRateGrowth: '+5%',
    avgResponse: '18min',
    avgResponseChange: '+2min',
    activeEngineers: 12,
    activeEngineersChange: '+2',
    taskDistribution: {
      high: 35,
      medium: 45,
      low: 20
    }
  },
  locations: [],
  customers: [],
  dashboardSettings: JSON.parse(localStorage.getItem('dashboardSettings')) || {
    totalTasks: true,
    taskStatus: true,
    priorityDistribution: true,
    teamPerformance: true,
    recentActivity: true,
    engineerPerformance: true,
    taskDistributionPie: true,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    modifyTask: (state, action) => {
      const { taskId, startTime, endTime, engineerId, timezone, country } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) return;

      const task = state.tasks[taskIndex];
      const oldEngineerId = task.engineerId;
      const newStartTime = new Date(startTime).getTime();
      const newEndTime = new Date(endTime).getTime();

      // Get all tasks for the affected engineer(s)
      const affectedTasks = state.tasks.filter(t => 
        (t.engineerId === oldEngineerId || t.engineerId === engineerId) && 
        t.id !== taskId
      ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      // Check for lunch break conflict
      const lunchStart = new Date().setHours(12, 0, 0);
      const lunchEnd = new Date().setHours(12, 30, 0);
      const hasLunchConflict = (newStartTime < lunchEnd && newEndTime > lunchStart);

      if (hasLunchConflict) {
        // Move task after lunch if it conflicts with lunch
        const adjustedStartTime = new Date(lunchEnd).getTime() + 5 * 60 * 1000; // 5 min buffer
        const duration = newEndTime - newStartTime;
        task.startTime = adjustedStartTime;
        task.endTime = adjustedStartTime + duration;
      } else {
        task.startTime = newStartTime;
        task.endTime = newEndTime;
      }

      if (engineerId) {
        task.engineerId = engineerId;
      }
      if (timezone) {
        task.timezone = timezone;
      }
      if (country) {
        task.country = country;
      }

      // Reshuffle affected tasks if needed
      let currentTime = new Date(task.endTime).getTime() + 5 * 60 * 1000; // 5 min buffer
      
      affectedTasks.forEach(t => {
        const taskStart = new Date(t.startTime).getTime();
        const taskEnd = new Date(t.endTime).getTime();
        const duration = taskEnd - taskStart;

        if (taskStart < currentTime) {
          // Check if moving after current task would conflict with lunch
          const newStart = currentTime;
          const newEnd = newStart + duration;
          
          if (newStart < lunchEnd && newEnd > lunchStart) {
            // Move to after lunch
            currentTime = new Date(lunchEnd).getTime() + 5 * 60 * 1000;
          }

          state.tasks = state.tasks.map(existingTask => {
            if (existingTask.id === t.id) {
              return {
                ...existingTask,
                startTime: currentTime,
                endTime: currentTime + duration
              };
            }
            return existingTask;
          });

          currentTime += duration + 5 * 60 * 1000; // Add 5 min buffer
        }
      });
    },
    reshuffleTasks: (state, action) => {
      const { engineerId, newTask } = action.payload;
      // Sort tasks by priority (P1 > P2 > P3)
      const engineerTasks = state.tasks.filter(task => task.engineerId === engineerId);
      
      // Add new task
      engineerTasks.push(newTask);
      
      // Sort by priority and time
      engineerTasks.sort((a, b) => {
        if (a.priority !== b.priority) {
          return parseInt(a.priority.slice(1)) - parseInt(b.priority.slice(1));
        }
        return new Date(a.startTime) - new Date(b.startTime);
      });

      // Adjust conflicting tasks
      for (let i = 1; i < engineerTasks.length; i++) {
        const prevTask = engineerTasks[i - 1];
        const currentTask = engineerTasks[i];
        
        const prevEndTime = new Date(prevTask.endTime);
        const bufferTime = new Date(prevEndTime);
        bufferTime.setMinutes(bufferTime.getMinutes() + 30); // 30 min buffer
        
        if (new Date(currentTask.startTime) < bufferTime) {
          currentTask.startTime = bufferTime.toISOString();
          const duration = new Date(currentTask.endTime) - new Date(currentTask.startTime);
          const newEndTime = new Date(bufferTime);
          newEndTime.setMilliseconds(newEndTime.getMilliseconds() + duration);
          currentTask.endTime = newEndTime.toISOString();
        }
      }

      // Update state with reshuffled tasks
      state.tasks = state.tasks
        .filter(task => task.engineerId !== engineerId)
        .concat(engineerTasks);
    },
    updateDashboardWidgets: (state, action) => {
      state.dashboardWidgets = action.payload;
    },
    updateDashboardSettings: (state, action) => {
      state.dashboardSettings = action.payload;
      localStorage.setItem('dashboardSettings', JSON.stringify(action.payload));
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  modifyTask,
  reshuffleTasks,
  updateDashboardWidgets,
  updateDashboardSettings,
} = taskSlice.actions;

export default taskSlice.reducer;
