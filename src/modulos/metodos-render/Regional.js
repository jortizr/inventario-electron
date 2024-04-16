/**
 * 
 * @param {*} id 
 */

async function deleteReg(id){
    // idDel=id;
    const respuesta = await mostrarModal("inline-block", "¿Estas seguro de eliminar el registro?");
    if (respuesta) {
      const resp= await window.electronAPI.deleteRG(id)
      console.log(resp.affectedRows);
      getRegional()
      // Aquí ejecutas tu otra línea de código si el usuario aceptó.
    } else {
      console.log('Usuario cerró.');
      // Aquí ejecutas otra acción si el usuario cerró.
    }
  }

module.exports = {deleteReg};