import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readProjects(): Promise<Project[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

async function getTaskCount(projectId: string): Promise<number> {
  try {
    const tasksFile = path.join(DATA_DIR, 'tasks.json');
    const data = await fs.readFile(tasksFile, 'utf-8');
    const tasks = JSON.parse(data);
    return tasks.filter((t: any) => t.projectId === projectId).length;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const projects = await readProjects();
    
    if (id) {
      const project = projects.find((p) => p.id === id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    // Add task counts to projects
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => ({
        ...project,
        taskCount: await getTaskCount(project.id),
      }))
    );

    return NextResponse.json(projectsWithCounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const projects = await readProjects();
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    await writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const projects = await readProjects();
    const filteredProjects = projects.filter((p) => p.id !== id);

    if (projects.length === filteredProjects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await writeProjects(filteredProjects);

    // Also delete all tasks for this project
    try {
      const tasksFile = path.join(DATA_DIR, 'tasks.json');
      const data = await fs.readFile(tasksFile, 'utf-8');
      const tasks = JSON.parse(data);
      const filteredTasks = tasks.filter((t: any) => t.projectId !== id);
      await fs.writeFile(tasksFile, JSON.stringify(filteredTasks, null, 2));
    } catch {
      // Tasks file might not exist
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
