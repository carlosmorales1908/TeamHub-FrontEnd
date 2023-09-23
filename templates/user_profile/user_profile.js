const changePassword = document.querySelector(".change-password");
const cerrarModal = document.querySelector(".close-modal");
const modal = document.querySelector(".nuevo-modal");
const form = document.querySelector(".user-form")

const inputUserName = document.querySelector(".inp-user-name")
const inputName = document.querySelector(".inp-name")
const inputLName = document.querySelector(".inp-lname")
const inputEmail = document.querySelector(".inp-email")
const inputCurrentPass = document.querySelector(".inp-current-pass")

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
/*
form.addEventListener('submit', e=>{
  e.preventDefault()
  console.log("quisiste guardar los cambios")
  const formData = new FormData(form),
    name = formData.get("name"),
    lName = formData.get("lname"),
    email = formData.get("email"),
    userName = formData.get("user-name")

    console.log(name)
    console.log(lName)
    console.log(email)
    console.log(userName)
  })
*/

document.addEventListener("click",e=>{
  e.preventDefault()
  if (e.target.matches("button")){
    e.target.previousElementSibling.disabled = false
  }
})


changePassword.addEventListener("click",e=>{
  e.preventDefault()
  modal.showModal()
})

// cerrarModal.addEventListener("click",e=>{
//   modal.close()
// })