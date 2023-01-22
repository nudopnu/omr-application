const { contextBridge, ipcRenderer } = require('electron');

function provideBackgroundPython(name) {
    contextBridge.exposeInMainWorld(name, {
        start: () => ipcRenderer.invoke(`START_${name.toLocaleUpperCase()}`),
        sendCommand: (type, payload) => ipcRenderer.invoke(`MSG_TO_${name.toLocaleUpperCase()}`, { type: type, payload: payload }),
    })
}

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

contextBridge.exposeInMainWorld('page', {
    print: (url, name, show) => ipcRenderer.invoke('print', url, name, show),
    capture: (url, width, height) => ipcRenderer.invoke('capture', url, width, height),
    pdf2png: (url, name, dpi) => ipcRenderer.invoke('pdf2png', url, name, dpi),
});

contextBridge.exposeInMainWorld('file', {
    readFile: (path) => ipcRenderer.invoke('READ_FILE', path),
    writeFile: (filename, content) => ipcRenderer.invoke('WRITE_FILE', filename, content),
})

provideBackgroundPython("jsontest");
provideBackgroundPython("predict");
provideBackgroundPython("predict2");
provideBackgroundPython("highlight");