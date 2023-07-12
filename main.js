const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

require("electron-reload")(__dirname);

let nameUser;
let rolUser;

//vamos a requerir la conexion a la base de datos
const { getConnection } = require("./src/database");
const { log } = require("console");
let winLogin;
let mainWindows = null;
//funcion que crea la vista despues de autenticar
function createWindow(vista) {
  if (mainWindows) {
    //si la ventana principal ya existe, recarga la vista
    mainWindows.loadFile(vista);
  } else {
    mainWindows = new BrowserWindow({
      width: 850,
      height: 620,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "./src/preload.js"),
      },
    });
    mainWindows.loadFile(vista);
    mainWindows.webContents.openDevTools();
  }
}

//funcion de la ventana de login
function loginWindow() {
  winLogin = new BrowserWindow({
    width: 850,
    height: 620,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./src/preload.js"),
    },
  });
  winLogin.loadFile("./src/UI/login.html");
  winLogin.webContents.openDevTools();
}
//funcion validar usuario
async function validationLogin(event, data) {
  //se distribuye los datos enviados por el login.js
  const { user, password } = data;
  //se abre la conexion con la BD
  const conn = await getConnection();
  //se realiza la consulta del usuario y se le pasa la data
  const login = await conn.query(
    "SELECT * FROM user WHERE idUser=? AND password=?",
    [user, password]
  );

  //valida si la consulta tiene una respuesta con data, si es 1
  //es porque si hubo informacion de lo contrario no existe
  if (login.length > 0) {
    winLogin.close();
    new Notification({
      title: "Bienvenido " + login[0].Nombre_Completo,
      body: "Iniciaste sesion existosamente",
    }).show();
    //segun el rol del usuario abre la ventana con el html especifico
    if (login[0].IDRol === 3) {
      //rol de administrador
      createWindow("./src/UI/admin.html");
    }
    if (login[0].IDRol === 1 || login[0].IDRol === 2 || login[0].IDRol === 4) {
      //coordinador y gerencia son iguales
      createWindow("./src/UI/index.html");
    }

    //consulta el rol del usuario para mostrarlo en el menu tabs.html
    const tipoRol = await conn.query(
      "SELECT Nombre_Rol FROM rol WHERE idRol=?",
      login[0].IDRol
    );
    nameUser = login[0].Nombre_Completo;
    rolUser = tipoRol[0].Nombre_Rol;
  } else {
    new Notification({
      title: "ERROR!!",
      body: "usuario o password equivocado",
    }).show();
  }
}

//funcion que envia la data del usuario que se autentico
async function dataSesion() {
  return [nameUser, rolUser];
}

app.whenReady().then(() => {
  //canal para autenticar la data del usuario del login.js
  ipcMain.handle("autentication-login", validationLogin);
  //canal que envia los datos del usuario solicitado por tabs.js
  ipcMain.handle("data-user", dataSesion);
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
