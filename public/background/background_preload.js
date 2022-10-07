const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron/renderer');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyshell;
let log, err;

function pythonBackgroundProcess(name) {
    contextBridge.exposeInMainWorld('api', {
        start: () => {
            ipcRenderer.send(`${name.toLocaleUpperCase()}_DEBUG`);
            pyshell = new PythonShell(path.join(__dirname, '..', '..', 'scripts', `${name}.py`), { mode: 'json' });
            pyshell.on('message', function (results) {
                log("[Receiving from python]", results)
                ipcRenderer.send(`${name.toLocaleUpperCase()}_RESPONSE`, results);
            });
            pyshell.on('error', function (error) {
                err("[Receiving from python]", error)
                ipcRenderer.send(`${name.toLocaleUpperCase()}_ERROR`, error);
            })
            ipcRenderer.on(`MSG_RECEIVE_${name.toLocaleUpperCase()}`, (_event, msg) => {
                log("[Receiving from main]", msg)
                ipcRenderer.send(`${name.toLocaleUpperCase()}_DEBUG`, msg);
                pyshell.send(msg);
            });
            ipcRenderer.send(`${name.toLocaleUpperCase()}_READY`)
            log("[Sending ready signal to main]", `${name.toLocaleUpperCase()}_READY`)
        },
        onMessage: (callback) => ipcRenderer.on(`MSG_RECEIVE_${name.toLocaleUpperCase()}`, callback),
        talkToProcess: (msg) => pyshell.send(msg),
        setConsole: (console) => { log = console.log; err = console.err },
    })
}

module.exports = { pythonBackgroundProcess }
