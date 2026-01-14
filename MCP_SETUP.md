# MCP Server Configuration Guide

This guide explains how to configure the TaskFlow MCP server with various AI assistants.

## What is MCP?

Model Context Protocol (MCP) is a standardized way for AI assistants to interact with external tools and data sources. The TaskFlow MCP server allows AI assistants to manage your tasks programmatically.

## Installation

The MCP server is already included in this repository at `mcp-server/index.js`.

## Configuration

### For Claude Desktop

1. Locate your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the TaskFlow MCP server to your configuration:

```json
{
  "mcpServers": {
    "taskflow": {
      "command": "node",
      "args": ["/absolute/path/to/CommitLog/mcp-server/index.js"]
    }
  }
}
```

3. Replace `/absolute/path/to/CommitLog` with the actual path to your repository.

4. Restart Claude Desktop.

### For Other MCP-Compatible Clients

Configure the MCP client to use stdio transport with:
- **Command**: `node`
- **Arguments**: `["/absolute/path/to/CommitLog/mcp-server/index.js"]`

## Available Tools

Once configured, you can ask your AI assistant to:

### Project Management
- "Create a new project called 'Marketing Campaign'"
- "List all my projects"
- "Delete the 'Old Project' project"

### Task Management
- "Create a high-priority task 'Fix login bug' in the Development project"
- "Show me all tasks in the Website Redesign project"
- "Update task 'Design mockup' to completed status"
- "Delete the task with ID 12345"
- "List all tasks that are in-progress"

### Complex Operations
- "Create a project called 'Q1 Goals' and add three tasks: 'Define OKRs', 'Team meeting', and 'Documentation'"
- "Show me all high-priority tasks across all projects"
- "Mark all pending tasks in Project X as in-progress"

## Example MCP Tool Usage

The MCP server provides these tools:

1. **list_projects** - Get all projects with task counts
2. **create_project** - Create a new project
   - Parameters: `name` (required), `description` (optional)
3. **delete_project** - Delete a project
   - Parameters: `id` (required)
4. **list_tasks** - List all tasks or filter by project
   - Parameters: `projectId` (optional)
5. **create_task** - Create a new task
   - Parameters: `projectId` (required), `title` (required), `description`, `status`, `priority`, `dueDate`
6. **update_task** - Update an existing task
   - Parameters: `id` (required), plus any fields to update
7. **delete_task** - Delete a task
   - Parameters: `id` (required)

## Testing the MCP Server

You can test the MCP server manually using stdio:

```bash
cd /path/to/CommitLog
node mcp-server/index.js
```

The server will output: `TaskFlow MCP Server running on stdio`

Send MCP protocol messages via stdin to interact with it.

## Troubleshooting

### Server not appearing in Claude Desktop
- Verify the path in `claude_desktop_config.json` is absolute and correct
- Check that Node.js is installed and accessible from the command line
- Restart Claude Desktop after configuration changes

### Permission errors
- Ensure the `data/` directory is writable
- Check file permissions on `mcp-server/index.js`

### Data not persisting
- The MCP server uses the same `data/` directory as the web application
- Both should share the same projects and tasks
- Make sure both the web app and MCP server point to the same data directory

## Data Storage

Both the web application and MCP server use JSON files in the `data/` directory:
- `data/projects.json` - All projects
- `data/tasks.json` - All tasks

This allows seamless integration between the web UI and AI assistant interactions.
