# 🤖 GitHub Agent

一个基于 DeepSeek AI 和 GitHub MCP 的智能 Git 和 GitHub 助手。通过自然语言对话的方式，轻松执行 Git 命令、查看 GitHub 仓库信息、管理文件和执行终端命令。

## ✨ 特性

- 🎯 **自然语言交互**: 使用自然语言描述你想要做的操作
- 🔧 **完整的 Git 支持**: 支持所有常用 Git 命令
- 🌐 **GitHub 集成**: 查看仓库信息、提交记录、PR、Issues 等
- 📂 **文件管理**: 读取文件列表、查看文件内容、搜索文件
- 💻 **终端命令执行**: 自动执行系统命令和脚本
- 🤖 **AI 驱动**: 基于 DeepSeek AI 理解你的意图
- 📊 **美观的输出**: 彩色、格式化的命令行输出
- 🔒 **安全保护**: 自动拒绝危险命令

## 🚀 功能

### Git 操作
- ✅ 查看仓库状态 (`git status`)
- ✅ 查看提交历史 (`git log`)
- ✅ 分支管理 (创建、切换、查看分支)
- ✅ 文件操作 (add, commit, push, pull)
- ✅ 查看文件差异 (`git diff`)
- ✅ 暂存管理 (`git stash`)
- ✅ 分支合并 (`git merge`)
- ✅ 更多 Git 命令...

### GitHub 操作
- 📦 查看仓库详细信息
- 📝 获取最近提交记录
- 🌿 查看分支列表
- 🔀 查看 Pull Requests
- 🐛 查看 Issues
- 🔍 搜索 GitHub 仓库
- 👤 获取用户信息

### 文件操作 (新增！)
- 📂 列出目录文件
- 📄 读取文件内容
- 🔍 搜索文件（支持通配符）
- 📋 获取文件详细信息

### 终端命令 (新增！)
- 💻 执行单个或多个命令
- 📜 查看命令历史
- ✅ 检查命令是否存在
- 🔒 自动拒绝危险命令

## 📦 安装

### 前置要求

- Node.js >= 18
- npm 或 yarn
- Git
- DeepSeek API Key
- GitHub Personal Access Token

### 安装步骤

#### 方式一：快速全局安装（推荐）⭐

1. **克隆仓库并安装依赖**
```bash
git clone https://github.com/your-username/github-agent.git
cd github-agent
npm install
```

2. **运行全局安装脚本**
```bash
./setup-global.sh
```

3. **配置全局环境变量**
```bash
./setup-config.sh
```

完成！现在你可以在任何目录使用 `agent` 命令了。

#### 方式二：本地开发安装

1. **克隆仓库**
```bash
git clone https://github.com/your-username/github-agent.git
cd github-agent
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

复制示例配置文件并编辑：
```bash
cp config.example.env .env
```

编辑 `.env` 文件，填入你的配置：
```env
# DeepSeek AI API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# GitHub 配置
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username_here

# 工作区路径（可选，默认使用当前目录）
WORKSPACE_PATH=/path/to/your/workspace
```

### 获取 API Keys

#### DeepSeek API Key
1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册并登录
3. 在控制台中创建 API Key

#### GitHub Personal Access Token
1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `repo` (完整的仓库访问权限)
   - `user` (读取用户信息)
4. 生成并复制 token

## 🎮 使用方法

### 全局使用（推荐）

如果你使用了全局安装脚本，可以在任何目录直接运行：

```bash
# 在任何项目目录中
cd ~/my-project
agent

