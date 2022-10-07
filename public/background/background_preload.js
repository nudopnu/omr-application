const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron/renderer');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyshell;
let log;

function pythonBackgroundProcess(name) {

    const READY_TO_MAIN = `${name.toLocaleUpperCase()}_READY`;
    const RESPONSE_TO_MAIN = `${name.toLocaleUpperCase()}_RESPONSE`;
    const ERROR_TO_MAIN = `${name.toLocaleUpperCase()}_ERROR`;
    const DEBUG_TO_MAIN = `${name.toLocaleUpperCase()}_DEBUG`;
    const MSG_FROM_MAIN = `MSG_RECEIVE_${name.toLocaleUpperCase()}`;

    const PY_MSG = 'message';
    const PY_ERROR = 'error';

    contextBridge.exposeInMainWorld('api', {
        start: () => {
            const processPath = path.join(__dirname, '..', '..', 'scripts', `${name}.py`);
            pyshell = new PythonShell(processPath, { mode: 'json' });

            // listen for python 
            pyshell.on(PY_MSG, function (results) {
                log("[Python -> Main]", results)
                ipcRenderer.send(RESPONSE_TO_MAIN, results);
            });
            pyshell.on(PY_ERROR, function (error) {
                log("[Python -> Main]", error)
                ipcRenderer.send(ERROR_TO_MAIN, error);
            })

            // listen for Main
            ipcRenderer.on(MSG_FROM_MAIN, (_event, msg) => {
                log("[Main -> Python]", msg)
                ipcRenderer.send(DEBUG_TO_MAIN, msg);
                pyshell.send(msg);
            });

            log("[Subprocess] Starting:", processPath)
            log("[Subprocess -> Main]", READY_TO_MAIN)
            ipcRenderer.send(READY_TO_MAIN, processPath)
        },
        onMessage: (callback) => ipcRenderer.on(MSG_FROM_MAIN, callback),
        talkToProcess: (msg) => pyshell.send(msg),
        setConsole: (console) => log = console.log,
    })
}

module.exports = { pythonBackgroundProcess }
