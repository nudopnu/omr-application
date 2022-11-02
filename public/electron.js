const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const fs = require("fs");
const path = require('path');
const isDev = require('electron-is-dev');
const { ipcMain, shell } = require('electron');
const { getModels, predict } = require('./python');
const { startBackgroundProcess } = require('./background');
const { spawn } = require('child_process');

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
  ipcMain.handle('print', (_event, url, show) => {
    return new Promise((resolve, reject) => {

      let win = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true, height: 800, width: 800 });
      win.loadURL(url);

      const printOptions = {
        silent: false,
        printBackground: true,
        color: true,
        marginsType: 1,
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: 'Page header',
        footer: 'Page footer',
        pageSize: 'A4',
      };

      win.webContents.once('did-finish-load', async () => {
        await win.webContents.executeJavaScript("document.body.style.margin='0';");
        win.webContents.printToPDF(printOptions).then((data) => {
          let buf = Buffer.from(data);
          let url = 'data:application/pdf;base64,' + buf.toString('base64');
          console.log(url);

          if (show) {
            win.webContents.on('ready-to-show', () => {
              win.show();
              win.setTitle('Preview');
              resolve('shown preview window')
            });
            win.webContents.on('closed', () => win = null);
            win.loadURL(url);
          } else {
            resolve(url);
          }

        })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  });
  ipcMain.handle('pdf2png', (_event, url, dpi) => {
    return new Promise(async (resolve, reject) => {
      await fs.writeFile("tmp.pdf", url.split(",")[1], 'base64', err => { console.log(err); })

      console.log("PDF written");

      const magick = spawn('magick', ['+antialias', '-define png:color-type=6', `-density ${dpi}`, '"tmp.pdf"', 'C:/Users/peter/Downloads/out.png'], { shell: true });
      let magickRes = "";

      magick.stdout.on('data', (data) => {
        magickRes += data.toString();
      });

      magick.stderr.on('data', (data) => {
        console.error(`magick stderr: ${data}`);
        reject(data);
      });

      magick.on('close', (code) => {
        const res = Buffer.from(magickRes).toString('base64');
        // console.log("b64:", res.slice(0, 10) + "..." + res.slice(-10));
        // console.log("b64:", res);
        resolve(res);
      });

    });
  })
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