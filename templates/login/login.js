const d = document,
$form = d.querySelector(".login-form"),
$btnData = d.querySelector(".get-data"),
$inputs = d.querySelectorAll(".login-form input")

// --------------------------------------------------------
const createAccount = d.querySelector(".create-account")
// --------------------------------------------------------

$form.addEventListener("submit",e=>{
  e.preventDefault()
  const $formData = new FormData($form),
    name = $formData.get("name"),
    password = $formData.get("password");
    login(name,password)
})


function login(name,password){
  const data = {
    user_name:name,
    password:password
  }
  fetch('http://127.0.0.1:5000/auth/login', {
  method: 'POST',
  headers:{
  'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
  credentials: 'include'
  })
  .then(response=>{
    if (response.status===200){
      return response.json().then(data=>{
        window.location.href = "../main/main.html";
        console.log(data)
      })
    }

    if (response.status===401){
      document.getElementById("message").innerHTML = "Usuario o Contraseña incorrectos"
      // const $formData = new FormData($form)
      $inputs.forEach(input=>{
        input.value = ""
      })
    }
  })
  .catch(error => {
    conosle.log(error)
  });
}

// --------------------------------------------------------
createAccount.addEventListener("click",e=>{
  window.location.href = "../register/register.html"
})
// --------------------------------------------------------
