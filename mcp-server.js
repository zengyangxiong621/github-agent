#!/usr/bin/env node

/**
 * GitHub Agent MCP Server
 * 将 GitHub Agent 作为 MCP Server 集成到 Cursor/Claude Desktop
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { GitCommands } from './src/git-commands.js';
import { FileOperations } from './src/file-operations.js';
import { TerminalCommands } from './src/terminal-commands.js';
import { GitHubMCPClient } from './src/github-mcp.js';
import { WorkspaceManager } from './src/workspace-manager.js';

// 创建 MCP Server
const server = new Server(
  {
    name: 'github-agent',
    version: '1.3.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 初始化所有模块
const workspace = new WorkspaceManager();
const git = new GitCommands(workspace.getCurrentPath());
const fileOps = new FileOperations(workspace.getCurrentPath());
const terminal = new TerminalCommands(workspace.getCurrentPath());
const github = new GitHubMCPClient();

// 注册所有工具
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      // Git 工具
      {
        name: 'git_status',
        description: '查看 Git 仓库状态',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'git_log',
        description: '查看 Git 提交历史',
        inputSchema: {
          type: 'object',
          properties: {
            maxCount: {
              type: 'number',
              description: '最大提交数量',
            },
          },
        },
      },
      {
        name: 'git_commit',
        description: '提交更改',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: '提交信息',
            },
          },
          required: ['message'],
        },
      },
      // 文件操作工具
      {
        name: 'list_files',
        description: '列出目录文件',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: '目标路径',
            },
          },
        },
      },
      {
        name: 'read_file',
        description: '读取文件内容',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: '文件路径',
            },
          },
          required: ['filePath'],
        },
      },
      // 终端命令工具
      {
        name: 'execute_command',
        description: '执行终端命令',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: '要执行的命令',
            },
          },
          required: ['command'],
        },
      },
      // ... 更多工具
    ],
  };
});

// 处理工具调用
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'git_status': {
        const result = await git.status();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'git_log': {
        const result = await git.log(args.maxCount || 10);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'git_commit': {
        const result = await git.commit(args.message);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_files': {
        const result = await fileOps.listFiles(args.path || '.');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'read_file': {
        const result = await fileOps.readFile(args.filePath);
        return {
          content: [
            {
              type: 'text',
              text: result.success ? result.data.content : result.error,
            },
          ],
        };
      }

      case 'execute_command': {
        const result = await terminal.executeCommand(args.command);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
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

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GitHub Agent MCP Server running on stdio');
}

main().catch(console.error);

