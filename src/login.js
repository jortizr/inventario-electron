const loginForm = document.getElementById("loginForm");
const user = document.getElementById("user");
const password = document.getElementById("password");

loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const autentication = {
        user: user.value,
        password: password.value
    }
 
    if(user.value != '' && password.value !=''){
        await window.electronAPI.autheLogin(autentication);
    }

})
