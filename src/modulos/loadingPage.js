

async function loadPag(event, page) {
    const pageIndex = page.toLowerCase();
    //funcion para leer los nombre de los archivos de las vistas
    fs.readdir("../UI/vistas/", (err, archivos) => {
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

module.exports = {loadPag}