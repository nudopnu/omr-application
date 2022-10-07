const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
})

contextBridge.exposeInMainWorld('python', {
    getModels: () => ipcRenderer.invoke('get-models'),
    predict: (modelname, img) => ipcRenderer.invoke('predict', modelname, img),
})

contextBridge.exposeInMainWorld('layers', {
    start: () => ipcRenderer.invoke('START_HIGHLIGHT'),
    provideImage: (img) => ipcRenderer.invoke('MSG_TO_HIGHLIGHT', img.split(',')[1]),
    highlight: (color) => ipcRenderer.invoke('MSG_TO_HIGHLIGHT', color),
})

// contextBridge.exposeInMainWorld('json', {
//     start: () => ipcRenderer.invoke('START_JSON'),
//     sendCommand: (command) => ipcRenderer.invoke('MSG_TO_JSON', command),
// })
provideBackgroundPython("jsontest");

function provideBackgroundPython(name) {
    contextBridge.exposeInMainWorld(name, {
        start: () => ipcRenderer.invoke(`START_${name.toLocaleUpperCase()}`),
        sendCommand: (command) => ipcRenderer.invoke(`MSG_TO_${name.toLocaleUpperCase()}`, command),
    })
}