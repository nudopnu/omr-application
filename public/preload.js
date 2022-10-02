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
    start: () => ipcRenderer.invoke('START_HIGHLIGHT', 'highlight'),
})