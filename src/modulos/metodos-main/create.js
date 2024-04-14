/**
 * la fncion queryCreate se encarga de insertar un registro en la base de datos.
 * @param {*} event 
 * @param {string} data recibe la data a insertar
 * @param {string} table recibe el nombre de la tabla
 * @param {string} nameTitle recibe el nombre del titulo de la notificacion
 */
async function queryCreate(event, data, table, nameTitle) {
    const { getConnection } = require("../../database");
    const { Notification } = require("electron");
    try {
      //se trae la conexion a sql
      const conn = await getConnection();
      const result = await conn.query(`INSERT INTO ${table} SET ?`, data);
  
     new Notification({
        title: nameTitle,
        body: "Se guardo correctamente",
      }).show();
  
      event.returnValue = result , noti;
    } catch (error) {
      event.returnValue = error;
    }
}

module.exports = { queryCreate };
