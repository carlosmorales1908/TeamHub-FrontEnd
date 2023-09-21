const d = document,
  w = window;

d.addEventListener("DOMContentLoaded", (e) => {
  console.log("inicisate session");
  getProfile();
});

function getProfile() {
  const URL = "http://127.0.0.1:5000/auth/profile";
  return fetch(URL, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
      return data.user_id;
    })
    .catch((error) => {
      console.log(error);
    });
}

// la función devuelve una promesa, por lo que manejamos la función como tal para usar el id y hacer las otras peticiones luego
getProfile()
  .then((user_id) => {
    console.log(user_id);
  })
  .catch((error) => {
    console.log(error);
  });