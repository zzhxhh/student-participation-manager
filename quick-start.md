# 🚀 快速启动指南

## 立即开始使用

### 1. 环境准备
确保您的系统已安装：
- **Node.js 16+** ([下载地址](https://nodejs.org/))
- **npm** (随 Node.js 自动安装)

### 2. 一键设置

**Windows 用户:**
```cmd
# 在项目根目录运行
scripts\setup.bat
```

**macOS/Linux 用户:**
```bash
# 在项目根目录运行
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. 启动应用

**开发模式 (推荐用于测试):**
```bash
npm run electron-dev
```

**生产模式 (生成可执行文件):**
```bash
npm run dist
```

## 📁 项目结构一览

```
student-participation-manager/
├── 📄 README.md              # 详细说明文档
├── 📄 INSTALL.md             # 安装指南
├── 📄 USER_GUIDE.md          # 用户使用指南
├── 📄 package.json           # 项目配置
├── 📁 public/                # 静态资源
│   ├── electron.js           # Electron 主进程
│   ├── preload.js            # 预加载脚本
│   └── index.html            # HTML 模板
├── 📁 src/                   # React 源码
│   ├── 📁 components/        # React 组件
│   │   ├── StudentManager.js    # 学生管理
│   │   ├── RandomSelector.js    # 随机选择
│   │   ├── ParticipationTracker.js # 参与追踪
│   │   └── Statistics.js        # 统计报告
│   ├── App.js                # 主应用组件
│   ├── App.css               # 应用样式
│   ├── index.js              # 入口文件
│   └── index.css             # 全局样式
├── 📁 scripts/               # 构建脚本
│   ├── setup.sh              # Linux/macOS 设置脚本
│   └── setup.bat             # Windows 设置脚本
└── 📁 build-scripts/         # 构建工具
    └── build.js              # 构建脚本
```

## ⚡ 常用命令

```bash
# 安装依赖
npm install

# 启动 React 开发服务器
npm start

# 构建 React 应用
npm run build

# 启动 Electron (需要先构建)
npm run electron

# 开发模式 (React + Electron)
npm run electron-dev

# 打包所有平台
npm run dist

# 仅打包 Windows
npm run dist-win

# 仅打包 macOS
npm run dist-mac
```

## 🎯 核心功能

### ✅ 已实现功能
- [x] 学生信息管理 (增删改查)
- [x] 随机选择学生
- [x] 参与记录追踪
- [x] 统计分析报告
- [x] 数据持久化存储
- [x] 数据导入导出
- [x] 跨平台支持
- [x] 直观的用户界面

### 🔧 技术特性
- [x] Electron + React 架构
- [x] 本地数据存储
- [x] 响应式设计
- [x] 实时数据更新
- [x] 自动保存功能
- [x] 错误处理机制

## 📊 使用流程

1. **添加学生** → 左侧面板添加学生信息
2. **随机选择** → 点击随机选择按钮
3. **记录回答** → 选择回答类型并添加备注
4. **查看统计** → 切换到统计报告查看数据分析
5. **导出数据** → 菜单栏导出数据进行备份

## 🆘 遇到问题？

1. **查看文档**: [README.md](README.md) | [USER_GUIDE.md](USER_GUIDE.md)
2. **安装问题**: [INSTALL.md](INSTALL.md)
3. **提交 Issue**: 在项目页面提交问题报告

## 🎓 开始使用

现在您可以：
1. 运行 `npm run electron-dev` 启动应用
2. 添加一些学生信息
3. 开始使用随机选择功能
4. 探索统计分析功能

**祝您使用愉快！** 🎉
