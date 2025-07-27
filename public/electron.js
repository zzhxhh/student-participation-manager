const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

let mainWindow;

// 数据文件路径
const dataPath = path.join(app.getPath('userData'), 'student-data.json');

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'), // 应用图标
    show: false
  });

  // 加载应用
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 当窗口关闭时
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 开发模式下打开开发者工具
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// 创建菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '导出数据',
          click: () => {
            exportData();
          }
        },
        {
          label: '导入数据',
          click: () => {
            importData();
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '实际大小' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于学生参与管理器',
              message: '学生参与管理器 v1.0.0',
              detail: '一个帮助教师管理在线课堂学生参与的桌面应用程序。'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 处理程序
ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return { students: [], participationHistory: [] };
  } catch (error) {
    console.error('加载数据失败:', error);
    return { students: [], participationHistory: [] };
  }
});

ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('保存数据失败:', error);
    return { success: false, error: error.message };
  }
});

// 导出数据
async function exportData() {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: '导出学生数据',
      defaultPath: 'student-data-export.json',
      filters: [
        { name: 'JSON 文件', extensions: ['json'] }
      ]
    });

    if (!result.canceled) {
      const data = fs.readFileSync(dataPath, 'utf8');
      fs.writeFileSync(result.filePath, data);
      
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '导出成功',
        message: '数据已成功导出！'
      });
    }
  } catch (error) {
    dialog.showErrorBox('导出失败', error.message);
  }
}

// 导入数据
async function importData() {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: '导入学生数据',
      filters: [
        { name: 'JSON 文件', extensions: ['json'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const importedData = fs.readFileSync(result.filePaths[0], 'utf8');
      JSON.parse(importedData); // 验证 JSON 格式
      
      fs.writeFileSync(dataPath, importedData);
      
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '导入成功',
        message: '数据已成功导入！请重启应用以查看更改。'
      });
    }
  } catch (error) {
    dialog.showErrorBox('导入失败', '文件格式不正确或读取失败：' + error.message);
  }
}
