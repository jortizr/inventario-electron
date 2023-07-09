
const tabContents = document.getElementsByClassName("tab-pane");
const tabList = document.getElementsByClassName("nav-link");
const listDrop = document.getElementsByClassName("dropdown-menu")
const navInventario = document.getElementsByClassName("inv")
const navTutorial = document.getElementsByClassName("tuto")


const tabs = document.getElementById("tabs")


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
//funcion cuando el menu recibe el mouse y activar el desplegable
  tabs.addEventListener("mouseover", (e)=>{
    if(e.target.classList[1] === "dropdown-toggle"){
      if(e.target.innerText === "Inventario"){
        navInventario.dropdown.classList.add("show")
      }
      if(e.target.innerText === "Tutorial"){
        navTutorial.dropdown.classList.add("show")
      }
    }
    if(e.toElement.className == "nav-link" || e.toElement.className == "nav-link active"){
      for (var i = 0; i < listDrop.length; i++) {
       listDrop[i].classList.remove("show");
      }
    }
  })
//desactiva los menus desplegables al salir el mouse al contenedor html
  tabContents.consulta.addEventListener("mouseout", (e)=>{
      for (var i = 0; i < listDrop.length; i++) {
       listDrop[i].classList.remove("show");
      }
  })




