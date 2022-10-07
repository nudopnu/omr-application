// const { pythonBackgroundProcess } = require('./background_preload');

// pythonBackgroundProcess("json");

const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron/renderer');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyshell;
let log;

contextBridge.exposeInMainWorld('api', {
    start: () => {
        const processPath = path.join(__dirname, '..', '..', 'scripts', 'jsontest.py');
        pyshell = new PythonShell(processPath, { mode: 'json' });
        log(pyshell);

        // listen for python 
        pyshell.on('message', function (results) {
            log("[Receiving from python]", results)
            ipcRenderer.send(`JSON_RESPONSE`, results);
        });
        pyshell.on('error', function (error) {
            log("[Receiving from python]", error)
            ipcRenderer.send(`JSON_ERROR`, error);
        })

        // listen for main
        ipcRenderer.on(`MSG_RECEIVE_JSON`, (_event, msg) => {
            log("[Receiving from main]", msg)
            ipcRenderer.send(`JSON_DEBUG`, msg);
            pyshell.send(msg);
        });

        ipcRenderer.send(`JSON_READY`, processPath)
        log("[Processpath]", processPath)
        log("[Sending to main]", `JSON_READY`)
    },
    onMessage: (callback) => ipcRenderer.on(`MSG_RECEIVE_JSON`, callback),
    talkToProcess: (msg) => pyshell.send(msg),
    setConsole: (console) => log = console.log,
})