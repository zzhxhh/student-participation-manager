@echo off
chcp 65001 >nul
echo 🚀 学生参与管理器 - 环境设置脚本
echo ==================================

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js
    echo 请先安装 Node.js ^(推荐版本 16 或更高^)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm
    echo 请确保 npm 已正确安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%

REM 安装依赖
echo.
echo 📦 安装项目依赖...
call npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装成功

REM 构建项目
echo.
echo 🔨 构建项目...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ 项目构建失败
    pause
    exit /b 1
)

echo ✅ 项目构建成功

echo.
echo 🎉 设置完成！
echo.
echo 📖 使用说明:
echo 1. 开发模式: npm run electron-dev
echo 2. 生成可执行文件: npm run dist
echo 3. 仅生成 Windows 版本: npm run dist-win
echo 4. 仅生成 macOS 版本: npm run dist-mac
echo.
pause
