const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron/renderer');
const { PythonShell } = require('python-shell');
const path = require('path');

let pyshell;
let log = console;

contextBridge.exposeInMainWorld('api', {
    start: () => {
        ipcRenderer.send('HIGHLIGHT_DEBUG', "preparing to start....");
        pyshell = new PythonShell(path.join(__dirname, '..', '..', 'scripts', 'highlight.py'), { mode: 'text' });
        // PythonShell.run(path.join(__dirname, '..', '..', 'scripts', 'ping.py'), null, (err, output) => {
        //     ipcRenderer.send("HIGHLIGHT_ERROR", err);
        //     ipcRenderer.send("HIGHLIGHT_DEBUG", output);
        // });
        pyshell.on('message', function (results) {
            log(results)
            ipcRenderer.send('HIGHLIGHT_RESPONSE', results);
        });
        ipcRenderer.on('MSG_RECEIVE_HIGHLIGHT', (_event, msg) => {
            log(msg, pyshell)
            ipcRenderer.send('HIGHLIGHT_DEBUG', msg);
            pyshell.send(msg);
        });
        ipcRenderer.send('HIGHLIGHT_READY', "start completes")
    },
    onMessage: (callback) => ipcRenderer.on('MSG_RECEIVE_HIGHLIGHT', callback),
    talkToProceses: (msg) => pyshell.send(msg),
    setConsole: (console) => log = console.log,
})



// console.log("HIGHLIGHT_READY");
