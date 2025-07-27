# 安装指南

## 📋 系统要求

### Windows
- **操作系统**: Windows 10 或更高版本
- **架构**: x64 (64位)
- **内存**: 至少 4GB RAM
- **存储**: 至少 200MB 可用空间
- **其他**: 需要管理员权限进行安装

### macOS
- **操作系统**: macOS 10.14 (Mojave) 或更高版本
- **架构**: Intel x64 或 Apple Silicon (M1/M2)
- **内存**: 至少 4GB RAM
- **存储**: 至少 200MB 可用空间
- **其他**: 可能需要在安全性设置中允许应用运行

## 🚀 安装方法

### 方法一：预编译安装包（推荐）

#### Windows 安装

1. **下载安装包**
   - 访问项目的 Releases 页面
   - 下载 `student-participation-manager-setup-x.x.x.exe`

2. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 如果出现安全警告，点击"更多信息" → "仍要运行"
   - 按照安装向导完成安装

3. **启动应用**
   - 从桌面快捷方式启动
   - 或从开始菜单搜索"学生参与管理器"

#### macOS 安装

1. **下载安装包**
   - 访问项目的 Releases 页面
   - 下载 `student-participation-manager-x.x.x.dmg`

2. **安装应用**
   - 双击下载的 `.dmg` 文件
   - 将应用图标拖拽到"应用程序"文件夹
   - 弹出磁盘映像

3. **首次运行**
   - 从启动台或应用程序文件夹打开应用
   - 如果出现安全警告：
     - 系统偏好设置 → 安全性与隐私 → 通用
     - 点击"仍要打开"按钮

### 方法二：从源码构建

#### 前置要求

**必需软件:**
- [Node.js](https://nodejs.org/) 16.0 或更高版本
- npm (随 Node.js 自动安装) 或 [Yarn](https://yarnpkg.com/)
- Git (可选，用于克隆代码)

**验证安装:**
```bash
node --version    # 应显示 v16.0.0 或更高
npm --version     # 应显示版本号
```

#### 构建步骤

1. **获取源码**
   ```bash
   # 方法1: 使用 Git 克隆
   git clone <repository-url>
   cd student-participation-manager
   
   # 方法2: 下载 ZIP 文件并解压
   # 从项目页面下载源码 ZIP 文件
   # 解压到本地文件夹
   ```

2. **自动构建（推荐）**
   
   **Windows:**
   ```cmd
   # 在项目根目录运行
   scripts\setup.bat
   ```
   
   **macOS/Linux:**
   ```bash
   # 在项目根目录运行
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **手动构建**
   ```bash
   # 安装依赖
   npm install
   
   # 构建 React 应用
   npm run build
   
   # 生成可执行文件
   npm run dist
   ```

4. **查找安装包**
   - 构建完成后，在 `dist` 文件夹中找到对应平台的安装包
   - Windows: `.exe` 文件
   - macOS: `.dmg` 文件

## 🔧 开发环境设置

如果您想参与开发或自定义应用，请按以下步骤设置开发环境：

### 1. 安装开发依赖
```bash
npm install
```

### 2. 启动开发模式
```bash
# 同时启动 React 开发服务器和 Electron
npm run electron-dev
```

### 3. 开发工具
- React 开发服务器: http://localhost:3000
- Electron 开发者工具: 在应用中按 F12 或 Ctrl+Shift+I

### 4. 构建测试
```bash
# 仅构建 React 应用
npm run build

# 测试 Electron 应用
npm run electron

# 生成安装包
npm run dist
```

## 🛠️ 故障排除

### 安装问题

**Windows 安装失败**
- 确保以管理员身份运行安装程序
- 临时关闭防病毒软件
- 检查 Windows Defender 是否阻止了安装

**macOS 无法打开应用**
- 系统偏好设置 → 安全性与隐私 → 通用
- 允许从"任何来源"下载的应用
- 或者在应用上右键 → 打开

**构建失败**
- 确保 Node.js 版本 >= 16.0
- 删除 `node_modules` 文件夹后重新运行 `npm install`
- 检查网络连接，可能需要配置 npm 镜像源

### 运行时问题

**应用无法启动**
- 检查系统是否满足最低要求
- 尝试重新安装应用
- 查看系统事件日志获取错误信息

**数据无法保存**
- 确保应用有写入权限
- 检查磁盘空间是否充足
- Windows: 检查 `%APPDATA%` 文件夹权限
- macOS: 检查 `~/Library/Application Support` 文件夹权限

### 网络和权限

**防火墙设置**
- 应用可能需要网络权限进行更新检查
- 在防火墙中允许应用通过

**文件权限**
- 确保应用安装目录有读取权限
- 确保用户数据目录有写入权限

## 📞 获取帮助

如果安装过程中遇到问题：

1. **查看日志**
   - Windows: 查看事件查看器
   - macOS: 查看控制台应用

2. **常见解决方案**
   - 重启计算机后重试
   - 以管理员/root 权限运行
   - 检查系统更新

3. **联系支持**
   - 提交 Issue 并附上详细错误信息
   - 包含操作系统版本和错误截图
   - 描述具体的操作步骤

## 🔄 更新和卸载

### 更新应用
- 应用会自动检查更新（如果启用）
- 手动更新：下载新版本安装包并安装

### 卸载应用

**Windows:**
- 控制面板 → 程序和功能 → 卸载"学生参与管理器"
- 或使用安装目录中的卸载程序

**macOS:**
- 将应用从"应用程序"文件夹拖到废纸篓
- 清理用户数据：删除 `~/Library/Application Support/student-participation-manager`

---

安装完成后，请参考 [README.md](README.md) 了解详细的使用方法。
