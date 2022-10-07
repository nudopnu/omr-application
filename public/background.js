const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require('electron');
const path = require('path');


function startBackgroundProcess(name) {
    let hiddenWindows = {};

    const PRELOAD_START = `START_${name.toLocaleUpperCase()}`;
    const PRELOAD_MSG = `MSG_TO_${name.toLocaleUpperCase()}`;
    const SUBPROCESS_READY = `${name.toLocaleUpperCase()}_READY`;
    const SUBPROCESS_RESPONSE = `${name.toLocaleUpperCase()}_RESPONSE`;
    const SUBPROCESS_ERROR = `${name.toLocaleUpperCase()}_ERROR`;
    const SUBPROCESS_DEBUG = `${name.toLocaleUpperCase()}_DEBUG`;

    let startResolve;
    let msgResolve;

    /* From Renderer */
    ipcMain.handle(PRELOAD_START, async () => {
        return new Promise((resolve, reject) => {
            console.log("[PRELOAD - START]:".padEnd(25), name.toLocaleUpperCase());

            const preload = path.join(__dirname, 'background', `${name}.js`);
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
                `console.log("[Subprocess] ${name}");`,
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
        });
    });

    ipcMain.handle(PRELOAD_MSG, (_, msg) => {
        return new Promise((resolve, reject) => {
            console.log("[PRELOAD - MESSAGE]:".padEnd(25), name.toLocaleUpperCase(), msg);
            hiddenWindows[name].webContents.send(`MSG_RECEIVE_${name.toLocaleUpperCase()}`, msg);
            msgResolve = resolve;
        });
    })

    /* From Subprocess */
    ipcMain.on(SUBPROCESS_READY, () => {
        console.log("[SUBPROCESS - READY]:".padEnd(25), name.toLocaleUpperCase());
        // startResolve(`${name} is ready!`)
    });

    ipcMain.on(SUBPROCESS_RESPONSE, (_, resp) => {
        console.log("[SUBPROCESS - RESPONSE]:".padEnd(25), name.toLocaleUpperCase(), resp);
        if (startResolve) {
            startResolve(`${name} is ready!`)
            startResolve = null;
        }
        if (msgResolve) {
            msgResolve(resp);
        }
    });

    ipcMain.on(SUBPROCESS_ERROR, (_, resp) => {
        console.log("[SUBPROCESS - ERROR]:".padEnd(25), name.toLocaleUpperCase(), resp);
    });

    ipcMain.on(SUBPROCESS_DEBUG, (_, resp) => {
        console.log("[SUBPROCESS - DEBUG]:".padEnd(25), name.toLocaleUpperCase(), resp);
    });
}

module.exports = { startBackgroundProcess }