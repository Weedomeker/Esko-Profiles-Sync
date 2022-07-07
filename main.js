// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
const fs = require('fs');
const convert = require('xml-js');
const Prism = require('prismjs');
const Store = require('electron-store');
const store = new Store();

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // et charger l'index.html de l'application.
  win.loadFile('index.html');
  //win.setMenu(null)
  win.webContents.openDevTools({ mode: 'bottom' });

}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.

let dirEsko = (() => {
  if (store.get('hostPath') === undefined) {
    return 'Répertoire i-cut...'
  } else {
    return store.get('hostPath')
  }
})

const filePath = async () => dialog.showOpenDialog({
  properties: ['openDirectory'],
}).then(result => {
  //console.log(result)
  if (result.canceled) {
    console.log('User canceled opening file')
    return 'Répertoire i-cut...'
  } else {
    console.log(result.filePaths[0])
    store.set('hostPath', result.filePaths[0])
    return result.filePaths[0];
  }
}).catch(err => {
  console.log(err)
});

const profilesFile = fs.readFileSync(dirEsko() + '\\CuttingProfiles.xml', 'utf8');

const conversion = () => {
  const profilesData = JSON.parse(convert.xml2json(profilesFile, { compact: true, spaces: 2 }));
  const obj = profilesData.root.CuttingProfiles.CuttingProfile
  let arr = []
  for (const i in obj) {
    arr.push(`<Substrate>\n	<Name>${obj[i]._attributes.Name}</Name>\n</Substrate>\n`);
  };
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].replace('[', '');
    arr[i] = arr[i].replace(']', '');
    arr[i] = arr[i].replace(' ', '');
  }
  const data = (`<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n${arr.join("")}</Root>`);
  return data;
}

const prismifiedHost = Prism.highlight(profilesFile, Prism.languages.xml, 'xml');
const prismifiedTarget = Prism.highlight(conversion(), Prism.languages.xml, 'xml');


//Ecoute événement
ipcMain.handle('dialog:open', async (event, args) => {
  const dirPath = await filePath();
  const readFile = await profilesFile;
  const conv = await conversion();
  return {
    dirPath,
    readFile,
    prismifiedHost,
    conv,
    prismifiedTarget
  }
})

// ipcMain.handle('readFile', async (event, args) => {
//   const file = fs.readFileSync(files, 'utf8').toString();
//   return file;
// })

ipcMain.handle('store', async (event, key) => {
  return store.get(key)
})
