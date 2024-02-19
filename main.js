const {createRegional, deleteRegional, getRegional} = require('./src/modulos/regionalQueries')
const {loadPag} = require("./src/modulos/loadingPage")
const {createWindow} = require("./src/modulos/createWindow")
const {validationLogin, loginWindow} = require("./src/modulos/loginValidate")
const {app,BrowserWindow,ipcMain, Notification, webContents} = require("electron");
const path = require("path");
const fs = require("fs");
require("electron-reload")(__dirname);


let nameUser;
let rolUser;

//vamos a requerir la conexion a la base de datos
const { getConnection } = require("./src/database");

let winLogin;
let mainWindows = null;
//funcion que crea la vista despues de autenticar




//funcion que envia la data del usuario que se autentico
async function dataSesion() {
  return [nameUser, rolUser]; 
}


app.whenReady().then(() => {
  ipcMain.on("load-page", (event, page)=>{loadPag(event, page)});
  //canal para autenticar la data del usuario del login.js
  ipcMain.handle("autentication-login", (event, data, nameUser, rolUser, winLogin)=>
  {validationLogin(event, data, nameUser, rolUser, winLogin)});
  //canal que envia los datos del usuario solicitado por tabs.js
  ipcMain.handle("data-user", dataSesion);
  //canal de registro regional
  ipcMain.on("create-regional", (event, regional) => {createRegional(event, regional)});
  //traer la lista de regionales
  ipcMain.on("get-regional", (event)=>{getRegional(event)});
  //canal de update regional
  ipcMain.on("update-regional", (event, regional, id)=>{updateRegional(event, regional, id)});
  //borrar registros
  ipcMain.on("delete-data", (event, id)=>{deleteRegional(event, id)})

  //inicia la ventana de login
  loginWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//funcion para leer el contenido de los html y pasarlo al IpcMain
function readHtml(event, vista) {
  const rutaVista = "./src/UI/vistas/" + vista;
  fs.readFile(rutaVista, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Envía el código HTML de la vista al proceso de renderizado
    event.returnValue = data;
  });
}
