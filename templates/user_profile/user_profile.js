// const changePassword = document.querySelector(".change-password");
// const cerrarModal = document.querySelector(".close-modal");
// const form = document.querySelector(".user-form");
const modal = document.querySelector(".nuevo-modal");
const errorMessage = document.querySelector(".error-message");

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

document.addEventListener("click", (e) => {
  // PERMITE EDITAR LOS DATOS DEL FORM
  e.preventDefault();
  if (e.target.matches(".btn-editar")) {
    e.target.previousElementSibling.disabled = false;
  }

  // MANDA LOS DATOS DEL FORM PARA EL UPDATE
  if (e.target.matches(".send-data")) {
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
  }

  if (e.target.matches(".change-password")){
    e.preventDefault()
    errorMessage.classList.add("visible")
    modal.showModal()
  }

  if (e.target.matches(".confirm-modal")){
    e.preventDefault()
    if (inputNewPass.value !== inputConfirmPass.value){
      errorMessage.classList.toggle("visible")
    } else {
      modal.close()
    }
  }

  if (e.target.matches(".close-modal")){
    modal.close()
    inputNewPass.value = ""
    inputConfirmPass.value =""
  }
});