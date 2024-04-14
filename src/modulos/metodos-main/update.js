/**
 * funcion para actualizar registros de la base de datos
 * @param {event} event recibe el evento de la vista
 * @param {string} data recibe los datos a actualizar
 * @param {string} table recibe la tabla a actualizar
 * @param {string} key recibe el nombre de la llave primaria
 * @param {string} id recibe el id del registro a actualizar
 */
async function querryUpdate(event, data, table, key, id) {
  const { Notification } = require("electron");
  const { getConnection } = require("../../database");
    try {
        const conn = await getConnection();
        await conn.query(`UPDATE ${table} SET ? WHERE ${key}=?`, [data, id]);
        new Notification({
          title: "Actualizacion de registros",
          body: "Regional Actualizada",
        }).show();
      } catch (error) {
        console.log(error);
      }
}

module.exports = { querryUpdate };