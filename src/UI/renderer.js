const mainContent = document.getElementsByClassName("container-fluid");
const tabList = document.getElementsByClassName("nav-link");
const listDrop = document.getElementsByClassName("dropdown-menu")
const navInventario = document.getElementsByClassName("inv")
const navTutorial = document.getElementsByClassName("tuto")
const mainPage = document.getElementById("main-page")
const tabs = document.getElementById("tabs")

let tabActive;
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
    tabActive = e.target.innerText
    loadPag(e.target.innerText);
})



//funcion cuando el menu recibe el mouse y activar el desplegable
tabs.addEventListener("mouseover", (e)=>{
    e.preventDefault();
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
mainPage.addEventListener("mouseout", (e)=>{
  e.preventDefault();
      for (var i = 0; i < listDrop.length; i++) {
       listDrop[i].classList.remove("show");
      }
})
//datos de usuario
async function dataSesion(){
    const sesion = await window.electronAPI.sesion()
    document.getElementById("user-name").textContent = sesion[0];
    document.getElementById("user-rol").textContent = sesion[1];
}
//dataSesion();
//carga las paginas desde el main
async function loadPag(namePagina){
  const page = await window.electronAPI.loadPag(namePagina)
  document.getElementById("main-page").innerHTML = page;
}



document.addEventListener("submit", (e)=>{
  e.preventDefault()
  const regionalID = document.getElementById("cod-reg");
  const regionalName = document.getElementById("name-reg");
  if(tabActive == "Regional"){
    const formReg = document.getElementById("regionalForm")
    regRegional(regionalID, regionalName)
    formReg.reset();
    regionalID.focus()
  }
})

//funcion para registrar la regional
async function regRegional(id, nameReg){
  const regional ={
    idRegional: id.value,
    Nombre_Regional: nameReg.value
  }
  await window.electronAPI.createReg(regional);

}







// if(regionalForm !== null){
//   console.log(regionalForm);
//   regionalForm.addEventListener("submit", (e) => {
//     e.preventDefault()
//     const regional ={
//       codigo: regionalID.value,
//       name: regionalName.value
//     }
//     console.log(regional);
//     // Tu lógica de manejo del formulario aquí


//   });
// }


//!las dos formas 

//!2da forma
// document.addEventListener('submit', (e) => {
//   const regionalForm = document.getElementById('tuFormularioId');
//   if (e.target === regionalForm) {
//     e.preventDefault();
//     // Tu lógica de manejo del formulario aquí
//   }
// });
