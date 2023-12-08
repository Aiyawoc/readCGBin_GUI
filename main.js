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

if (require('electron-squirrel-startup')) {
    app.quit();
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openGraphicFile', openGraphic);
    ipcMain.handle('dialog:openGraphicInfoFile', openGraphicInfo);
    ipcMain.handle('dialog:openAnimeFile', openAnime);
    ipcMain.handle('dialog:openAnimeInfoFile', openAnimeInfo);
    ipcMain.handle('graphicPageInit', getGraphicList);
    ipcMain.on('getGraphicDataById', (event, msg) => {
        // 渲染进程向我们发送了一个 MessagePort
        // 并期望得到响应
        const [replyPort] = event.ports;

        getGraphicDataById(msg).then(res => {
            replyPort.postMessage(res);
            replyPort.close();
        });

        // 在这里，我们同步发送消息
        // 我们也可以将端口存储在某个地方，异步发送消息
        // for (let i = 0; i < msg.count; i++) {
        //     replyPort.postMessage(msg.element)
        // }



        // 当我们处理完成后，关闭端口以通知另一端
        // 我们不会再发送任何消息 这并不是严格要求的
        // 如果我们没有显式地关闭端口，它最终会被垃圾回收
        // 这也会触发渲染进程中的'close'事件
        // replyPort.close()
    });

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

let graphicPath = null;
let graphicInfoPath = null;
let animePath = null;
let animeInfoPath = null;

let graphicHex = null;
let graphicInfoHex = null;
let animeHex = null;
let animeInfoHex = null;

let graphicInfoList = null;



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
            graphicPath = filePaths[0];
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
            graphicInfoPath = filePaths[0];
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
            animePath = filePaths[0];
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
            animeInfoPath = filePaths[0];
            return filePaths[0];
        }

        return null;
    }
}


async function getGraphicList() {
    console.log('getGraphicList');
    // TODO: 返回图片imgNum列表及第一条数据
    return new Promise((resolve, reject) => {
        if (!graphicPath || !graphicInfoPath) {
            resolve(null);
        } else {
            CG.getGraphicInfo(graphicInfoPath, dataList => {
                graphicInfoList = dataList;

                let resData = {
                    infoList: [],
                    0: null
                };

                for (let key in dataList) {
                    resData.infoList.push(key);
                }

                getGraphicDataById(resData.infoList[0]).then(res => {
                    resData[0] = res;
                    resolve(resData);
                });
            });
        }
    });
}

function getGraphicDataById(imgNum) {
    console.log('getGraphicDataById:', imgNum);

    return new Promise((resolve, reject) => {
        let _gInfo = graphicInfoList[imgNum];
        if (_gInfo) {
            let res = {
                imgNum: _gInfo.imgNum,
                addr: _gInfo.addr,
                imgSize: _gInfo.imgSize,
                offsetX: _gInfo.offsetX,
                offsetY: _gInfo.offsetY,
                imgWidth: _gInfo.imgWidth,
                imgHeight: _gInfo.imgHeight,
                areaX: _gInfo.areaX,
                areaY: _gInfo.areaY,
                canMove: _gInfo.canMove,
                mapId: _gInfo.mapId
            };

            // 获取图片数据
            CG.getGraphicData(graphicPath, _gInfo, _g => {
                // console.log(_g);
                res.verson = _g.verson;

                // TODO: 获取调色板状态

                // TODO: 软件关闭时, 清除tmp文件夹中的所有数据
                // fs.unlinkSync('./tmp/tmpGraphic.bmp');
                _g.createBMP(`./tmp/${imgNum}.bmp`, [0, 0, 0, 0], null, bmp => {
                    res.img = bmp;
                    resolve(res);
                });
            });
        } else {
            console.log('no img');
            resolve(null);
        }
    });
}