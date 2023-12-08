const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    openGraphicFile: () => ipcRenderer.invoke('dialog:openGraphicFile'),
    openGraphicInfoFile : () => ipcRenderer.invoke('dialog:openGraphicInfoFile'),
    openAnimeFile: () => ipcRenderer.invoke('dialog:openAnimeFile'),
    openAnimeInfoFile: () => ipcRenderer.invoke('dialog:openAnimeInfoFile'),
    graphicPageInit: () => ipcRenderer.invoke('graphicPageInit'),
    getGraphicDataById: (imgNum, callback) => {
        return new Promise((resolve, reject) => {
            const {port1, port2} = new MessageChannel();
            ipcRenderer.postMessage('getGraphicDataById', imgNum, [port2]);

            port1.onmessage = (event) => {
                resolve(event.data);
            };

            // port1.onclose = () => {};
        });
    },
});