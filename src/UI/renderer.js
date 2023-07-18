
const mainContent = document.getElementsByClassName("container-fluid");
const tabList = document.getElementsByClassName("nav-link");
const listDrop = document.getElementsByClassName("dropdown-menu")
const navInventario = document.getElementsByClassName("inv")
const navTutorial = document.getElementsByClassName("tuto")
const tabs = document.getElementById("tabs")


//funcion para cambiar de tab
tabs.addEventListener("click", (e)=>{
  
    // Quitar la clase "active" de todas las pestañas
    for (var i = 0; i < tabList.length; i++) {
      tabList[i].classList.remove("active");
      tabList[i].ariaSelected = "false";
    }
    //agrega a los nav-link el active y selected
    e.target.classList.add("active");
    e.target.ariaSelected = "true";
    console.log(e.target.innerText);
    loadPag(e.target.innerText);
})


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
mainContent[0].addEventListener("mouseout", (e)=>{
      for (var i = 0; i < listDrop.length; i++) {
       listDrop[i].classList.remove("show");
      }
})

async function dataSesion(){
    const sesion = await window.electronAPI.sesion()
    document.getElementById("user-name").textContent = sesion[0];
    document.getElementById("user-rol").textContent = sesion[1];
}
dataSesion();

async function loadPag(namePagina){
  const resp = await window.electronAPI.loadPag(namePagina)
  console.log(resp);
}


// fetch('./tabs.html')
//   .then(response => response.text())
//   .then(content => {
//     document.getElementById('tabs').innerHTML = content;
//     dataSesion(); // Llamar a la función después de cargar el contenido de tabs.html
//   });