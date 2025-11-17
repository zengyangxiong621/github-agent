# ✅ 安装和运行检查清单

使用此清单确保 GitHub Agent 正确安装和配置。

## 📋 安装前检查

### 系统要求
- [ ] Node.js 版本 >= 18.0.0
  ```bash
  node --version
  ```
- [ ] npm 或 yarn 已安装
  ```bash
  npm --version
  ```
- [ ] Git 已安装
  ```bash
  git --version
  ```

### 账号准备
- [ ] 已有 DeepSeek 账号（或准备注册）
- [ ] 已有 GitHub 账号

## 📦 安装步骤检查

### 1. 克隆或下载项目
- [ ] 项目文件已下载到本地
- [ ] 进入项目目录
  ```bash
  cd github-agent
  ```

### 2. 安装依赖
- [ ] 运行 `npm install`
- [ ] 依赖安装成功，无错误信息
- [ ] `node_modules` 目录已创建

### 3. 配置环境变量
- [ ] 复制配置文件
  ```bash
  cp config.example.env .env
  ```
- [ ] `.env` 文件已创建

### 4. 获取 API Keys

#### DeepSeek API Key
- [ ] 已访问 https://platform.deepseek.com/
- [ ] 已注册/登录账号
- [ ] 已创建 API Key
- [ ] 已复制 API Key（格式：`sk-xxxxx...`）
- [ ] 已填入 `.env` 文件的 `DEEPSEEK_API_KEY`

#### GitHub Token
- [ ] 已访问 https://github.com/settings/tokens
- [ ] 已创建 Personal Access Token (classic)
- [ ] 已选择 `repo` 权限
- [ ] 已选择 `user` 权限
- [ ] 已复制 Token（格式：`ghp_xxxxx...`）
- [ ] 已填入 `.env` 文件的 `GITHUB_TOKEN`

#### 其他配置
- [ ] 已填写 `GITHUB_OWNER`（你的 GitHub 用户名）
- [ ] 已填写 `WORKSPACE_PATH`（或留空使用当前目录）

### 5. 验证配置文件

检查你的 `.env` 文件应该类似：
```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
WORKSPACE_PATH=/Users/your-name/your-workspace
```

- [ ] 所有必需字段已填写
- [ ] 没有多余的空格
- [ ] 没有引号（直接填写值）

## 🚀 运行检查

### 1. 首次启动
- [ ] 运行 `npm start`
- [ ] 看到欢迎界面
  ```
  ╔════════════════════════════════════════════╗
  ║         🤖 GitHub Agent v1.0.0            ║
  ╚════════════════════════════════════════════╝
  ```
- [ ] 看到初始化成功消息
  ```
  ✓ GitHub MCP 客户端初始化成功
  ✓ 初始化完成！开始对话吧。
  ```

### 2. 基本功能测试

#### 测试 Git 功能
- [ ] 输入：`查看当前仓库状态`
  - 应该显示当前目录的 Git 状态
- [ ] 输入：`显示最近 5 次提交`
  - 应该显示提交历史
- [ ] 输入：`查看所有分支`
  - 应该列出所有分支

#### 测试 GitHub 功能
- [ ] 输入：`查看 facebook/react 仓库的信息`
  - 应该显示仓库详情（stars, forks 等）
- [ ] 输入：`搜索 vue 相关的仓库`
  - 应该显示搜索结果

#### 测试特殊命令
- [ ] 输入：`help`
  - 应该显示帮助信息
- [ ] 输入：`clear`
  - 应该显示 "对话历史已清除"
- [ ] 输入：`exit`
  - 应该退出程序

## 🔧 故障排除

### 问题 1: 安装依赖失败

**症状**: `npm install` 报错

**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题 2: 配置警告

**症状**: 启动时看到
```
⚠️  配置警告：
   - 缺少 DEEPSEEK_API_KEY 环境变量
```

**检查项**:
- [ ] `.env` 文件是否存在？
- [ ] `.env` 文件是否在项目根目录？
- [ ] 变量名是否正确（注意大小写）？
- [ ] 值是否正确填写（没有多余空格）？

