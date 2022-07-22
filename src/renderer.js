const hostPath = document.getElementById('hostPath')
const hostText = document.getElementById('hostText')
const targetText = document.getElementById('targetText')
const targetPath = document.getElementById('targetPath')
const hostSelect = document.getElementById('hostSelect')
const targetSelect = document.getElementById('targetSelect')

onload = async () => {
    const eskoPath = await window.api.profilesPath()
    const paoPath = await window.api.materialsPath()
    hostPath.value = eskoPath
    targetPath.value = paoPath
}

hostSelect.addEventListener('click', async () => {
    const openCuttingProfiles = await window.api.showDialogEsko()
    const data = await window.api.readFile()
    const conv = await window.api.conversion(data)
    const beautifyData = await window.api.beautify(data)
    const beautifyConv = await window.api.beautify(conv)

    hostPath.value = openCuttingProfiles
    hostText.innerHTML = beautifyData
    targetText.innerHTML = beautifyConv
})

targetSelect.addEventListener('click', async () => {
    const openMaterials = await window.api.showDialogPao()
    targetPath.value = openMaterials

})