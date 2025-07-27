#!/bin/bash

echo "🚀 学生参与管理器 - 环境设置脚本"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js (推荐版本 16 或更高)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    echo "请确保 npm 已正确安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 项目构建成功"
else
    echo "❌ 项目构建失败"
    exit 1
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "📖 使用说明:"
echo "1. 开发模式: npm run electron-dev"
echo "2. 生成可执行文件: npm run dist"
echo "3. 仅生成 Windows 版本: npm run dist-win"
echo "4. 仅生成 macOS 版本: npm run dist-mac"
echo ""
