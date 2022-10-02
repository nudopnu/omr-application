const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require('electron');
const path = require('path');

let hiddenWindows = {};

function startBackgroundProcess(name) {

    let startResolve;

    ipcMain.handle(`START_${name.toLocaleUpperCase()}`, async () => {
        return new Promise((resolve, reject) => {
            // const preload = path.join(__dirname, `./background/highlight.js`);
            const preload = path.join(__dirname, 'highlight.js');
            hiddenWindows[name] = new BrowserWindow({
                title: 'OpenOMR',
                show: false,
                webPreferences: {
                  frame: false,
                  nodeIntegration: true,
                  enableRemoteModule: true,
                  preload: preload,
                }
              });

            var html = [
                "<script>",
                "console.log(\"This is the bockckground speeking\");",
                "window.api.test();",
                "</script>",
            ].join("");

            hiddenWindows[name].loadURL("data:text/html;charset=utf-8," + encodeURI(html));
            // hiddenWindows[name].loadURL(backgroundFileUrl);
            hiddenWindows[name].webContents.openDevTools();

            hiddenWindows[name].on('closed', () => {
                hiddenWindows[name] = null;
            });
            startResolve = resolve;
            console.log("HAS LOAD ", preload);
        });
    });

    // ipcMain.on(`${name.toLocaleUpperCase()}_READY`, () => console.log("RECEIVED READY FROM", name));
    ipcMain.on(`${name.toLocaleUpperCase()}_READY`, () => startResolve(`${name} is ready!`));
}

module.exports = { startBackgroundProcess }