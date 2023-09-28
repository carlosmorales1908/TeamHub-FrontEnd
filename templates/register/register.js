const form = document.querySelector(".my-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form),
    name = formData.get("name"),
    lName = formData.get("lname"),
    email = formData.get("email"),
    userName = formData.get("user_name"),
    password = formData.get("password"),
    dob = formData.get("dob");

  const url = "http://127.0.0.1:5000/api/users";
  console.log(url);

  const dataToSend = {
    first_name: name,
    last_name: lName,
    email: email,
    user_name: userName,
    password: password,
    date_of_birth: dob,
  };

  const requestOptions = {
    method: "POST",
    body: JSON.stringify(dataToSend),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, requestOptions)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((data) => {
      if (data.error){
        document.getElementById("message").innerHTML = `${data.error.description}`
      } else{
        window.location.href = "../login/login.html";
        // console.log(data);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});
