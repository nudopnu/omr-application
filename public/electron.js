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
  startBackgroundProcess("predict");
  ipcMain.handle('print', (_event, url) => {
    let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true, height: 800, width: 800 });
    win.loadURL(url);

    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      margin: {
        marginType: 'printableArea',
      },
      landscape: false,
      pagesPerSheet: 1,
      collate: false,
      copies: 1,
      header: 'Page header',
      footer: 'Page footer',
    };

    win.webContents.once('did-finish-load', () => {
      win.webContents.printToPDF(printOptions).then((data) => {
        let buf = Buffer.from(data);
        let url = 'data:application/pdf;base64,' + buf.toString('base64');

        win.webContents.on('ready-to-show', () => {
          win.show();
          win.setTitle('Preview');
        });
        win.webContents.on('closed', () => win = null);
        win.loadURL(url);

      })
        .catch((error) => {
          console.log(error);
        });
    });
    return 'shown preview window';
  });
  ipcMain.handle('capture', async (_event, url, width, height) => {
    console.log(width, height);
    return new Promise((resolve, reject) => {
      let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true, maxWidth: width * 2, maxHeight: height * 2 });
      win.loadURL(url);
      win.setContentSize(width, height);
      win.webContents.once('did-finish-load', async () => {
        win.webContents.executeJavaScript("document.body.style.margin='0';");
        setTimeout(async () => {
          const nativeImage = await win.webContents.capturePage();
          resolve(nativeImage.toDataURL());
        }, 100);
      });
    });
  });
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