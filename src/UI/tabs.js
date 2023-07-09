fetch('./tabs.html')
  .then(response => response.text())
  .then(content => {
    document.getElementById('tabs').innerHTML = content;
    dataSesion();
  });


async function dataSesion(){
  const sesion = await window.electronAPI.sesion()
  document.getElementById("user-name").textContent = sesion[0];
  document.getElementById("user-rol").textContent = sesion[1];
}
