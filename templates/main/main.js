const d = document,
  w = window,
  $ul = d.querySelector(".tools"),
  $fragment=d.createDocumentFragment(),
  $userCard = d.querySelector(".user-card .user-name")

d.addEventListener("DOMContentLoaded", (e) => {
  console.log("inicisate session");
  getProfile();
});

// Funcion para hacer el GET de los datos del usuario que inica sesión
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

// LLamamos la función, como devuelve una promesa con el id del usuario entonces aqui usamos las otras peticiones
getProfile()
  .then((user_id) => {
    console.log(user_id);
    getServidores(user_id)
  })
  .catch((error) => {
    console.log(error);
  });

// Obtenemos los servidores del usuario que inica sesión
function getServidores(user_id) {
  const URL = `http://127.0.0.1:5000/api/user_server/${user_id}`;
  fetch(URL, {
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
      // Inserta de manera dinámica los servidores en el DOM
      console.log(data)
      const servers = data.Servers
      servers.forEach(server=>{
        const $li = d.createElement("li")
        $li.innerHTML=`
        <a href="#" id=${server.server_id}>
            <span class="material-symbols-outlined crear-server" title=${server.server_name}>
                add_circle
            </span>
        </a>
        `
        $fragment.appendChild($li)
      })
      $ul.prepend($fragment)
      $userCard.textContent=`${data.user_name}`
    })
    .catch((error) => {
      console.log(error);
    });
}