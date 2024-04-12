const {
  Notification
} = require("electron");

async function createRegister(event, data, tablet, nameTitle) {
    try {
      //se trae la conexion a sql
      const conn = await getConnection();
      const result = await conn.query("INSERT INTO " + tablet + " SET ?", data);
  
     new Notification({
        title: nameTitle,
        body: "Se guardo correctamente",
      }).show();
  
      event.returnValue = result;
    } catch (error) {
      event.returnValue = error;
    }
}

module.exports = { createRegister };
