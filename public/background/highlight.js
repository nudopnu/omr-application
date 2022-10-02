const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('api', {
    test: () => ipcRenderer.send("HIGHLIGHT_READY"),
})

// ipcRenderer.on('START_PROCESSING', (event, args) => {
//     const { data } = args;
//     let pyshell = new PythonShell(path.join(__dirname, '/../scripts/factorial.py'), {
//         pythonPath: 'python3',
//         args: [data]
//     });

//     pyshell.on('message', function(results) {
//         ipcRenderer.send('MESSAGE_FROM_BACKGROUND', { message: results });
//     });
// });

// console.log("HIGHLIGHT_READY");
