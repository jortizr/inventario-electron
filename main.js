const {loadingPages} = require("./src/modulos/loadingPage")
const {app,BrowserWindow,ipcMain, Notification, webContents} = require("electron");
const fs = require("fs");
require("electron-reload")(__dirname);
const {queryCreate} = require("./src/modulos/metodos-main/create");
const {queryDelete} = require("./src/modulos/metodos-main/delete");
const {querryGet} = require("./src/modulos/metodos-main/select");
const { querryUpdate } = require('./src/modulos/metodos-main/update');
const path = require("path");

let nameUser;
let rolUser;

const { getConnection } = require("./src/database");

let winLogin;
let mainWindows = null;
/**
 * funcion para crear nuevas ventanas con una vista en especifico
 * @param {string} vista recibe la vista que se va a cargar
 */
function createWindow(vista) {
  mainWindows = new BrowserWindow({
    title: "Inventario Tecnologia",
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
/**
 * funcion para crear la ventana de login
 * 
 */
function loginWindow() {
  winLogin = new BrowserWindow({
    title: "Inventario Tecnologia",
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

  /**
   * funcion para validar el login del usuario
   * @param {event} event recibe el evento de ipcMain
   * @param {*} data recibe los datos de usuario y password
   * @param {*} nameUser recibe la variable que guardara el nombre del usuario
   * @param {*} rolUser recibe la variable que guardara el rol del usuario
   * @param {*} winLogin recibe el objeto de la ventana de login
   */
  async function validationLogin(event, data) {
    try {
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
        if (
          login[0].IDRol === 1 ||
          login[0].IDRol === 2 ||
          login[0].IDRol === 4
        ) {
          //coordinador y gerencia son iguales
          createWindow("../UI/index.html");
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
    } catch (error) {
      console.error(error);
    }
  }

//funcion que envia la data del usuario que se autentico
async function dataSesion() {
  return [nameUser, rolUser]; 
}

async function loadPag(event, page) {
  const pageIndex = page.toLowerCase();
  //funcion para leer los nombre de los archivos de las vistas
  fs.readdir("./src/UI/vistas/", (err, archivos) => {
    if (err) {
      console.error(err);
      return;
    }
    //aqui uso la lista
    const indice = archivos.findIndex((archivo) => archivo.includes(pageIndex));
    //si encontro la pagina 
    if (indice !== -1) {
      // si se encontró el archivo
      readHtml(event, archivos[indice]);
    }

  });
}

async function createRegional(event, regional) {
  queryCreate(event, regional, "regional", "Registro Regional");
}
async function deleteRegional(event, id){
  queryDelete(event, id, "regional", "idRegional");
}
async function getRegional(event) {
  querryGet(event, "regional", "idRegional", "*");
}
async function updateRegional(event, regional, id) {
  querryUpdate(event, regional, "regional", "idRegional", id);
}

app.whenReady().then(() => {
  ipcMain.on("load-page", loadPag);
  //canal para autenticar la data del usuario del login.js
  ipcMain.handle("autentication-login", validationLogin);
  //canal que envia los datos del usuario solicitado por tabs.js
  ipcMain.handle("data-user", dataSesion);
  //canal de registro regional
  ipcMain.on("create-regional", createRegional);
  //traer la lista de regionales
  ipcMain.on("get-regional", getRegional);
  //canal de update regional
  ipcMain.on("update-regional", updateRegional);
  //borrar registros
  ipcMain.on("delete-data", deleteRegional)

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
