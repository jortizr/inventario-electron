
const tabContents = document.getElementsByClassName("tab-pane");
const tabList = document.getElementsByClassName("nav-link");

//funcion para cambiar de tab
function changeTab(tabs) {
    // Quitar la clase "active" de todas las pestañas
    for (var i = 0; i < tabList.length; i++) {
      tabList[i].classList.remove("active");
      tabList[i].ariaSelected = "false";
    }
    //agrega a los nav-link el active y selected
    tabs.target.classList.add("active");
    tabs.target.ariaSelected = "true";
  
    //activar los contenidos de los tab
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.remove("active", "show");
    }
    //obtenemos la url o id al que quiere visualizar el tab
    const section = document.getElementById(tabs.target.hash.substring(1));
    //activamos el contenido a visualizar
    section.classList.add("active", "show");
  }