/* eslint-disable electron/default-value-changed */
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const convert = require('xml-js')
const Prism = require('prismjs')
const Store = require('electron-store')
const store = new Store()

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 900,
        title: 'Esko Profiles Sync  v' + app.getVersion(),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
        },
    })
    // et charger l'index.html de l'application.
    win.loadFile(path.join(__dirname, '../public/index.html'))
    //win.setMenu(null)
    win.webContents.openDevTools({ mode: 'bottom' })
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

let profilesFile = ''
//Ecoute événement
ipcMain.handle('dialog:open', async () => {
    const result = await dialog
        .showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'CuttingProfiles', extensions: ['xml'] }],
        })
        .then((result) => {
            //console.log(result)
            if (result.canceled) {
                console.log('User canceled opening file')
                return 'Répertoire i-cut...'
            } else {
                if (
                    path.basename(result.filePaths[0]) === 'CuttingProfiles.xml'
                ) {
                    console.log('Diag Result:', result.filePaths[0])
                    profilesFile = result.filePaths[0]
                    return result.filePaths[0]
                } else {
                    return dialog.showErrorBox(
                        'Erreur',
                        'Veuillez sélectionner le fichier CuttingProfiles.xml'
                    )
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
    return result
})

ipcMain.handle('profiles-Path', async () => {
    const data = await store.get('hostPath')
    if (fs.existsSync(data)) {
        return data
    } else {
        return
    }
})

ipcMain.handle('read-File', async () => {
    if (path.basename(profilesFile) === 'CuttingProfiles.xml') {
        return await fs.readFileSync(profilesFile, 'utf8')
    } else {
        return
    }
})

ipcMain.handle('conversion', async (event, args) => {
    if (path.basename(profilesFile) === 'CuttingProfiles.xml') {
        const profilesData = await JSON.parse(
            convert.xml2json(args, { compact: true, spaces: 2 })
        )
        const obj = profilesData.root.CuttingProfiles.CuttingProfile
        let arr = []
        for (const i in obj) {
            arr.push(
                `<Substrate>\n	<Name>${obj[i]._attributes.Name}</Name>\n</Substrate>\n`
            )
        }
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].replace('[', '')
            arr[i] = arr[i].replace(']', '')
            arr[i] = arr[i].replace(' ', '')
        }
        const res = `<?xml version="1.0" encoding="UTF-8"?>\n<Root>\n${arr.join(
            ''
        )}</Root>`

        return res
    } else {
        return
    }
})

ipcMain.handle('beautify', async (event, args) => {
    if (path.basename(profilesFile) === 'CuttingProfiles.xml') {
        return await Prism.highlight(args, Prism.languages.xml, 'xml')
    } else {
        return
    }
})
