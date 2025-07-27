# 🚀 GitHub 自动构建安装包指南

## 📋 准备工作

### 1. 创建 GitHub 账号
- 访问 [github.com](https://github.com) 注册账号（免费）
- 验证邮箱

### 2. 创建新仓库
- 点击右上角 "+" → "New repository"
- 仓库名称：`student-participation-manager`
- 设置为 Public（公开）
- 点击 "Create repository"

## 📤 上传代码到 GitHub

### 方法一：使用 GitHub 网页界面（推荐）

1. **打包项目文件**
   ```bash
   # 在项目目录下创建压缩包
   cd /Users/zzh/Desktop/class
   zip -r student-participation-manager.zip . -x "node_modules/*" "dist/*" "build/*"
   ```

2. **上传到 GitHub**
   - 在您的 GitHub 仓库页面
   - 点击 "uploading an existing file"
   - 拖拽 `student-participation-manager.zip` 文件
   - 或者逐个上传所有文件（除了 node_modules, dist, build 文件夹）

### 方法二：使用 Git 命令行

```bash
cd /Users/zzh/Desktop/class

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "初始提交：学生参与管理器"

# 连接到 GitHub 仓库（替换为您的用户名）
git remote add origin https://github.com/您的用户名/student-participation-manager.git

# 推送代码
git branch -M main
git push -u origin main
```

## 🔧 触发自动构建

### 自动触发
- 代码上传后，GitHub Actions 会自动开始构建
- 大约 10-15 分钟后完成

### 手动触发
1. 进入您的 GitHub 仓库
2. 点击 "Actions" 标签页
3. 选择 "Build and Release" 工作流
4. 点击 "Run workflow" → "Run workflow"

## 📦 下载安装包

### 构建完成后：

1. **查看构建状态**
   - 仓库页面 → "Actions" 标签页
   - 绿色 ✅ 表示构建成功

2. **下载方式一：从 Releases**
   - 仓库页面 → "Releases" 标签页
   - 下载最新版本的 `.dmg` 文件

3. **下载方式二：从 Artifacts**
   - "Actions" → 点击最新的构建
   - 下载 "macos-installer" 文件

## 🍎 macOS 安装步骤

1. **下载 .dmg 文件**
   - 文件名类似：`学生参与管理器-macOS.dmg`

2. **安装应用**
   ```bash
   # 双击 .dmg 文件
   # 拖拽应用图标到"应用程序"文件夹
   # 弹出磁盘映像
   ```

3. **首次运行**
   ```bash
   # 如果出现安全警告：
   # 系统偏好设置 → 安全性与隐私 → 通用 → "仍要打开"
   ```

## ⚡ 快速操作指南

### 最快方式（5分钟搞定）：

1. **创建 GitHub 仓库**（2分钟）
2. **上传项目文件**（2分钟）
3. **等待自动构建**（10-15分钟，您可以去做其他事）
4. **下载 .dmg 文件**（1分钟）

### 文件上传清单：
```
✅ package.json
✅ public/ 文件夹（包含所有文件）
✅ src/ 文件夹（包含所有文件）
✅ scripts/ 文件夹
✅ .github/ 文件夹（重要！包含构建配置）
✅ README.md
✅ 其他 .md 文件
❌ node_modules/ （不要上传）
❌ dist/ （不要上传）
❌ build/ （不要上传）
```

## 🔍 故障排除

### 构建失败怎么办？
1. 检查 "Actions" 页面的错误日志
2. 确保所有必要文件都已上传
3. 检查 package.json 中的脚本配置

### 下载的文件无法运行？
1. 确保下载的是 .dmg 文件
2. 检查文件是否完整下载
3. 按照 macOS 安全设置步骤操作

## 🎉 完成！

按照这个指南，您将获得：
- ✅ 专业的 macOS 安装包（.dmg）
- ✅ Windows 安装包（.exe）
- ✅ 自动化的构建流程
- ✅ 无需本地安装任何开发环境

**预计总时间：5分钟操作 + 15分钟等待 = 20分钟获得安装包**

---

有任何问题，请参考仓库中的其他文档或提交 Issue。
