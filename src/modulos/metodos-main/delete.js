/**
 * la funcion queryDelete se encarga de eliminar un registro de la base de datos.
 * @param {*} event  recibe el evento de ipcMain de la funcion declarada en el main.js
 * @param {string} id recibe el identificador a eliminar
 * @param {string} table recibe el nombre de la tabla
 * @param {strig} key recibe el nombre de la llave primaria de la tabla
 */
async function queryDelete(event, id, table, key){
    const { getConnection } = require("../../database");
    const { Notification } = require("electron");
    try {
        
        const conn = await getConnection();
        const result = await conn.query(`DELETE FROM ${table} WHERE ${key} = ?`, id)
        new Notification({
        title: "Notificacion",
        body: "registro eliminado",
        }).show();
        event.returnValue = result;
    } catch (error) {
        console.log("se produjo un error al eliminar: \n"+error);
    }
}

module.exports = { queryDelete };