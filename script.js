const apiHost = 'http://127.0.0.1:5000'
const host = 'http://127.0.0.1:5501/'

// const d = document;

// const $server = d.querySelector(".my-server");
// const $serverChanels = d.querySelector(".server-chanles")

// $server.addEventListener("click", e => {
//   e.preventDefault();
//   $serverChanels.classList.toggle("visible");
// })


let userId;

document.addEventListener('DOMContentLoaded', function () {
  getUserAuthenticated();
});

const userName = document.getElementById('user-name')

//http://127.0.0.1:5000/api/all_servers




function getUserData(id){
  let url = apiHost + '/api/users/' + id;
  console.log(url);
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      userName.textContent = data.user_name;
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function getUserAuthenticated(){
  let url = apiHost + '/auth/profile';
  console.log(url);
  fetch(url, {
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
    console.log('data: ',data);
    userName.textContent = data.user_name;
    userId = data.user_id;
    getUserServers();
    console.log(userId);
  })
    .catch(error => {
      console.error('Error:', error);
    });
}



// Obtenemos los servidores del usuario que inica sesión
function getUserServers() {
  const url = apiHost + '/api/user_server/' + userId;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      // Inserta de manera dinámica los servidores en el DOM
      console.log(data)
      const servers = data.Servers
      const fragTemp = document.createDocumentFragment();
      servers.forEach(server=>{
        const liElement = document.createElement("li");
        liElement.innerHTML=`
        <a href="#" >
            <span class="material-symbols-outlined my-server crear-server" title=${server.server_name} id=${server.server_id}>
                dns
            </span>
        </a>
        <small class="server_name">${server.server_name}</small>
        `;
        fragTemp.appendChild(liElement);
      });
      const userServers = document.getElementById('servers-list'); 
      userServers.prepend(fragTemp);
    })
    .catch((error) => {
      console.log(error);
    });
}



//          FUNCION PARA CREAR UN SERVIDOR DESDE EL MODAL

function createServer(){
  let url = apiHost + '/api/servers';
  console.log(url);

  const form = document.getElementById('form-new-server');
  const formData = new FormData(form);

  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log(data);
  if(objectNotEmpty(data)){
    data['user_id'] = userId;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data)
    };
  
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud no fue exitosa');
        }
        return response.json();
      })
      .then(response => {
        if (response.error) {
          // Maneja el error de la API
          console.error('Error de la API:', response.error.description);
          return showModalError(response.error.description);
        } else {
          // Procede con la lógica de la aplicación si la respuesta es exitosa
          console.log('Respuesta de la API:', response);
        }
        window.location.href = host + '/templates/main/main.html'
      })
      .catch(error => {
        console.error('Error:', error);
        return showModalError(error);
      });
  }
  else{
    console.log('hay campos sin completar');
  }
  
};


  
//          MODAL JOIN SERVER
const modalJoinServer = document.getElementById('modalJoinServer');
const modalText = document.getElementById('modalText');
const serversListElement = document.querySelectorAll('.server');
serversListElement.forEach(function(server) {
  server.addEventListener("click", function() {
    if (server) {
      let spanTitleIcon = server.querySelector('span.title-icon');
      var texto = spanTitleIcon.textContent;   
      console.log(texto);
      modalText.textContent = `¿Quieres unirte a ${texto}?`
      modalJoinServer.showModal();
    }
  });
});


// MODAL CREAR SERVIDOR

const newServer = document.getElementById('create_server');
newServer.addEventListener("click", function() {
  showModalNewServer();
});
function showModalNewServer(){
  const modalContainer = document.getElementById('newServerModalContainer');
  const modalHTML = `
    <dialog class="new-modal" id="modalCreateServer">
      <div class="modal-container">
          <h3>Crear Nuevo Servidor</h3>
          <form id="form-new-server" action="#">
              <input type="text" name="server_name" id="server_name" placeholder="Nombre del servidor">
              <input type="text" name="description" id="description" placeholder="Breve descripción del servidor">
              <button id="btn-create-server" type="submit" class="btn-form-ns">Crear</button>
              <button type="submit" formmethod="dialog" class="btn-form-ns cancel-modal">Cancelar</button>
          </form>
      </div>
    </dialog>`;
    modalContainer.innerHTML = modalHTML;
    const modalCreateServer = document.getElementById('modalCreateServer');
    modalCreateServer.showModal();
    const btnCreateServer = document.getElementById('btn-create-server');
    btnCreateServer.addEventListener('click', function(event){
      event.preventDefault();
      createServer();
    });
};


//    MODAL ERROR
function showModalError(message) {
  const modalContainer = document.getElementById('errorModalContainer');
  const modalHTML= `
  <dialog class="new-modal" id="modalError">
    <div class="modal-container">
        <h3 id="errorTitle">Ha ocurrido un error</h3>
        <p id="errorMessage">${message}</p>
        <button class="btn-form-ns" id="btn-close-modalError">Aceptar</button>
    </div>
  </dialog>`;
  modalContainer.innerHTML = modalHTML;
  const btnModalError = document.getElementById('btn-close-modalError');
  const modalError = document.getElementById('modalError');
  btnModalError.addEventListener('click', function () {
    modalError.close();
  });
  modalError.showModal();
}


//                                                        FUNCIONES DE UTILIDAD


function objectNotEmpty(object) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      if (object[key] === undefined || object[key] === null || object[key] === '') {
        return false;
      }
    }
  }
  return true; // Devuelve true si todas las claves tienen valor
};


