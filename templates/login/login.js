const d = document,
$form = d.querySelector(".login-form"),
$btnData = d.querySelector(".get-data")
// $inputs = d.querySelectorAll(".login-form input")


$btnData.addEventListener("click",e=>{
  e.preventDefault()
  const $formData = new FormData($form),
    name = $formData.get("name"),
    password = $formData.get("password");
    login(name,password)
})

let LOGGED_USER_ID

function login(name,password){
  const data = {
    user_name:name,
    password:password
  }
  fetch('http://127.0.0.1:5000/auth/login', {
  method: 'POST',
  body: JSON.stringify(data),
  headers:{
  'Content-Type': 'application/json'
  }
  })
  .then(response=>{
    if (response.status===200){
      return response.json().then(data=>{
        LOGGED_USER_ID = data.user_id;
        window.location.href = "../main/main.html";
      })
    }
  })
  .catch(error => {
    document.getElementById("message").innerHTML = "An error occurred.";
  });
}