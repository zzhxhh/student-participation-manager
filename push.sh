#!/bin/bash

echo "🚀 准备推送到 GitHub..."
echo "📁 当前目录: $(pwd)"
echo "🔗 远程仓库: $(git remote get-url origin)"

echo ""
echo "📋 当前状态:"
git status

echo ""
echo "🔄 开始推送..."
echo "⚠️  如果提示输入凭据："
echo "   用户名: zzhxhh"
echo "   密码: 使用您的 GitHub Personal Access Token"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo "🌐 查看您的仓库: https://github.com/zzhxhh/student-participation-manager"
    echo "⚡ GitHub Actions 将自动开始构建..."
else
    echo ""
    echo "❌ 推送失败"
    echo "💡 请检查网络连接和 GitHub 凭据"
fi
