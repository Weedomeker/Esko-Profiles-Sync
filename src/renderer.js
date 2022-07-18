const hostPath = document.getElementById('hostPath')
const hostText = document.getElementById('hostText')
const targetText = document.getElementById('targetText')
const hostSelect = document.getElementById('hostSelect')

onload = async () => {
    const result = await window.api.profilesPath()
    // console.log('hostPath:', result.hostPath)
    hostPath.value = result
}

hostSelect.addEventListener('click', async () => {
    const openFile = await window.api.showDialog()
    const data = await window.api.readFile()
    const conv = await window.api.conversion(data)
    const beautifyData = await window.api.beautify(data)
    const beautifyConv = await window.api.beautify(conv)

    hostPath.value = openFile
    hostText.innerHTML = beautifyData
    targetText.innerHTML = beautifyConv
    // hostText.innerHTML = await openFile.prismifiedHost
    // targetText.innerHTML = await openFile.prismifiedTarget
})
