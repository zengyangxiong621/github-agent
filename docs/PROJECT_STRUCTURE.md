# 📂 项目结构说明

## 目录结构

```
github-agent/
├── src/                      # 源代码目录
│   ├── index.js             # 主程序入口，处理 CLI 交互
│   ├── agent.js             # Agent 核心逻辑，协调各模块
│   ├── config.js            # 配置管理，加载环境变量
│   ├── deepseek.js          # DeepSeek AI 客户端封装
│   ├── github-mcp.js        # GitHub MCP 客户端，调用 GitHub API
│   ├── git-commands.js      # Git 命令执行器，封装 simple-git
│   └── tools.js             # AI 工具定义（function calling）
├── config.example.env        # 环境变量配置示例
├── package.json             # 项目配置和依赖
├── .gitignore               # Git 忽略规则
├── LICENSE                  # MIT 许可证
├── README.md                # 项目主文档（英文）
├── README.zh-CN.md          # 中文文档
├── QUICKSTART.md            # 快速开始指南
├── USAGE.md                 # 详细使用指南
└── PROJECT_STRUCTURE.md     # 本文件
```

## 核心模块说明

### 1. index.js - 主程序入口
**职责**：
- 提供命令行交互界面
- 处理用户输入
- 显示欢迎信息和帮助文档
- 处理特殊命令（exit, clear, help）

**主要功能**：
```javascript
- printWelcome()    // 显示欢迎信息
- printHelp()       // 显示帮助信息
- main()            // 主循环，处理用户输入
```

### 2. agent.js - Agent 核心逻辑
**职责**：
- 协调 AI、Git 和 GitHub 模块
- 处理工具调用
- 格式化输出结果

**主要类和方法**：
```javascript
class GitHubAgent {
  async initialize()              // 初始化 Agent
  async handleMessage(message)    // 处理用户消息
  async executeTool(name, args)   // 执行具体工具
  clearHistory()                  // 清除对话历史
}
```

### 3. config.js - 配置管理
**职责**：
- 加载环境变量
- 验证配置完整性
- 提供配置访问接口

**配置项**：
```javascript
- deepseek.apiKey     // DeepSeek API Key
- deepseek.apiUrl     // DeepSeek API 地址
- github.token        // GitHub Token
- github.owner        // GitHub 用户名
- workspace.path      // 工作目录路径
```

### 4. deepseek.js - AI 客户端
**职责**：
- 封装 DeepSeek AI API 调用
- 管理对话历史
- 处理 Function Calling

**主要类和方法**：
```javascript
class DeepSeekClient {
  async chat(message, tools)         // 发送消息并获取响应
  addToolResult(id, result)          // 添加工具执行结果
  setSystemPrompt(prompt)            // 设置系统提示词
  clearHistory()                     // 清除对话历史
}
```

### 5. github-mcp.js - GitHub 客户端
**职责**：
- 调用 GitHub REST API
- 获取仓库、提交、分支、PR、Issues 等信息
- 搜索仓库和用户

**主要类和方法**：
```javascript
class GitHubMCPClient {
  async getRepository(repo)           // 获取仓库信息
  async getRecentCommits(repo, count) // 获取提交记录
  async getBranches(repo)             // 获取分支列表
  async getPullRequests(repo, state)  // 获取 PR
  async getIssues(repo, state)        // 获取 Issues
  async searchRepositories(query)     // 搜索仓库
  async getUserInfo(username)         // 获取用户信息
}
```

### 6. git-commands.js - Git 命令执行器
**职责**：
- 封装 simple-git 库
- 执行各种 Git 命令
- 格式化 Git 输出

**主要类和方法**：
```javascript
class GitCommands {
  async status()                    // git status
  async log(maxCount)               // git log
  async branch()                    // git branch
  async checkout(branch)            // git checkout
  async createBranch(branch)        // git checkout -b
  async add(files)                  // git add
  async commit(message)             // git commit
  async push(remote, branch)        // git push
  async pull(remote, branch)        // git pull
  async diff(options)               // git diff
  async stash(options)              // git stash
  async stashPop()                  // git stash pop
  async merge(branch)               // git merge
  // ... 更多命令
}

// 辅助函数
formatStatus(statusData)   // 格式化状态输出
formatLog(logData)         // 格式化日志输出
```

