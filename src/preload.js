const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    showDialog: async () => await ipcRenderer.invoke('dialog:open'),
    profilesPath: async () => await ipcRenderer.invoke('profiles-Path'),
    readFile: async () => await ipcRenderer.invoke('read-File'),
    conversion: async (args) => await ipcRenderer.invoke('conversion', args),
    beautify: async (args) => await ipcRenderer.invoke('beautify', args),
})
