const mainContent = document.getElementsByClassName("container-fluid");
const tabList = document.getElementsByClassName("nav-link");
const listDrop = document.getElementsByClassName("dropdown-menu")
const navInventario = document.getElementsByClassName("inv")
const navTutorial = document.getElementsByClassName("tuto")
const mainPage = document.getElementById("main-page")
const tabs = document.getElementById("tabs")
const dropdownItem = document.getElementsByClassName("dropdown-item")
const divRender = document.getElementById("render")
const modal = document.getElementById("ventanaModal")
const btnModal = document.getElementById("btnModal")
const msjModal = document.getElementById("body-modal")

let editingStatus = false;
let regionals =[];
let tabActive = tabs.getElementsByClassName("active");

//funcion para cambiar de tab
tabs.addEventListener("click", (e)=>{
    e.preventDefault();
    // Quitar la clase "active" de todas las pestañas
    desactiveSelect(tabList);
    desactiveSelect(dropdownItem);
    //agrega a los nav-link el active y selected
    e.target.classList.add("active");
    e.target.ariaSelected = "true";
    loadPag(e.target.innerText);
})

//funcion para desactivar los botones si otro esta activo
function desactiveSelect(elemento){
  for (var i = 0; i < elemento.length; i++) {
    elemento[i].classList.remove("active");
    elemento[i].ariaSelected = "false";
  }
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
mainPage.addEventListener("mouseout", (e)=>{
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
dataSesion();
//carga las paginas desde el main
async function loadPag(namePagina){
  const page = await window.electronAPI.loadPag(namePagina)
  document.getElementById("main-page").innerHTML = page;
}

//funcion para renderizar la regionales
function renderRegional(region) {
  //aqui resetea el elemento para pintarlo nuevamente
  divRender.innerHTML = "";
  
  //recorremos el array y lo pitamos en el html
  region.forEach((regional) => {
    divRender.innerHTML += `
      <div class="card card-body my-1 animate__animated animate__fadeInLeft">
        <h4>Codigo regional: ${regional.idRegional}</h4>
        <p><strong>Nombre:</strong> ${regional.Nombre_Regional}</p>
        <p>
          <button class="btn btn-danger" onclick="deleteRegional('${regional.idRegional}')">
            DELETE</button>
          <button class="btn btn-secondary" onclick="editRegional('${regional.idRegional}')">EDITAR</button>
        </p>
      </div>
    `;
  });
}

//funcion para traer los datos guardados
const getRegional = async () => {
  regionals = await window.electronAPI.getRegional();
  renderRegional(regionals);
  console.log(divRender);
};
//eventos de los formularios cargados
document.addEventListener("submit", (e)=>{
  e.preventDefault()
  const regionalID = document.getElementById("cod-reg");
  const regionalName = document.getElementById("name-reg");
  const formReg = document.getElementById("regionalForm")
  //este if se activa segun el tab activo
  if(tabActive[0].innerText == "Regional"){
    //si no esta editando entra en el if
    if(!editingStatus){
      regRegional(regionalID, regionalName)
      formReg.reset();
      regionalID.focus()
      getRegional()
    }else{
      //await window.electronAPI.updateRegional(data)

      editingStatus = false;
      document.getElementById("cod-reg").disabled = false;
    }
  }
})

//
tabs.addEventListener("click", async (e)=>{
  if(tabActive[0].innerText == "Regional"){
    await getRegional();
  }
})




//valida al inicio si el tab esta ativado para cargar la pagina de inicio
if(tabActive[0].innerText == "Inicio"){
  loadPag(tabActive[0].innerText)
  
}


//funcion para registrar la regional
async function regRegional(id, nameReg){
  const regional ={
    idRegional: id.value,
    Nombre_Regional: nameReg.value
  }
  const resp = await window.electronAPI.createReg(regional);
  const msj = resp.toString()

  if (msj.includes("ER_DUP_ENTRY")) {
    modal.style.display = "block"
    msjModal.textContent = "Esta regional ya existe"
  }


}

//funcion para editar regional
async function editRegional(id){
  id = parseInt(id)
  let indice =regionals.findIndex((elemento)=> elemento.idRegional === id)
  document.getElementById("cod-reg").value = regionals[indice].idRegional;
  document.getElementById("name-reg").value = regionals[indice].Nombre_Regional;
  document.getElementById("cod-reg").disabled = true
  editingStatus = true;
}








function deleteID(id){

}

btnModal.addEventListener("click", (e)=>{
  modal.style.display = "none";
  msjModal.textContent = "";
  document.getElementById("cod-reg").focus()
})