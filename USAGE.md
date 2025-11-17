# 使用指南

## 安装和配置

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 获取 API Keys

#### DeepSeek API Key

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册并登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 API Key（格式：`sk-xxxxxxxxxxxxxxxx`）

#### GitHub Personal Access Token

1. 登录 GitHub
2. 访问 [Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
3. 点击 "Generate new token (classic)"
4. 设置 token 名称和过期时间
5. 选择以下权限：
   - ✅ `repo` - 完整的仓库访问权限
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
   - ✅ `user` - 读取用户信息
     - read:user
     - user:email
6. 点击 "Generate token"
7. 复制生成的 token（格式：`ghp_xxxxxxxxxxxxxxxx`）

⚠️ **重要**: Token 只会显示一次，请立即保存到安全的地方！

### 步骤 3: 配置环境变量

1. 复制示例配置文件：
```bash
cp config.example.env .env
```

2. 编辑 `.env` 文件：
```env
# DeepSeek AI API 配置
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# GitHub 配置
GITHUB_TOKEN=ghp-your-actual-token-here
GITHUB_OWNER=your-github-username

# 工作区路径（可选，默认为当前目录）
WORKSPACE_PATH=/Users/your-name/your-workspace
```

### 步骤 4: 验证配置

运行程序，如果配置正确，应该看到：

```
✓ GitHub MCP 客户端初始化成功
✓ 初始化完成！开始对话吧。
```

如果看到警告信息，请检查你的 `.env` 文件配置。

## 基本使用

### 启动程序

```bash
npm start
```

### 交互命令

程序启动后，你可以输入以下命令：

- `exit` / `quit` / `q` - 退出程序
- `clear` - 清除对话历史
- `help` / `h` - 显示帮助信息

### 自然语言交互

你可以用自然语言描述你想做的事情，AI 会理解并执行相应的操作。

## 详细示例

### Git 操作示例

#### 1. 查看仓库状态

```
💬 你: 查看当前仓库状态
💬 你: git status
💬 你: 显示仓库状态
```

#### 2. 查看提交历史

```
💬 你: 显示最近 10 次提交
💬 你: 查看提交历史
💬 你: git log
💬 你: 显示最近 5 次提交记录
```

#### 3. 分支操作

```
💬 你: 查看所有分支
💬 你: 切换到 main 分支
💬 你: 创建一个名为 feature-login 的分支
💬 你: 创建并切换到 develop 分支
```

#### 4. 提交代码

```
💬 你: 添加所有文件到暂存区
💬 你: 添加 src/index.js 到暂存区
💬 你: 提交更改，消息为 "add new feature"
💬 你: 提交所有更改，消息为 "fix: resolve login bug"
```

#### 5. 推送和拉取

```
💬 你: 推送到远程仓库
💬 你: 推送到 origin main
💬 你: 从远程仓库拉取最新代码
💬 你: pull from origin
```

#### 6. 查看差异

```
💬 你: 查看文件差异
💬 你: 显示未提交的更改
💬 你: git diff
```

#### 7. 暂存操作

```
💬 你: 暂存当前更改
💬 你: 应用暂存的更改
💬 你: git stash
💬 你: git stash pop
```

### GitHub 操作示例

#### 1. 查看仓库信息

```
💬 你: 查看 github-agent 仓库的信息
💬 你: 获取 facebook/react 仓库的详细信息
💬 你: 显示 vercel/next.js 仓库的 stars 数量
```

#### 2. 查看提交记录

```
💬 你: 查看 github-agent 仓库的最近提交
💬 你: 显示 facebook/react 的最近 20 次提交
💬 你: 获取 vue/core 仓库的提交历史
```

#### 3. 查看分支

```
💬 你: 查看 github-agent 仓库的所有分支
💬 你: 显示 facebook/react 的分支列表
```

#### 4. 查看 Pull Requests

```
💬 你: 查看 github-agent 仓库的 open PR
💬 你: 显示 facebook/react 的所有 PR
💬 你: 获取 vue/core 的已关闭 PR
```

#### 5. 查看 Issues

```
💬 你: 查看 github-agent 仓库的 open issues
💬 你: 显示 facebook/react 的所有 issues
💬 你: 获取 vue/core 的已关闭 issues
```

#### 6. 搜索仓库

```
💬 你: 搜索 react 相关的仓库
💬 你: 查找 vue 相关的项目
💬 你: 搜索 node.js web framework
```

#### 7. 查看用户信息

```
💬 你: 获取我的 GitHub 信息
💬 你: 查看 torvalds 的用户信息
💬 你: 显示 facebook 的 GitHub 资料
```

### 组合操作示例

你可以一次性描述多个操作：

```
💬 你: 查看状态，然后添加所有文件，提交消息为 "update code"，最后推送到远程
💬 你: 切换到 main 分支，拉取最新代码，然后创建一个新分支 feature-new
💬 你: 查看 facebook/react 的最近提交和 open 的 PR
```

## 高级技巧

### 1. 使用完整的仓库路径

对于 GitHub 操作，你可以使用 `owner/repo` 格式：

```
💬 你: 查看 facebook/react 仓库
```

或者只使用仓库名（会使用配置中的 GITHUB_OWNER）：

```
💬 你: 查看 github-agent 仓库
```

### 2. 指定参数

你可以在描述中包含具体的参数：

```
💬 你: 显示最近 20 次提交
💬 你: 查看 facebook/react 的 closed 状态的 PR
```

### 3. 清除对话历史

如果 AI 的回复不符合预期，可以清除历史重新开始：

```
💬 你: clear
✓ 对话历史已清除
```

### 4. 查看帮助

随时可以查看帮助信息：

```
💬 你: help
```

## 常见问题

### Q: 为什么我的命令没有执行？

A: 请确保：
1. `.env` 文件配置正确
2. API Keys 有效且未过期
3. 网络连接正常
4. 对于 GitHub 操作，确保仓库名称正确

### Q: 如何查看当前工作目录？

A: Agent 会使用 `.env` 中配置的 `WORKSPACE_PATH`，如果没有配置，则使用程序启动时的目录。

### Q: 可以同时操作多个仓库吗？

A: 当前版本只支持在一个工作目录中操作。如果需要切换仓库，请修改 `WORKSPACE_PATH` 并重启程序。

### Q: AI 理解错了我的意图怎么办？

A: 你可以：
1. 使用更具体的描述
2. 使用 `clear` 清除历史
3. 直接使用 Git 命令格式（如 "git status"）

### Q: 如何退出程序？

A: 输入 `exit`、`quit` 或 `q`，或按 `Ctrl+C`。

## 安全建议

1. ⚠️ **不要** 将 `.env` 文件提交到 Git
2. ⚠️ **不要** 分享你的 API Keys 和 Tokens
3. ⚠️ GitHub Token 应该设置合理的过期时间
4. ⚠️ 定期检查和更新 Token 权限
5. ⚠️ 如果 Token 泄露，立即在 GitHub 上撤销

## 性能优化

1. 对于大型仓库，建议限制提交记录数量：
   ```
   💬 你: 显示最近 5 次提交
   ```

2. 如果 API 调用较慢，可以：
   - 检查网络连接
   - 确认 API 额度未超限
   - 尝试使用 DeepSeek 的其他节点

## 更多资源

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [Git 文档](https://git-scm.com/doc)
- [项目 GitHub 仓库](https://github.com/your-username/github-agent)

## 反馈和支持

如果遇到问题或有建议，请：
1. 查看本文档的常见问题部分
2. 在 GitHub 上提交 Issue
3. 联系项目维护者

---

**祝使用愉快！🚀**

