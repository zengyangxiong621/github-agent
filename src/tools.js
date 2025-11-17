/**
 * 定义 AI Agent 可用的工具
 */

export const tools = [
  {
    type: 'function',
    function: {
      name: 'git_status',
      description: '查看 Git 仓库的当前状态，包括修改的文件、暂存的文件等',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_log',
      description: '查看 Git 提交历史记录',
      parameters: {
        type: 'object',
        properties: {
          maxCount: {
            type: 'number',
            description: '要显示的最大提交数量，默认为 10'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_branch',
      description: '查看 Git 分支列表',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_checkout',
      description: '切换到指定的 Git 分支',
      parameters: {
        type: 'object',
        properties: {
          branchName: {
            type: 'string',
            description: '要切换到的分支名称'
          }
        },
        required: ['branchName']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_create_branch',
      description: '创建新的 Git 分支并切换到该分支',
      parameters: {
        type: 'object',
        properties: {
          branchName: {
            type: 'string',
            description: '新分支的名称'
          }
        },
        required: ['branchName']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_add',
      description: '将文件添加到 Git 暂存区',
      parameters: {
        type: 'object',
        properties: {
          files: {
            type: 'string',
            description: '要添加的文件路径，使用 "." 添加所有文件'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_commit',
      description: '提交暂存区的更改',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '提交信息'
          }
        },
        required: ['message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_push',
      description: '推送本地提交到远程仓库',
      parameters: {
        type: 'object',
        properties: {
          remote: {
            type: 'string',
            description: '远程仓库名称，默认为 origin'
          },
          branch: {
            type: 'string',
            description: '分支名称'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_pull',
      description: '从远程仓库拉取最新更改',
      parameters: {
        type: 'object',
        properties: {
          remote: {
            type: 'string',
            description: '远程仓库名称，默认为 origin'
          },
          branch: {
            type: 'string',
            description: '分支名称'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_diff',
      description: '查看文件差异',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_stash',
      description: '暂存当前的工作目录更改',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'git_stash_pop',
      description: '应用最近一次暂存的更改',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_repo',
      description: '获取 GitHub 仓库的详细信息',
      parameters: {
        type: 'object',
        properties: {
          repo: {
            type: 'string',
            description: '仓库名称'
          }
        },
        required: ['repo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_commits',
      description: '获取 GitHub 仓库的最近提交记录',
      parameters: {
        type: 'object',
        properties: {
          repo: {
            type: 'string',
            description: '仓库名称'
          },
          count: {
            type: 'number',
            description: '要获取的提交数量，默认为 10'
          }
        },
        required: ['repo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_branches',
      description: '获取 GitHub 仓库的分支列表',
      parameters: {
        type: 'object',
        properties: {
          repo: {
            type: 'string',
            description: '仓库名称'
          }
        },
        required: ['repo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_prs',
      description: '获取 GitHub 仓库的 Pull Requests',
      parameters: {
        type: 'object',
        properties: {
          repo: {
            type: 'string',
            description: '仓库名称'
          },
          state: {
            type: 'string',
            description: 'PR 状态：open, closed, 或 all',
            enum: ['open', 'closed', 'all']
          }
        },
        required: ['repo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_issues',
      description: '获取 GitHub 仓库的 Issues',
      parameters: {
        type: 'object',
        properties: {
          repo: {
            type: 'string',
            description: '仓库名称'
          },
          state: {
            type: 'string',
            description: 'Issue 状态：open, closed, 或 all',
            enum: ['open', 'closed', 'all']
          }
        },
        required: ['repo']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_search_repos',
      description: '在 GitHub 上搜索仓库',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索关键词'
          }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'github_get_user',
      description: '获取 GitHub 用户信息',
      parameters: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: '用户名，不提供则获取当前用户信息'
          }
        },
        required: []
      }
    }
  },
  // 文件操作工具
  {
    type: 'function',
    function: {
      name: 'list_files',
      description: '列出目录中的文件和文件夹',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: '目标路径，默认为当前目录 (.)'
          },
          showHidden: {
            type: 'boolean',
            description: '是否显示隐藏文件，默认为 false'
          },
          recursive: {
            type: 'boolean',
            description: '是否递归列出子目录，默认为 false'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: '读取文件内容',
      parameters: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: '文件路径'
          },
          maxLines: {
            type: 'number',
            description: '最大读取行数，0 表示全部读取，默认为 0'
          }
        },
        required: ['filePath']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_files',
      description: '搜索文件（支持通配符模式）',
      parameters: {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: '搜索模式，支持 * 和 ? 通配符，如 "*.js" 或 "test*.py"'
          },
          searchPath: {
            type: 'string',
            description: '搜索路径，默认为当前目录'
          }
        },
        required: ['pattern']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_file_info',
      description: '获取文件或目录的详细信息',
      parameters: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: '文件或目录路径'
          }
        },
        required: ['filePath']
      }
    }
  },
  // 终端命令工具
  {
    type: 'function',
    function: {
      name: 'execute_command',
      description: '在终端执行命令。可以执行任何 shell 命令，如 ls, cat, grep, npm, python 等。注意：危险命令会被自动拒绝',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: '要执行的命令'
          },
          timeout: {
            type: 'number',
            description: '命令超时时间（毫秒），默认 30000'
          }
        },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'execute_commands',
      description: '批量执行多个命令（串行执行）',
      parameters: {
        type: 'object',
        properties: {
          commands: {
            type: 'array',
            description: '要执行的命令数组',
            items: {
              type: 'string'
            }
          },
          stopOnError: {
            type: 'boolean',
            description: '遇到错误是否停止执行，默认 false'
          }
        },
        required: ['commands']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_command_history',
      description: '获取最近执行的命令历史',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: '获取的数量，默认 10'
          }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'check_command_exists',
      description: '检查系统中是否存在某个命令',
      parameters: {
        type: 'object',
        properties: {
          commandName: {
            type: 'string',
            description: '命令名称，如 "node", "python", "git"'
          }
        },
        required: ['commandName']
      }
    }
  },
  // 工作目录管理工具
  {
    type: 'function',
    function: {
      name: 'change_directory',
      description: '切换当前工作目录。可以使用相对路径或绝对路径',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: '目标路径，如 "../project", "/Users/xxx/project", "src"'
          }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'show_current_directory',
      description: '显示当前工作目录路径',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'go_to_parent_directory',
      description: '返回到上一级目录（相当于 cd ..）',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
];

