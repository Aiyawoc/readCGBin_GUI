const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    openGraphicFile: () => ipcRenderer.invoke('dialog:openGraphicFile'),
    openGraphicInfoFile : () => ipcRenderer.invoke('dialog:openGraphicInfoFile'),
    openAnimeFile: () => ipcRenderer.invoke('dialog:openAnimeFile'),
    openAnimeInfoFile: () => ipcRenderer.invoke('dialog:openAnimeInfoFile')
});