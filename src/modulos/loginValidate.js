
const {createWindow} = require("./createWindow")
const { getConnection } = require('../database');
const {Notificapp,BrowserWindow,ipcMain, Notification, webContentsation} = require("electron");

let winLogin;
//funcion de la ventana de login
function loginWindow() {
    winLogin = new BrowserWindow({
      width: 850,
      height: 620,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, "../preload.js"),
      },
    });
    winLogin.loadFile("../UI/login.html");
    winLogin.webContents.openDevTools();
  }
  //funcion validar usuario
  



async function validationLogin(event, data, nameUser, rolUser, winLogin) {
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
          createWindow("../UI/admin.html");
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

  module.exports = {validationLogin, loginWindow}