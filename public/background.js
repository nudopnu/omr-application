const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require('electron');
const { ipcRenderer } = require('electron/renderer');
const path = require('path');


function startBackgroundProcess(name) {
    let hiddenWindows = {};

    const START_FROMP_RELOAD = `START_${name.toLocaleUpperCase()}`;
    const MSG_FROM_PRELOAD = `MSG_SEND_TO_${name.toLocaleUpperCase()}`;
    const READY_FROM_SUBPROCESS = `${name.toLocaleUpperCase()}_READY`;
    const RESPONSE_FROM_SUBPROCESS = `${name.toLocaleUpperCase()}_RESPONSE`;
    const ERROR_FROM_SUBPROCESS = `${name.toLocaleUpperCase()}_ERROR`;
    const DEBUG_FROM_SUBPROCESS = `${name.toLocaleUpperCase()}_DEBUG`;

    let startResolve;
    let msgResolve;

    /* From Renderer */
    ipcMain.handle(START_FROMP_RELOAD, async () => {
        return new Promise((resolve, reject) => {
            const preload = path.join(__dirname, 'background', 'highlight.js');
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
                "window.api.setConsole(console);",
                "window.api.start();",
                "</script>",
            ].join("");

            hiddenWindows[name].loadURL("data:text/html;charset=utf-8," + encodeURI(html));
            hiddenWindows[name].webContents.openDevTools();

            hiddenWindows[name].on('closed', () => {
                hiddenWindows[name] = null;
            });
            startResolve = resolve;
            console.log("[LOADING]", START_FROMP_RELOAD);
        });
    });

    ipcMain.handle(MSG_FROM_PRELOAD, (_, msg) => {
        return new Promise((resolve, reject) => {
            console.log("[MESSAGE]", MSG_FROM_PRELOAD, msg);
            hiddenWindows[name].webContents.send(`MSG_RECEIVE_${name.toLocaleUpperCase()}`, msg);
            msgResolve = resolve;
        });
    })

    /* From Subprocess */
    ipcMain.on(READY_FROM_SUBPROCESS, () => {
        console.log("[READY]", READY_FROM_SUBPROCESS, name);
        startResolve(`${name} is ready!`)
    });

    ipcMain.on(RESPONSE_FROM_SUBPROCESS, (_, resp) => {
        console.log("[RESPONSE]", RESPONSE_FROM_SUBPROCESS, resp);
        if(msgResolve){
            msgResolve(resp);
        }
    });

    ipcMain.on(ERROR_FROM_SUBPROCESS, (_, resp) => {
        console.log("[ERROR]", ERROR_FROM_SUBPROCESS, resp);
    });

    ipcMain.on(DEBUG_FROM_SUBPROCESS, (_, resp) => {
        console.log("[DEBUG]", DEBUG_FROM_SUBPROCESS, resp);
    });
}

module.exports = { startBackgroundProcess }