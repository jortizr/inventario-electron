

function createWindow(vista) {
    mainWindows = new BrowserWindow({
      width: 850,
      height: 620,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "./src/preload.js"),
      },
      //frame: false,
    });
    mainWindows.loadFile(vista);
    mainWindows.webContents.openDevTools();
    //modal.setMenu(null);
    // }
  }

  module.exports = {createWindow}