### 7. tools.js - 工具定义
**职责**：
- 定义 AI 可用的工具（Function Calling Schema）
- 描述工具的参数和用途

**工具列表**：

#### Git 工具
- `git_status` - 查看状态
- `git_log` - 查看提交历史
- `git_branch` - 查看分支
- `git_checkout` - 切换分支
- `git_create_branch` - 创建分支
- `git_add` - 添加文件
- `git_commit` - 提交更改
- `git_push` - 推送
- `git_pull` - 拉取
- `git_diff` - 查看差异
- `git_stash` - 暂存
- `git_stash_pop` - 应用暂存

#### GitHub 工具
- `github_get_repo` - 获取仓库信息
- `github_get_commits` - 获取提交记录
- `github_get_branches` - 获取分支列表
- `github_get_prs` - 获取 PR
- `github_get_issues` - 获取 Issues
- `github_search_repos` - 搜索仓库
- `github_get_user` - 获取用户信息

## 数据流

```
用户输入
   ↓
index.js (CLI)
   ↓
agent.js (协调)
   ↓
deepseek.js (AI 理解)
   ↓
tools.js (工具选择)
   ↓
agent.js (执行工具)
   ↓
git-commands.js / github-mcp.js (实际操作)
   ↓
agent.js (格式化结果)
   ↓
deepseek.js (生成回复)
   ↓
index.js (显示结果)
```

## 工作流程

### 1. 初始化阶段
```
1. 加载环境变量 (config.js)
2. 验证配置 (config.js)
3. 初始化 Agent (agent.js)
4. 初始化 GitHub 客户端 (github-mcp.js)
5. 设置系统提示词 (deepseek.js)
```

### 2. 交互阶段
```
1. 接收用户输入 (index.js)
2. 发送到 AI (agent.js → deepseek.js)
3. AI 理解意图并选择工具 (deepseek.js)
4. 执行工具调用 (agent.js → git-commands.js / github-mcp.js)
5. 收集执行结果 (agent.js)
6. AI 总结结果 (deepseek.js)
7. 显示给用户 (index.js)
```

## 依赖关系

```
index.js
  ├── agent.js
  │     ├── deepseek.js
  │     │     └── config.js
  │     ├── github-mcp.js
  │     │     └── config.js
  │     ├── git-commands.js
  │     │     └── config.js
  │     └── tools.js
  └── config.js
```

## 扩展指南

### 添加新的 Git 命令

1. 在 `git-commands.js` 中添加方法：
```javascript
async newCommand(args) {
  try {
    const result = await this.git.someGitCommand(args);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

2. 在 `tools.js` 中定义工具：
```javascript
{
  type: 'function',
  function: {
    name: 'git_new_command',
    description: '命令描述',
    parameters: { /* 参数定义 */ }
  }
}
```

3. 在 `agent.js` 的 `executeTool` 中添加处理：
```javascript
case 'git_new_command': {
  const result = await this.git.newCommand(args);
  // 处理和显示结果
  return result;
}
```

### 添加新的 GitHub 功能

类似的步骤，在对应的文件中添加代码。

## 技术栈

- **Runtime**: Node.js 18+
- **AI**: DeepSeek API
- **GitHub**: GitHub REST API v3
- **Git**: simple-git
- **CLI**: inquirer, chalk, ora
- **HTTP**: axios
- **Environment**: dotenv

## 最佳实践

1. **错误处理**：所有异步操作都应该有 try-catch
2. **用户反馈**：使用 chalk 和 ora 提供清晰的视觉反馈
3. **配置管理**：敏感信息通过环境变量管理
4. **代码组织**：每个模块职责单一，便于维护
5. **文档完善**：为每个函数添加注释说明

## 性能考虑

1. **API 调用**: 合理控制 AI 和 GitHub API 的调用频率
2. **历史管理**: 对话历史会影响 token 消耗，适时清除
3. **Git 操作**: 大型仓库操作可能较慢，添加适当的加载提示

## 安全注意事项

1. ⚠️ `.env` 文件永远不要提交到 Git
2. ⚠️ API Keys 和 Tokens 应该定期轮换
3. ⚠️ GitHub Token 权限应该按需分配
4. ⚠️ 生产环境应该使用更安全的密钥管理方案

---

**本项目结构清晰，易于扩展和维护。**

