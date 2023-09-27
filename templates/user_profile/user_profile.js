const form = document.querySelector(".user-form");
const modal = document.querySelector(".nuevo-modal");
const errorMessage = document.querySelector(".error-message");

// ------------------------------------------------------------
const btnEditar = document.querySelectorAll(".btn-editar")
const btnConfirmarCambios = document.querySelector(".send-data")
const changePassword = document.querySelector(".change-password");
const btnConfirmarPass = document.querySelector(".confirm-modal")
const cerrarModal = document.querySelector(".cancel-modal");
// ------------------------------------------------------------
const file = document.getElementById("foto");
const defaultImg = "../../assets/images/avatar_prueba.jpg"
const userAvatar = document.querySelector(".user-avatar")
// ------------------------------------------------------------

const inputUserName = document.querySelector(".inp-user-name");
const inputName = document.querySelector(".inp-name");
const inputLName = document.querySelector(".inp-lname");
const inputEmail = document.querySelector(".inp-email");
const inputCurrentPass = document.querySelector(".inp-current-pass");
const inputNewPass = document.querySelector(".new-pass");
const inputConfirmPass = document.querySelector(".confirm-new-pass");

function getUserData() {
  const URL = `http://127.0.0.1:5000/auth/profile`;
  return fetch(URL, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

// FUNCION PARA EL UPDATE
function updateUser(user_id) {
  const url = `http://127.0.0.1:5000/api/users/${user_id}`;
  console.log(url);

  const dataToSend = {
    first_name: inputName.value,
    last_name: inputLName.value,
    email: inputEmail.value,
    user_name: inputUserName.value,
  };

  if (inputNewPass.value === "" && inputConfirmPass.value === "") {
    dataToSend.password = inputCurrentPass.value;
  } else if (inputNewPass.value === inputConfirmPass.value) {
    dataToSend.password = inputNewPass.value;
  }

  if (userAvatar.src !== defaultImg){
    dataToSend.profile_picture = userAvatar.src
  }

  const requestOptions = {
    method: "PUT",
    body: JSON.stringify(dataToSend),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, requestOptions)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      window.location.href = "../main/main.html";
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", (e) => {
  getUserData()
    .then((data) => {
      inputUserName.value = data.user_name;
      inputUserName.disabled = true;
      inputName.value = data.first_name;
      inputName.disabled = true;
      inputLName.value = data.last_name;
      inputLName.disabled = true;
      inputEmail.value = data.email;
      inputEmail.disabled = true;
      inputCurrentPass.value = data.password;
    })
    .catch((error) => {
      console.log(error);
    });
});

// -----------------------------------------------------------------------------------------
// PERMITE EDITAR LOS DATOS DEL FORM
btnEditar.forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault()
    e.target.previousElementSibling.disabled = false;
  })
})

// MANDA LOS DATOS DEL FORM PARA EL UPDATE
form.addEventListener('submit',e=>{
  e.preventDefault()
  console.log("quisiste mandar data");
    getUserData()
      .then((data) => {
        const userID = data.user_id;
        updateUser(userID);
        console.log(userID);
      })
      .catch((error) => {
        console.log(error);
      });
})

// ABRE MODAL PARA CAMBIAR PASSWORD
changePassword.addEventListener("click",e=>{
  e.preventDefault()
  errorMessage.classList.add("visible")
  modal.showModal()
})

// CONFIRMA CAMBIO DE CONTRASEÑA
btnConfirmarPass.addEventListener("click",e=>{
  e.preventDefault()
    if (inputNewPass.value !== inputConfirmPass.value){
      errorMessage.classList.toggle("visible")
    } else {
      modal.close()
    }
})

// CIERRA EL MODAL DEL PASSWORD
cerrarModal.addEventListener("click",e=>{
  modal.close()
  inputNewPass.value = ""
  inputConfirmPass.value =""
})

// -----------------------------------------------------------------------------------------

// PREVIEW DE LA FOTO DE PERFIL
file.addEventListener("change",e=>{
  if(e.target.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      userAvatar.src = e.target.result;
    }
    reader.readAsDataURL(e.target.files[0])
  } else{
    userAvatar.src = defaultImg
  }
})

// TO DO: AGREGAR LA LOGICA PARA CONVERTIR LA IMAGEN A BLOB Y MANDARLA A LA BD

// -----------------------------------------------------------------------------------------