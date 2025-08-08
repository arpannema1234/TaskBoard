# TaskBoards - Full-Stack Task Management App

A powerful task management application built with Next.js that allows users to create multiple task boards and manage their to-dos with secure authentication and authorization.

## Features

### Authentication & Authorization

- ✅ User registration and login with JWT authentication
- ✅ HTTP-only cookies for secure token storage
- ✅ Protected routes and API endpoints
- ✅ User isolation - users can only access their own data

### Task Management

- ✅ Create multiple task boards (Work, Personal, Groceries, etc.)
- ✅ Full CRUD operations on boards and tasks
- ✅ Task status management (Pending/Completed)
- ✅ Due dates with visual indicators for overdue and due-soon tasks
- ✅ Task descriptions and creation timestamps
- ✅ Board and task deletion with confirmation

### UI/UX

- ✅ Responsive design for desktop and mobile
- ✅ Clean, polished interface with Tailwind CSS
- ✅ Modal dialogs for creating/editing
- ✅ Visual status indicators and due date warnings
- ✅ Intuitive navigation and user feedback

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Data Storage**: JSON file-based storage (no external database)
- **API**: RESTful endpoints with proper validation

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # RESTful API endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   └── boards/        # Board and task management
│   ├── dashboard/         # Dashboard page
│   ├── board/[boardId]/   # Individual board view
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/            # Reusable React components
├── lib/                   # Utility functions and data operations
├── types/                 # TypeScript type definitions
└── middleware.ts          # Authentication middleware
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   The `.env.local` file is already configured with a development JWT secret.
   For production, update `JWT_SECRET` with a secure random string.

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Boards

- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `PUT /api/boards/[boardId]` - Update board
- `DELETE /api/boards/[boardId]` - Delete board

### Tasks

- `GET /api/boards/[boardId]/tasks` - Get board's tasks
- `POST /api/boards/[boardId]/tasks` - Create new task
- `PUT /api/boards/[boardId]/tasks/[taskId]` - Update task
- `DELETE /api/boards/[boardId]/tasks/[taskId]` - Delete task

## Data Model

### User

- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `createdAt`: Creation timestamp

### Board

- `id`: Unique identifier
- `name`: Board name
- `userId`: Owner's user ID
- `createdAt`: Creation timestamp

### Task

- `id`: Unique identifier
- `title`: Task title
- `description`: Optional description
- `status`: 'pending' | 'completed'
- `dueDate`: Optional due date
- `createdAt`: Creation timestamp
- `boardId`: Parent board ID

## Security Features

- JWT-based authentication with HTTP-only cookies
- Input validation on both frontend and backend
- Authorization checks on all data operations
- Protected routes and middleware
- Secure password hashing with bcrypt
- CSRF protection through same-site cookies

## Development

The app includes comprehensive error handling, input validation, and user feedback. All data is stored in a local JSON file (`data.json`) that's automatically created when the app first runs.

To reset all data, simply delete the `data.json` file and restart the server.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
