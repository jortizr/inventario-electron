/**
 * funcion para desactivar los botones del menu si esta activo un boton seleccionado
 * @param {Array} elemento recibe un array con los elementos a desactivar
 */
function desactiveSelect(elemento){
    for (var i = 0; i < elemento.length; i++) {
      elemento[i].classList.remove("active");
      elemento[i].ariaSelected = "false";
    }
}

module.exports = {desactiveSelect};