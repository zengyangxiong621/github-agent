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
  }
];

