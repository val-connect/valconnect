# ValConnect Workforce Management

A modern web application for managing site engineer tasks and engagements.

## Features

### Manager Dashboard
- View all active tasks across Customers, Customer Location, Priority, and Assigned Site Engineers
- Drill down functionality to view Site Engineer's schedules and availability
- Manual task assignment with automatic conflict resolution
- Real-time updates for task reshuffling
- Default lunch break management (12:00-12:30)

### Site Engineer Dashboard
- Daily engagement overview
- Priority-based task visualization
- Availability status
- Default lunch break display
- Real-time schedule updates

## Technical Stack
- Frontend: React.js with Material-UI
- State Management: Redux
- Real-time Updates: WebSocket
- Styling: Tailwind CSS

## Project Structure
```
task-management-system/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main dashboard pages
│   ├── redux/             # State management
│   ├── services/          # API and WebSocket services
│   └── utils/             # Helper functions
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Build for production: `npm run build`
