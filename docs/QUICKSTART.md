# 🚀 快速开始

5 分钟快速上手 GitHub Agent！

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置 API Keys

### 2.1 创建配置文件

```bash
cp config.example.env .env
```

### 2.2 获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com/
2. 注册并创建 API Key
3. 复制 Key（格式：`sk-xxxxx...`）

### 2.3 获取 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 选择 `repo` 和 `user` 权限
4. 生成并复制 Token（格式：`ghp_xxxxx...`）

### 2.4 编辑 .env 文件

```env
DEEPSEEK_API_KEY=sk-你的-deepseek-key
GITHUB_TOKEN=ghp-你的-github-token
GITHUB_OWNER=你的-github-用户名
WORKSPACE_PATH=/Users/你的用户名/你的工作目录
```

## 第三步：启动程序

```bash
npm start
```

## 第四步：开始使用

看到如下界面说明启动成功：

```
╔════════════════════════════════════════════╗
║         🤖 GitHub Agent v1.0.0            ║
╚════════════════════════════════════════════╝

✓ 初始化完成！开始对话吧。
```

## 试试这些命令

### 1️⃣ Git 操作

```
💬 你: 查看当前仓库状态
```

```
💬 你: 显示最近 5 次提交
```

### 2️⃣ GitHub 操作

```
💬 你: 查看 facebook/react 仓库的信息
```

```
💬 你: 搜索 vue 相关的仓库
```

### 3️⃣ 组合操作

```
💬 你: 添加所有文件，提交消息为 "update"，然后推送
```

## 基本命令

- `help` - 显示帮助
- `clear` - 清除对话历史
- `exit` - 退出程序

## 遇到问题？

### ❌ 配置警告

如果看到警告信息：
```
⚠️  配置警告：
   - 缺少 DEEPSEEK_API_KEY 环境变量
```

**解决方法**：检查 `.env` 文件是否存在且配置正确。

### ❌ API 调用失败

**可能原因**：
1. API Key 错误或已过期
2. 网络连接问题
3. API 额度用尽

**解决方法**：
1. 检查 API Key 是否正确
2. 测试网络连接
3. 查看 DeepSeek 控制台的使用情况

### ❌ GitHub Token 权限不足

**解决方法**：
确保 Token 具有以下权限：
- ✅ `repo`（仓库访问）
- ✅ `user`（用户信息）

## 下一步

- 📖 阅读 [完整文档](README.md)
- 📚 查看 [详细使用指南](USAGE.md)
- 🐛 [提交问题](https://github.com/your-username/github-agent/issues)

## 更多示例

### 查看本地仓库状态

```
💬 你: 查看当前仓库的状态
```

### 创建新分支

```
💬 你: 创建一个名为 feature-login 的分支
```

### 查看 GitHub 仓库

```
💬 你: 查看 vercel/next.js 仓库的最近 10 次提交
```

### 搜索仓库

```
💬 你: 搜索 react component library
```

---

**开始你的 AI Git 助手之旅！✨**

有问题？运行 `help` 命令查看更多信息。

