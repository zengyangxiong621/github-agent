# 🤖 GitHub Agent 中文文档

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
cp config.example.env .env
```

编辑 `.env` 文件：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-username
WORKSPACE_PATH=/Users/your-name/your-workspace
```

### 3. 运行程序

```bash
npm start
```

## 常见问题

### Q: 如何获取 DeepSeek API Key？

A: 
1. 访问 https://platform.deepseek.com/
2. 注册账号
3. 在控制台创建 API Key

### Q: 如何获取 GitHub Token？

A: 
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 和 `user` 权限
4. 生成并复制 token

### Q: 程序报错 "缺少 DEEPSEEK_API_KEY 环境变量"

A: 请检查 `.env` 文件是否正确配置，确保文件名为 `.env` 而不是 `config.example.env`。

### Q: 如何切换工作目录？

A: 修改 `.env` 文件中的 `WORKSPACE_PATH` 为你想要的目录路径。

## 使用技巧

### 1. 批量操作

你可以一次性描述多个操作：

```
💬 你: 查看状态，然后添加所有文件，提交消息为 "update"，最后推送
```

### 2. 查看特定仓库

```
💬 你: 查看 facebook/react 仓库的最近提交
```

### 3. 搜索功能

```
💬 你: 搜索 stars 超过 10000 的 vue 仓库
```

### 4. 清除历史

如果 AI 的回复不符合预期，可以使用 `clear` 命令清除对话历史，重新开始：

```
💬 你: clear
✓ 对话历史已清除
```

## 支持的 Git 命令

- `git status` - 查看状态
- `git log` - 查看提交历史
- `git branch` - 查看分支
- `git checkout` - 切换分支
- `git add` - 添加文件
- `git commit` - 提交更改
- `git push` - 推送
- `git pull` - 拉取
- `git diff` - 查看差异
- `git stash` - 暂存
- `git merge` - 合并

## 支持的 GitHub 功能

- 查看仓库信息
- 获取提交记录
- 查看分支列表
- 查看 Pull Requests
- 查看 Issues
- 搜索仓库
- 获取用户信息

## 更新日志

### v1.0.0 (2025-11-14)
- ✨ 初始版本发布
- ✨ 支持所有基础 Git 命令
- ✨ 支持 GitHub API 集成
- ✨ 基于 DeepSeek AI 的自然语言交互

