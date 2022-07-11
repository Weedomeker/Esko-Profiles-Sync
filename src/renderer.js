onload = async () => {
  const result = await window.api.store()
  console.log('hostPath:', result.hostPath)

  const hostPath = await document.getElementById('hostPath')

  if (result.hostPath === undefined) {
    hostPath.value = 'Répertoire i-cut...'
  } else {
    hostPath.value = result.hostPath
  }
}

document.getElementById('hostSelect').addEventListener('click', async () => {
  const openFile = await window.api.showDialog()
  const hostPath = await document.getElementById('hostPath')
  const hostText = await document.getElementById('hostText')
  const targetText = await document.getElementById('targetText')

  hostPath.value = openFile.dirPath
  hostText.value = openFile.readFile
  targetText.value = openFile.conv
  hostText.innerHTML = openFile.prismifiedHost
  targetText.innerHTML = openFile.prismifiedTarget
})