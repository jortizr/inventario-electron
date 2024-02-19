// Importar dependencias necesarias
const { getConnection } = require('../database');

async function getRegional(event) {
    const conn = await getConnection();
    const result = await conn.query(
      "SELECT * FROM regional ORDER BY idRegional DESC"
    );
    event.returnValue = result;
  }

async function createRegional(event, regional) {
    try {
      //se trae la conexion a sql
      const conn = await getConnection();
      const result = await conn.query("INSERT INTO regional SET ?", regional);
  
      new Notification({
        title: "Registro Regional",
        body: "se guardado exitosamente",
      }).show();
  
      event.returnValue = result;
    } catch (error) {
      event.returnValue = error;
    }
  }


  async function deleteRegional(event, id){
    try {
      const conn = await getConnection();
      const result = await conn.query('DELETE FROM regional WHERE idRegional= ?', id)
      new Notification({
        title: "Notificacion",
        body: "registro eliminado",
      }).show();
      event.returnValue = result;
    } catch (error) {
      console.log("se produjo un error al eliminar: \n"+error);
    }
  }


  async function updateRegional(event, regional, id) {
    try {
      const conn = await getConnection();
      await conn.query(
        "UPDATE regional SET ? WHERE idRegional=?",
        [regional, id]
      );
      new Notification({
        title: "Actualizacion de registros",
        body: "Regional Actualizada",
      }).show();
    } catch (error) {
      console.log(error);
    }
  }
  


  module.exports= {createRegional, deleteRegional, getRegional}