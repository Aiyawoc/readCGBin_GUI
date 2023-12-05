const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs');
const Path = require('path');
const CG = require('readcgbin');

// console.log(CG);
// TODO: 进程间通信 https://blog.csdn.net/wuqing942274053/article/details/125890044

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        icon: `./favicon.ico`,
        width: 820,
        height: 640,
        webPreferences: {
            preload: Path.join(__dirname, '/modules/preload.js')
        }
    });

    // 隐藏菜单栏
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);

    mainWindow.loadFile('index.html');
}

if (require('electron-squirrel-startup')){
    app.quit();
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openGraphicFile', openGraphic);
    ipcMain.handle('dialog:openGraphicInfoFile', openGraphicInfo);
    ipcMain.handle('dialog:openAnimeFile', openAnime);
    ipcMain.handle('dialog:openAnimeInfoFile', openAnimeInfo);
    ipcMain.handle('graphicPageInit', getGraphicList);

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})


/**
 * 接口部分
 */

let graphicFile = null;
let graphicInfoFile = null;
let animeFile = null;
let animeInfoFile = null;

async function openGraphic() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: '打开文件',
        properties: ['openFile'],
        filters: [
            { name: 'files', extensions: ['bin'] },
        ]
    });

    if (!canceled) {
        console.log(filePaths[0]);
        // 判断路径中是否包含graphic, 且不包含graphicinfo
        if (/graphic/i.test(filePaths[0]) && !/graphicinfo/i.test(filePaths[0])) {
            graphicFile = filePaths[0];
            return filePaths[0];
        }

        return null;
    }
}

async function openGraphicInfo() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: '打开文件',
        properties: ['openFile'],
        filters: [
            { name: 'files', extensions: ['bin'] },
        ]
    });

    if (!canceled) {
        console.log(filePaths[0]);
        // 判断路径中是否包含graphicinfo
        if (/graphicinfo/i.test(filePaths[0])) {
            graphicInfoFile = filePaths[0];
            return filePaths[0];
        }

        return null;
    }
}

async function openAnime() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: '打开文件',
        properties: ['openFile'],
        filters: [
            { name: 'files', extensions: ['bin'] },
        ]
    });

    if (!canceled) {
        console.log(filePaths[0]);
        // 判断路径中是否包含anime, 且不包含animeinfo
        if (/anime/i.test(filePaths[0]) && !/animeinfo/i.test(filePaths[0])) {
            animeFile = filePaths[0];
            return filePaths[0];
        }

        return null;
    }
}

async function openAnimeInfo() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: '打开文件',
        properties: ['openFile'],
        filters: [
            { name: 'files', extensions: ['bin'] },
        ]
    });

    if (!canceled) {
        console.log(filePaths[0]);
        // 判断路径中是否包含animeinfo
        if (/animeinfo/i.test(filePaths[0])) {
            animeInfoFile = filePaths[0];
            return filePaths[0];
        }

        return null;
    }
}


async function getGraphicList(){
    console.log('getGraphicList');
    return new Promise((resolve, reject) => {
        if(!graphicFile || !graphicInfoFile){
            resolve(null);
        }else{
            CG.getGraphicInfo(graphicInfoFile, dataList => {
                console.log('dataList.length: ', dataList.length);
                // console.log(dataList);
                let resData = [];
                for(let key in dataList){
                    resData.push({
                        imgNum: key,
                        addr: dataList[key].addr
                    });
                }
                resolve(resData);
                // resolve(dataList);
            });
        }
    });
}