# 或使用完整命令名
github-agent
```

**优势：**
- ✅ 在任何目录都可以使用
- ✅ 自动使用当前目录作为工作目录
- ✅ 配置文件统一管理（`~/.agent.env`）
- ✅ 无需每次都进入 github-agent 项目目录

### 本地启动

如果使用本地开发模式：

```bash
# 在 github-agent 项目目录中
npm start
```

或使用开发模式（自动重启）：
```bash
npm run dev
```

### 交互命令

启动后，你可以：

#### 特殊命令
- `exit` / `quit` / `q` - 退出程序
- `clear` - 清除对话历史
- `help` / `h` - 显示帮助信息

#### 自然语言示例

**Git 操作：**
```
💬 你: 查看当前仓库状态
💬 你: 显示最近 10 次提交
💬 你: 切换到 main 分支
💬 你: 创建一个名为 feature-new 的分支
💬 你: 添加所有文件到暂存区
💬 你: 提交更改，消息为 "update code"
💬 你: 推送到远程仓库
```

**GitHub 操作：**
```
💬 你: 查看 github-agent 仓库的最近提交
💬 你: 获取 owner/repo 仓库的信息
💬 你: 查看 owner/repo 的所有分支
💬 你: 显示 owner/repo 的 open 状态的 PR
💬 你: 显示 owner/repo 的 Issues
💬 你: 搜索 react 相关的仓库
💬 你: 获取用户 github 的信息
```

**文件和终端操作：**
```
💬 你: 列出当前目录的所有文件
💬 你: 读取 package.json 文件
💬 你: 搜索所有 .js 文件
💬 你: 执行 npm test 命令
💬 你: 切换到 src 目录
```

**工作目录管理：**
```
💬 你: 显示当前工作目录
💬 你: 切换到父目录
💬 你: 切换到 /path/to/another/project
```

## 📁 项目结构

```
github-agent/
├── src/
│   ├── index.js          # 主程序入口
│   ├── agent.js          # Agent 核心逻辑
│   ├── config.js         # 配置管理
│   ├── deepseek.js       # DeepSeek AI 客户端
│   ├── github-mcp.js     # GitHub MCP 客户端
│   ├── git-commands.js   # Git 命令执行器
│   └── tools.js          # 工具定义
├── package.json          # 项目配置
├── .env                  # 环境变量配置（需创建）
├── config.example.env    # 环境变量示例
├── .gitignore
└── README.md
```

## 🔧 开发

### 技术栈

- **Node.js** - 运行时环境
- **DeepSeek AI** - AI 对话能力
- **GitHub API** - GitHub 数据访问
- **Model Context Protocol (MCP)** - 统一的 AI 工具协议
- **simple-git** - Git 命令执行
- **inquirer** - 交互式命令行界面
- **chalk** - 终端颜色输出
- **ora** - 加载动画

### 添加新功能

1. 在 `src/tools.js` 中定义新工具
2. 在 `src/agent.js` 的 `executeTool` 方法中实现工具逻辑
3. 根据需要在 `src/git-commands.js` 或 `src/github-mcp.js` 中添加底层方法

## 📝 示例对话

```
╔════════════════════════════════════════════╗
║                                            ║
║         🤖 GitHub Agent v1.0.0            ║
║                                            ║
║   基于 DeepSeek AI + GitHub MCP           ║
║                                            ║
╚════════════════════════════════════════════╝

✓ 初始化完成！开始对话吧。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 你: 查看当前仓库状态

🔧 正在执行操作...

→ 执行: git_status

当前分支: main
跟踪: origin/main

已修改的文件:
  M README.md
  M src/agent.js

🤖 Agent:
当前仓库在 main 分支上，跟踪远程 origin/main。有 2 个文件被修改：
- README.md
- src/agent.js

这些文件尚未暂存。你可以使用 "添加所有文件到暂存区" 来暂存它们。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🔧 高级配置

### 全局安装脚本详解

**`setup-global.sh`** - 全局安装脚本
- 自动给 `src/index.js` 添加执行权限
- 使用 `npm link` 创建全局命令链接
- 提供 `agent` 和 `github-agent` 两个命令别名

**`setup-config.sh`** - 全局配置脚本
- 在用户主目录创建 `~/.agent.env` 配置文件
- 一次配置，全局使用
- 可以随时编辑 `~/.agent.env` 更新配置

### 配置文件优先级

Agent 会按以下顺序查找配置文件：

1. **项目根目录的 `.env`**（用于开发）
2. **用户主目录的 `~/.agent.env`**（用于全局使用）
3. **当前目录的 `.env`**（兼容模式）

### 卸载全局安装

如果需要卸载全局命令：

```bash
cd github-agent
npm unlink
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 💡 使用技巧

1. **全局使用最方便**：推荐使用 `./setup-global.sh` 安装，可以在任何项目中使用
2. **动态切换目录**：无需重启 Agent，直接说 "切换到 xxx 目录"
3. **多步骤任务**：Agent 支持自动执行多个步骤，提出复杂的请求即可
4. **文件操作**：可以让 Agent 帮你查看和管理文件
5. **终端命令**：Agent 可以执行终端命令，危险命令会被自动拒绝
6. **清除历史**：输入 `clear` 可以清除对话历史
7. **查看帮助**：输入 `help` 查看所有可用命令

## 📄 许可证

MIT License

## 🙏 致谢

- [DeepSeek AI](https://www.deepseek.com/) - 提供强大的 AI 能力
- [GitHub](https://github.com/) - 代码托管和 API
- [Model Context Protocol](https://modelcontextprotocol.io/) - 统一的 AI 工具协议

## 📮 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**享受使用 GitHub Agent！🚀**

