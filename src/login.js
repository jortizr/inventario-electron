const loginForm = document.getElementById("loginForm");
const user = document.getElementById("user");
const password = document.getElementById("password");

loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const autentication = {
        user: user.value,
        password: password.value
    }
    console.log(!user.value === '');
    if(user.value != '' && password.value !=''){
        const resp = await window.electronAPI.autheLogin(autentication);
        console.log(resp);
    }else{
        alert("ingresa el usuario y contraseña")
        user.focus();
    }
    

})