**解决方案**:
```bash
# 确认 .env 文件存在
ls -la .env

# 查看内容
cat .env

# 如果不存在，重新创建
cp config.example.env .env
# 然后编辑填入正确的值
```

### 问题 3: API 调用失败

**症状**: 
```
✗ DeepSeek AI 调用失败: ...
```

**检查项**:
- [ ] API Key 是否正确？
- [ ] 是否有网络连接？
- [ ] DeepSeek API 额度是否用尽？
- [ ] API URL 是否正确？

**解决方案**:
1. 重新检查 API Key
2. 测试网络连接：`ping api.deepseek.com`
3. 访问 DeepSeek 控制台查看使用情况
4. 如果是新账号，可能需要充值

### 问题 4: GitHub Token 权限不足

**症状**:
```
✗ 获取仓库信息失败: ...
```

**检查项**:
- [ ] Token 是否正确？
- [ ] Token 是否过期？
- [ ] Token 权限是否足够？

**解决方案**:
1. 访问 https://github.com/settings/tokens
2. 检查 Token 状态
3. 确保选择了以下权限：
   - ✅ `repo`
   - ✅ `user`
4. 如果需要，重新生成 Token

### 问题 5: Git 命令执行失败

**症状**:
```
✗ 错误: not a git repository
```

**检查项**:
- [ ] 当前目录是否是 Git 仓库？
- [ ] `WORKSPACE_PATH` 配置是否正确？

**解决方案**:
1. 确保在 Git 仓库目录中运行
2. 或者修改 `.env` 中的 `WORKSPACE_PATH` 指向正确的 Git 仓库
3. 或者初始化 Git 仓库：`git init`

### 问题 6: 端口或进程占用

**症状**: 程序无法启动或行为异常

**解决方案**:
```bash
# 查找并结束旧进程
ps aux | grep node
kill -9 <进程ID>

# 重新启动
npm start
```

### 问题 7: Node.js 版本过低

**症状**: 
```
SyntaxError: Unexpected token ...
```

**解决方案**:
```bash
# 检查版本
node --version

# 如果版本 < 18，需要升级
# 使用 nvm (推荐)
nvm install 18
nvm use 18

# 或访问 https://nodejs.org/ 下载最新版本
```

## 📊 健康检查脚本

创建一个简单的检查脚本 `health-check.sh`：

```bash
#!/bin/bash

echo "🔍 GitHub Agent 健康检查"
echo "========================"

# 检查 Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    node --version
else
    echo "❌ 未安装"
fi

# 检查 npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    npm --version
else
    echo "❌ 未安装"
fi

# 检查 Git
echo -n "Git: "
if command -v git &> /dev/null; then
    git --version
else
    echo "❌ 未安装"
fi

# 检查 .env 文件
echo -n ".env 文件: "
if [ -f .env ]; then
    echo "✅ 存在"
else
    echo "❌ 不存在"
fi

# 检查 node_modules
echo -n "依赖安装: "
if [ -d node_modules ]; then
    echo "✅ 已安装"
else
    echo "❌ 未安装"
fi

echo ""
echo "检查完成！"
```

运行：
```bash
chmod +x health-check.sh
./health-check.sh
```

## 🎯 成功标准

如果以下所有项都打勾，说明安装成功：

- [ ] ✅ 程序能正常启动
- [ ] ✅ 没有配置警告
- [ ] ✅ Git 命令能正常执行
- [ ] ✅ GitHub API 能正常调用
- [ ] ✅ AI 能正确理解并执行命令
- [ ] ✅ 输出格式美观且信息准确

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. 📖 查看 [USAGE.md](USAGE.md) 详细文档
2. 🐛 在 GitHub 上提交 Issue
3. 💬 包含以下信息：
   - 操作系统版本
   - Node.js 版本
   - 错误信息截图
   - `.env` 文件内容（隐藏敏感信息）

---

**祝你顺利完成安装！🎉**

