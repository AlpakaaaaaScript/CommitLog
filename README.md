# TaskFlow - Professional Task Management System

A modern, professional task management application built with Next.js, featuring an orange-themed UI and AI integration through MCP (Model Context Protocol).

## Features

- 🎨 **Modern Orange-Themed UI** - Professional, techy design with glassmorphism effects
- 📁 **Project-Based Organization** - Create multiple projects, each with their own tasks
- ✅ **Task Management** - Full CRUD operations for tasks with status, priority, and due dates
- 🤖 **AI Integration** - MCP server for AI assistants to manage tasks programmatically
- ☁️ **Vercel Deployment** - Ready to deploy on Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AlpakaaaaaScript/CommitLog.git
cd CommitLog
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
TaskFlow/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── projects/         # Project CRUD endpoints
│   │   └── tasks/            # Task CRUD endpoints
│   ├── projects/[id]/        # Project detail page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (projects list)
├── mcp-server/               # MCP server for AI integration
│   └── index.js              # MCP server implementation
├── data/                     # JSON data storage (auto-created)
│   ├── projects.json         # Projects data
│   └── tasks.json            # Tasks data
└── package.json
```

## Usage

### Web Interface

1. **Create a Project**: Click "New Project" on the home page
2. **View Project**: Click "Open" on any project card
3. **Manage Tasks**: Within a project, create, edit, update status, or delete tasks
4. **Delete Project**: Click "Delete" on a project card (this also deletes all associated tasks)

### Task Properties

- **Title**: Name of the task
- **Description**: Detailed description
- **Status**: `pending`, `in-progress`, or `completed`
- **Priority**: `low`, `medium`, or `high`
- **Due Date**: Optional deadline

## MCP Server (AI Integration)

The MCP server allows AI assistants (like Claude, ChatGPT with MCP support) to interact with your tasks.

### Available MCP Tools

1. **list_projects** - Get all projects with task counts
2. **create_project** - Create a new project
3. **delete_project** - Delete a project and its tasks
4. **list_tasks** - List all tasks or filter by project
5. **create_task** - Create a new task
6. **update_task** - Update task properties
7. **delete_task** - Delete a task

### Using the MCP Server

1. Make the MCP server executable:
```bash
chmod +x mcp-server/index.js
```

2. Run the MCP server:
```bash
node mcp-server/index.js
```

3. Configure your AI assistant to use the MCP server by adding to your MCP configuration:

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "taskflow": {
      "command": "node",
      "args": ["/path/to/CommitLog/mcp-server/index.js"]
    }
  }
}
```

**For other AI clients**: Configure stdio transport with the path to the MCP server.

### Example AI Commands

Once configured, you can ask your AI assistant:
- "Create a new project called 'Website Redesign'"
- "List all my tasks"
- "Mark task 'Fix login bug' as completed"
- "Create a high-priority task for the Marketing project"
- "Show me all tasks in the Development project"

## Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project and deploy

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure the build
6. Click "Deploy"

### Environment Variables

No environment variables are required for basic functionality. Data is stored in JSON files in the `data/` directory.

For production, consider using a database like:
- MongoDB Atlas
- PostgreSQL (Vercel Postgres)
- Supabase

## API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects?id={id}` - Get single project
- `POST /api/projects` - Create project
- `DELETE /api/projects?id={id}` - Delete project

### Tasks

- `GET /api/tasks` - List all tasks
- `GET /api/tasks?projectId={id}` - List tasks for a project
- `GET /api/tasks?id={id}` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks?id={id}` - Delete task

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Model Context Protocol (MCP)
- **Deployment**: Vercel

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.