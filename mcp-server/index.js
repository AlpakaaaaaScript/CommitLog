#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readProjects() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeProjects(projects) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

async function readTasks() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await ensureDataDir();
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

const server = new Server(
  {
    name: 'taskflow-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const TOOLS = [
  {
    name: 'list_projects',
    description: 'List all projects',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_project',
    description: 'Create a new project',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        description: { type: 'string', description: 'Project description' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_project',
    description: 'Delete a project',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_tasks',
    description: 'List tasks, optionally filtered by project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Filter by project ID (optional)' },
      },
    },
  },
  {
    name: 'create_task',
    description: 'Create a new task',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          description: 'Task status',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Task priority',
        },
        dueDate: { type: 'string', description: 'Due date (ISO format)' },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'update_task',
    description: 'Update an existing task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          description: 'Task status',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Task priority',
        },
        dueDate: { type: 'string', description: 'Due date (ISO format)' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_task',
    description: 'Delete a task',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Task ID' },
      },
      required: ['id'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_projects': {
        const projects = await readProjects();
        const tasks = await readTasks();
        const projectsWithCounts = projects.map((project) => ({
          ...project,
          taskCount: tasks.filter((t) => t.projectId === project.id).length,
        }));
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projectsWithCounts, null, 2),
            },
          ],
        };
      }

      case 'create_project': {
        const projects = await readProjects();
        const newProject = {
          id: Date.now().toString(),
          name: args.name,
          description: args.description || '',
          createdAt: new Date().toISOString(),
        };
        projects.push(newProject);
        await writeProjects(projects);
        return {
          content: [
            {
              type: 'text',
              text: `Project created successfully: ${JSON.stringify(newProject, null, 2)}`,
            },
          ],
        };
      }

      case 'delete_project': {
        const projects = await readProjects();
        const tasks = await readTasks();
        const filteredProjects = projects.filter((p) => p.id !== args.id);
        
        if (projects.length === filteredProjects.length) {
          throw new Error('Project not found');
        }

        await writeProjects(filteredProjects);
        
        // Delete associated tasks
        const filteredTasks = tasks.filter((t) => t.projectId !== args.id);
        await writeTasks(filteredTasks);

        return {
          content: [
            {
              type: 'text',
              text: `Project deleted successfully (ID: ${args.id})`,
            },
          ],
        };
      }

      case 'list_tasks': {
        const tasks = await readTasks();
        const filteredTasks = args.projectId
          ? tasks.filter((t) => t.projectId === args.projectId)
          : tasks;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(filteredTasks, null, 2),
            },
          ],
        };
      }

      case 'create_task': {
        const tasks = await readTasks();
        const newTask = {
          id: Date.now().toString(),
          projectId: args.projectId,
          title: args.title,
          description: args.description || '',
          status: args.status || 'pending',
          priority: args.priority || 'medium',
          dueDate: args.dueDate || undefined,
          createdAt: new Date().toISOString(),
        };
        tasks.push(newTask);
        await writeTasks(tasks);
        return {
          content: [
            {
              type: 'text',
              text: `Task created successfully: ${JSON.stringify(newTask, null, 2)}`,
            },
          ],
        };
      }

      case 'update_task': {
        const tasks = await readTasks();
        const taskIndex = tasks.findIndex((t) => t.id === args.id);
        
        if (taskIndex === -1) {
          throw new Error('Task not found');
        }

        tasks[taskIndex] = {
          ...tasks[taskIndex],
          ...(args.title !== undefined && { title: args.title }),
          ...(args.description !== undefined && { description: args.description }),
          ...(args.status !== undefined && { status: args.status }),
          ...(args.priority !== undefined && { priority: args.priority }),
          ...(args.dueDate !== undefined && { dueDate: args.dueDate }),
        };

        await writeTasks(tasks);
        return {
          content: [
            {
              type: 'text',
              text: `Task updated successfully: ${JSON.stringify(tasks[taskIndex], null, 2)}`,
            },
          ],
        };
      }

      case 'delete_task': {
        const tasks = await readTasks();
        const filteredTasks = tasks.filter((t) => t.id !== args.id);
        
        if (tasks.length === filteredTasks.length) {
          throw new Error('Task not found');
        }

        await writeTasks(filteredTasks);
        return {
          content: [
            {
              type: 'text',
              text: `Task deleted successfully (ID: ${args.id})`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('TaskFlow MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
