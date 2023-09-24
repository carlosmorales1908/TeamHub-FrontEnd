const changePassword = document.querySelector(".change-password");
const cerrarModal = document.querySelector(".close-modal");
const modal = document.querySelector(".nuevo-modal");
const form = document.querySelector(".user-form")

const inputUserName = document.querySelector(".inp-user-name")
const inputName = document.querySelector(".inp-name")
const inputLName = document.querySelector(".inp-lname")
const inputEmail = document.querySelector(".inp-email")
const inputCurrentPass = document.querySelector(".inp-current-pass")
const inputNewPass = document.querySelector(".new-pass")

document.addEventListener("DOMContentLoaded",e=>{
  const URL = `http://127.0.0.1:5000/auth/profile`;
  fetch(URL, {
    method: "GET",
    credentials: "include",
  })
  .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      inputUserName.value = data.user_name
      inputUserName.disabled = true
      inputName.value = data.first_name
      inputName.disabled = true
      inputLName.value = data.last_name
      inputLName.disabled = true
      inputEmail.value = data.email
      inputEmail.disabled = true
      inputCurrentPass.value = data.password
    })
})

//        TODO

document.addEventListener("click",e=>{
  e.preventDefault()
  if (e.target.matches(".btn-editar")){
    e.target.previousElementSibling.disabled = false
  }

  //  FALTA CAPTURAR EL ID
  if (e.target.matches(".get-data")){
    const url = 'http://127.0.0.1:5000/api/users/id';
    console.log(url);

    const dataToSend = {
      first_name: inputName.value,
      last_name: inputLName,
      email: inputEmail,
      user_name: inputUserName,
      password: inputNewPass
    };

    const requestOptions = {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      }
    };

    fetch(url, requestOptions)
      .then(res=>res.ok?res.json():Promise.reject(res))
      .then(data => {
        window.location.href = "../main/main.html";
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
})


//        SE PUEDE METER TODO EN EL EVENT DE ARRIBA

// changePassword.addEventListener("click",e=>{
//   e.preventDefault()
//   modal.showModal()
// })

// cerrarModal.addEventListener("click",e=>{
//   modal.close()
// })