# ⚡ 快速设置指南

## 问题：全局使用时找不到配置

当你运行 `agent` 命令时，如果看到：
```
⚠️  配置警告：
   - 缺少 DEEPSEEK_API_KEY 环境变量
   - 缺少 GITHUB_TOKEN 环境变量
```

这是因为全局运行时找不到 `.env` 配置文件。

## 🚀 解决方案（3分钟）

### 一键设置（推荐）

在 github-agent 目录运行：

```bash
cd /Users/yx.zeng/Desktop/workspace/github-agent
npm run setup
```

这会自动完成：
1. ✅ 设置全局命令
2. ✅ 创建全局配置文件

### 手动设置

#### 步骤 1：确保有 .env 文件

```bash
cd /Users/yx.zeng/Desktop/workspace/github-agent

# 如果没有 .env，创建它
cp config.example.env .env

# 编辑并填入你的配置
vim .env
```

确保填入：
```env
DEEPSEEK_API_KEY=sk-你的key
GITHUB_TOKEN=ghp-你的token
GITHUB_OWNER=你的用户名
```

#### 步骤 2：创建全局配置

```bash
# 复制到用户主目录
cp .env ~/.agent.env
```

#### 步骤 3：验证

```bash
# 检查配置文件
cat ~/.agent.env

# 在任何目录测试
cd ~
agent
# 应该不再有警告 ✅
```

## 📁 配置文件位置

Agent 会按以下顺序查找配置：

1. **项目目录** (开发时使用)
   ```
   /Users/yx.zeng/Desktop/workspace/github-agent/.env
   ```

2. **用户主目录** (全局使用时)
   ```
   ~/.agent.env
   ```

3. **当前目录** (兼容模式)
   ```
   ./.env
   ```

## 🔧 配置文件内容

`~/.agent.env` 应该包含：

```env
# DeepSeek AI API 配置
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# GitHub 配置
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=your-github-username

# 工作区路径（可选，默认使用当前目录）
# WORKSPACE_PATH=/path/to/workspace
```

## ✅ 验证设置

设置完成后测试：

```bash
# 测试 1：在任何目录
cd ~
agent

# 应该看到：
# ✓ 初始化完成！
# 📁 当前工作目录: ~

# 测试 2：在前端项目
cd ~/projects/my-app
agent

# 应该看到：
# ✓ 初始化完成！
# 📁 当前工作目录: ~/projects/my-app
```

## 🔄 更新配置

如果需要修改配置：

```bash
# 编辑全局配置
vim ~/.agent.env

# 或使用你喜欢的编辑器
code ~/.agent.env
nano ~/.agent.env
```

修改后，重启 `agent` 即可生效。

## 🆘 常见问题

### Q1: 我改了 github-agent/.env 但没生效？

A: 如果已经创建了 `~/.agent.env`，需要更新它：
```bash
cd /Users/yx.zeng/Desktop/workspace/github-agent
cp .env ~/.agent.env
```

### Q2: 如何查看当前使用的配置？

A: 检查文件：
```bash
cat ~/.agent.env
```

### Q3: 我想在不同项目用不同的 GitHub Token？

A: 在项目目录创建 `.env` 文件，它会优先使用：
```bash
cd ~/my-special-project
echo "GITHUB_TOKEN=ghp_special_token" > .env
agent  # 会使用这个项目的配置
```

### Q4: 删除全局配置

```bash
rm ~/.agent.env
```

## 🎯 推荐工作流

### 开发 github-agent 本身

```bash
cd /Users/yx.zeng/Desktop/workspace/github-agent
npm start  # 使用项目目录的 .env
```

### 在其他项目中使用

```bash
cd ~/projects/any-project
agent  # 使用 ~/.agent.env
```

### 特殊项目需要不同配置

```bash
cd ~/projects/special-project
echo "GITHUB_TOKEN=special_token" > .env
agent  # 使用项目的 .env
```

## 📊 配置优先级

```
项目目录 .env
    ↓ (找不到)
~/.agent.env
    ↓ (找不到)
当前目录 .env
    ↓ (找不到)
❌ 警告：缺少配置
```

## 🎉 完成检查清单

- [ ] 已创建 `/Users/yx.zeng/Desktop/workspace/github-agent/.env`
- [ ] 已填写 DEEPSEEK_API_KEY
- [ ] 已填写 GITHUB_TOKEN
- [ ] 已创建 `~/.agent.env`
- [ ] 在任何目录运行 `agent` 无警告

全部完成？恭喜！🎊 现在可以在任何项目中愉快使用 Agent 了！

