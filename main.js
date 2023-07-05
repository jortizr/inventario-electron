const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

require("electron-reload")(__dirname);

//vamos a requerir la conexion a la base de datos
const { getConnection } = require("./src/database");

//funcion que crea la vista despues de autenticar
function createWindow () {
  const mainWindows = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './src/preload.js')
    }
  })

  mainWindows.loadFile('./src/UI/login.html')
}

//funcion de la ventana de login
function loginWindow(){
  const winLogin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './src/preload.js')
    }
  })
  winLogin.loadFile('./src/UI/login.html')
}

async function validationLogin(event, data){
  const {user, password} = data
  console.log(data)

  event.returnValue = data

}

app.whenReady().then(() => {
  ipcMain.on("autentication-login", validationLogin)
  loginWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})