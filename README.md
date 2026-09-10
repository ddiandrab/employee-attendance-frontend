# Employee Attendance Frontend

Frontend application for the Employee Attendance system.
The application provides role-based screens for employees, HR, and administrators.

## Features

* Login
* JWT-based authentication
* Role-based navigation
* Employee profile
* Employee self-service profile update
* Change password
* Check-in
* Check-out
* Attendance history
* Attendance date filtering
* Employee management for HR/Admin
* All attendance view for HR/Admin
* In-app notifications
* Notification read/unread state
* Responsive UI

## Technology Stack

| Technology      | Version / Usage      |
| --------------- | -------------------- |
| Node.js         | 24.20.0              |
| TypeScript      | 6.x                  |
| React           | 19.x                 |
| Vite            | 7.x                  |
| React Router    | 7.x                  |
| Bootstrap       | 5.x                  |
| React-Bootstrap | 2.x                  |
| Fetch API       | HTTP communication   |
| React Context   | Authentication state |
| ESLint          | Code linting         |
| Prettier        | Code formatting      |
| npm             | Package management   |


## Application Architecture

The frontend communicates with the NestJS backend through REST APIs.

```text
React Components
       │
       ▼
     Pages
       │
       ▼
   API Modules
       │
       ▼
   API Client
       │
       │ HTTP + JWT
       ▼
NestJS Backend
```

Authentication state is shared using React Context:

```text
AuthContext
    │
    ├── Navigation
    ├── Attendance
    ├── Profile
    └── Notifications
```

## Prerequisites

Make sure the following are installed:

* Node.js 24
* npm

Check the versions:

```bash
node --version
npm --version
```

## Installation

Enter the frontend directory:

```bash
cd employee-attendance-frontend
```

Install dependencies:

```bash
npm install
```

## Backend Configuration

The frontend currently communicates with the backend at:

```text
http://localhost:3000
```

The API base URL is configured in:

```text
src/api/client.ts
```

Current configuration:

```ts
const API_BASE_URL = 'http://localhost:3000';
```

Make sure the backend is running before using the application.

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Typically:

```text
http://localhost:5173
```

Open the URL in your browser.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Responsive UI

The UI uses:

* Bootstrap 5
* React-Bootstrap
* Bootstrap responsive utilities

The application is designed to support both desktop and smaller screen sizes.



