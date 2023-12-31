//contexto de comunicacion entre procesos 
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  autheLogin: (user) => ipcRenderer.invoke("autentication-login", user),
  sesion: ()=> ipcRenderer.invoke("data-user"),
  loadPag: (namePagina)=> ipcRenderer.sendSync("load-page", namePagina),
  createReg: (regional)=> ipcRenderer.sendSync("create-regional", regional),
  getRegional: () => ipcRenderer.sendSync("get-regional"), 
  updateRegional: (regional, id)=> ipcRenderer.send("update-regional", regional, id),
  messajeError: (msj) => ipcRenderer.send("messaje", msj),
  deleteRG: (id)=> ipcRenderer.sendSync("delete-data", id)
})