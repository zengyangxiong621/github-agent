#!/bin/bash

# GitHub Agent 配置设置脚本

echo "🔧 设置 GitHub Agent 全局配置..."
echo ""

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，请先创建配置文件"
    echo ""
    echo "请运行："
    echo "  cp config.example.env .env"
    echo "  然后编辑 .env 文件填入你的 API Keys"
    echo ""
    exit 1
fi

# 复制 .env 到用户主目录作为全局配置
cp .env ~/.agent.env

echo "✅ 已创建全局配置文件: ~/.agent.env"
echo ""
echo "现在你可以在任何目录使用 'agent' 命令了！"
echo ""
echo "配置文件位置："
echo "  ~/.agent.env"
echo ""
echo "如需修改配置，请编辑："
echo "  vim ~/.agent.env"
echo ""

