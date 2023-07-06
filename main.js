const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

require("electron-reload")(__dirname);

//vamos a requerir la conexion a la base de datos
const { getConnection } = require("./src/database");
let winLogin;
let mainWindows;
//funcion que crea la vista despues de autenticar
function createWindow() {
  mainWindows = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./src/preload.js"),
    },
  });

  mainWindows.loadFile("./src/UI/index.html");
  mainWindows.webContents.openDevTools();
}

//funcion de la ventana de login
function loginWindow() {
  winLogin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./src/preload.js"),
    },
  });
  winLogin.loadFile("./src/UI/login.html");
  winLogin.webContents.openDevTools();
}
//validar usuario
async function validationLogin(event, data) {
  const { user, password } = data;
  const conn = await getConnection();

  const login = await conn.query(
    "SELECT * FROM user WHERE idUser=? AND password=?",
    [user, password]
  );

  if (login.length > 0) {
    createWindow();
    mainWindows.show();
    winLogin.close();
    new Notification({
      title: "Bienvenido " + user,
      body: "Iniciaste sesion existosamente",
    }).show();
  } else {
    new Notification({
      title: "ERROR!!",
      body: "usuario o password equivocado",
    }).show();
  }
}

app.whenReady().then(() => {
  ipcMain.handle("autentication-login", validationLogin);
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
