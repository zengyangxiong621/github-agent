#!/bin/bash

# GitHub Agent 全局安装脚本

echo "🚀 正在设置 GitHub Agent 为全局命令..."
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 github-agent 项目根目录运行此脚本"
    exit 1
fi

# 给 index.js 添加执行权限
chmod +x src/index.js
echo "✅ 已添加执行权限"

# 全局链接
npm link
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 设置完成！"
    echo ""
    echo "现在你可以在任何目录使用以下命令："
    echo "  agent              # 短命令"
    echo "  github-agent       # 完整命令"
    echo ""
    echo "示例："
    echo "  cd ~/my-frontend-project"
    echo "  agent              # 自动使用当前目录"
    echo ""
    echo "💡 提示："
    echo "  - Agent 会自动使用启动时的目录作为工作目录"
    echo "  - 你可以在运行中随时切换目录"
    echo "  - 不再需要编辑配置文件！"
    echo ""
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi

