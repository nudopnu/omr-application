const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');
const { ipcMain } = require('electron');
const { getModels, predict } = require('./python');
const { startBackgroundProcess } = require('./background');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    title: 'OpenOMR',
    webPreferences: {
      frame: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  mainWindow.webContents.openDevTools();
  ipcMain.handle('ping', () => 'poing');
  ipcMain.handle('get-models', () => getModels());
  ipcMain.handle('predict', async (_, modelname, img) => predict(modelname, img));
  startBackgroundProcess("highlight");
  startBackgroundProcess("jsontest");
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});