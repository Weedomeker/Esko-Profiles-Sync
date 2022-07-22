const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    showDialogEsko: async () => await ipcRenderer.invoke('dialog:esko'),
    showDialogPao: async () => await ipcRenderer.invoke('dialog:pao'),
    profilesPath: async () => await ipcRenderer.invoke('profiles-Path'),
    materialsPath: async () => await ipcRenderer.invoke('materials-Path'),
    readFile: async () => await ipcRenderer.invoke('read-File'),
    conversion: async (args) => await ipcRenderer.invoke('conversion', args),
    beautify: async (args) => await ipcRenderer.invoke('beautify', args),
})
