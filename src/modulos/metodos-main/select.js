/**
 *la funcion devuelve todos los registros de una tabla
 * @param {event} event recibe el event de ipcMain
 * @param {string} table recibe el nombre de la tabla a consultar
 * @param {string} key recibe la llave primaria de la tabla para ser ordenada
 * @param {string} campo recibe el campo a consultar
 */
async function querryGet(event, table, key, campo) {
    const { getConnection } = require("../../database");
    try {
        const conn = await getConnection();
        const result = await conn.query(`SELECT ${campo} FROM ${table} ORDER BY ${key} DESC`);
        event.returnValue = result;
    } catch (error) {
        console.log("se produjo un error al consultar: \n"+error);
    }

}

module.exports = { querryGet };
