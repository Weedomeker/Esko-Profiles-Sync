const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  showDialog: async () => await ipcRenderer.invoke('dialog:open'),
  store: async () => await ipcRenderer.invoke('store'),
  //readFile: async () => await ipcRenderer.invoke('readFile'),
})
