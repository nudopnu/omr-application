const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const { ipcMain } = require('electron');
const path = require('path');



function startBackgroundProcess(name) {
    
    let hiddenWindows = {};
    let hasStarted = false;
    let startResolve;
    let msgResolve;

    const PRELOAD_START = `START_${name.toLocaleUpperCase()}`;
    const PRELOAD_MSG = `MSG_TO_${name.toLocaleUpperCase()}`;
    const SUBPROCESS_READY = `${name.toLocaleUpperCase()}_READY`;
    const SUBPROCESS_RESPONSE = `${name.toLocaleUpperCase()}_RESPONSE`;
    const SUBPROCESS_ERROR = `${name.toLocaleUpperCase()}_ERROR`;
    const SUBPROCESS_DEBUG = `${name.toLocaleUpperCase()}_DEBUG`;

    /* From Renderer */
    ipcMain.handle(PRELOAD_START, async () => {
        return new Promise((resolve, reject) => {
            console.log(`[PRELOAD -> ${name.toLocaleUpperCase()}]:`.padEnd(25), PRELOAD_START);

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
                `console.log("[Subprocess] ${name.toLocaleUpperCase()}");`,
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
            hasStarted = true;
        });
    });

    ipcMain.handle(PRELOAD_MSG, (_, msg) => {
        console.log(`[PRELOAD -> ${name.toLocaleUpperCase()}]:`.padEnd(25), msg);
        if (!hasStarted) {
            return new Promise((resolve, reject) => {
                reject(`Subprocess ${name.toLocaleUpperCase()} hasn't started yet`)
            });
        }
        return new Promise((resolve, reject) => {
            hiddenWindows[name].webContents.send(`MSG_RECEIVE_${name.toLocaleUpperCase()}`, msg);
            msgResolve = resolve;
        });
    })

    /* From Subprocess */
    ipcMain.on(SUBPROCESS_READY, () => {
        console.log(`[${name.toLocaleUpperCase()} -> RENDERER]:`.padEnd(25), SUBPROCESS_READY);
        console.log(startResolve);
        startResolve(`${name} is ready!`)
    });

    ipcMain.on(SUBPROCESS_RESPONSE, (_, resp) => {
        console.log(`[${name.toLocaleUpperCase()} -> RENDERER]:`.padEnd(25), resp);
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