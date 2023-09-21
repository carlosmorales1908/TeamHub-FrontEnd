const d = document,
  w = window,
  $ul = d.querySelector(".tools"),
  $fragment=d.createDocumentFragment(),
  $userCard = d.querySelector(".user-card .user-name")

d.addEventListener("DOMContentLoaded", (e) => {
  console.log("iniciaste session");
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
// Se puede hacer reutilizable pasando un parametro que sea una función y creando otras funciones que necesiten el id del usuario logeado
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
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Error en la solicitud");
    //   }
    //   return response.json();
    // })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      // Inserta de manera dinámica los servidores en el DOM
      console.log(data)
      const servers = data.Servers
      servers.forEach(server=>{
        const $li = d.createElement("li")
        $li.innerHTML=`
        <a href="#" >
            <span class="material-symbols-outlined crear-server" title=${server.server_name} id=${server.server_id}>
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

// Muestra los canales de un servidor, sacando el id del servidor seleccionando un elemento del DOM
// Se usa la misma lógica la hacer click en un canal para traer los mensajes del mismo
d.addEventListener("click",e=>{
  if (e.target.matches("span")){
    const serverID = e.target.id

    const URL = `http://127.0.0.1:5000/api/servers/${serverID}`;
  fetch(URL, {
    method: "GET",
    credentials: "include",
  })
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error("Error en la solicitud");
    //   }
    //   return response.json();
    // })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      console.log(data)
      console.log(data.channels)
    })
    .catch((error) => {
      console.log(error);
    });
  }})