//                VARIABLES GLOBALES
const apiHost = 'http://127.0.0.1:5000'
const host = 'http://127.0.0.1:5501/'
const userName = document.getElementById('user-name');
let userId;
let idServerClicked;


document.addEventListener('DOMContentLoaded', function () {
  getUserAuthenticated();
});



/*************************************************************************************************************************************/
//                                              FUNCIONES PARA HACER PETICIONES A LA API
/*************************************************************************************************************************************/
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
    console.log(userId);
    getUserServers();
  })
    .catch(error => {
      console.error('Error:', error);
      showModalError(error);
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
      console.log('se ejecuta getUserServers');
      renderSidebarServerList(data.Servers);
    })
    .catch((error) => {
      console.log(error);
      showModalError(error);
    });
}

function getChannels(serverId){
  const url = apiHost + '/api/servers/' + serverId;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      console.log(data)
      if(data.hasOwnProperty('channels')){
        renderChannelList(data.channels);
      }
      else{
        //renderNoChannels();
        renderMainMessageText('Este servidor aún no tiene canales.');
        console.log('NO TIENE CANALES');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//  FUNCION PARA CREAR UN CANAL
function createChannel(name, serverId){
  let url = apiHost + '/api/channels';
    console.log(url);

    if(name != ""){
      const data = {
        'channel_name': name,
        'server_id': serverId
    };

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
            window.location.href = host + '/templates/search_server/search_server.html'
        })
        .catch(error => {
            console.error('Error:', error);
            return showModalError(error);
        });
    }
    

}

//  FUNCION PARA CREAR UN SERVIDOR DESDE EL MODAL
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


  


/*************************************************************************************************************************************/
//                                              FUNCIONES PARA REENDERIZAR CONTENIDO EN EL HTML
/*************************************************************************************************************************************/

//        Renderiza la sidebar de lista de servidores
function renderSidebarServerList(servers){
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
        liElement.addEventListener('click', function (event) {
          idServerClicked = server.server_id;
          const channelsSidebar = document.getElementById('channels-sidebar');
          channelsSidebar.classList.remove('hidden');
          getChannels(idServerClicked);
  
        });
        fragTemp.appendChild(liElement);
      });
      const userServers = document.getElementById('servers-list'); 
      userServers.prepend(fragTemp);
}


//         Renderiza la lista de canales de un servidor
function renderChannelList(channelList){
  const channelsContainer = document.getElementById('server-channels');
  emptyingElement(channelsContainer);
  const fragTemp = document.createDocumentFragment();
  channelList.forEach(channel => {
    const liElement = document.createElement('li');
    liElement.innerHTML = `
        <li >
          <a href="#">#${channel.channel_name}</a>
        </li>`;
        fragTemp.appendChild(liElement);
  });
  channelsContainer.prepend(fragTemp);
  
}

function renderNoChannels(){
  const channelsContainer = document.getElementById('server-channels');
  emptyingElement(channelsContainer);
  // const h2Element = document.createElement('h2');
  // h2Element.innerHTML = 'Este servidor aún no tiene canales.';
  const liElement = document.createElement('li');
  liElement.innerHTML = `
  <li >
    <h2>Este servidor aún no tiene canales.</h2>
  </li>`;
  channelsContainer.appendChild(liElement);
}

function renderMainMessageText(message){
  const mainMessage = document.getElementById('mainMessage');
  emptyingElement(mainMessage);
  const h2Element = document.createElement('h2');
  h2Element.textContent = message;
  mainMessage.appendChild(h2Element);
}


/*************************************************************************************************************************************/
//                                                FUNCIONES RELACIONADAS CON LOS MODALS
/*************************************************************************************************************************************/

//            MODAL PARA CREAR SERVIDOR
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


//            MODAL PARA AGREGAR UN CANAL
const newChannel = document.getElementById('new-channel');
newChannel.addEventListener("click", function() {
  console.log('id del sv clickeado: ',idServerClicked);
  showModalNewChannel();
});
function showModalNewChannel(){
  const modalContainer = document.getElementById('newChannelModalContainer');
  const modalHTML = `
    <dialog class="new-modal" id="modalCreateChannel">
      <div class="modal-container">
          <h3>Crear Nuevo Canal</h3>
          <form id="form-new-channel" action="#">
              <input type="text" name="channel_name" id="channel_name" placeholder="Nombre del canal">
              <button id="btn-create-channel" type="submit" class="btn-form-ns">Crear</button>
              <button type="submit" formmethod="dialog" class="btn-form-ns cancel-modal">Cancelar</button>
          </form>
      </div>
    </dialog>`;
    modalContainer.innerHTML = modalHTML;
    const modalCreateChannel = document.getElementById('modalCreateChannel');
    modalCreateChannel.showModal();
    const btnCreateChannel = document.getElementById('btn-create-channel');
    btnCreateChannel.addEventListener('click', function(event){
      console.log('id del sv clickeado: ',idServerClicked);
      event.preventDefault();
      const inputName = document.getElementById('channel_name');
      createChannel(inputName.value, idServerClicked);
    });
};


//            MODAL ERROR
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



/*************************************************************************************************************************************/
//                                                FUNCIONES DE UTILIDAD
/*************************************************************************************************************************************/

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

function emptyingElement(element) {
  while (element.firstChild) {
      element.removeChild(element.firstChild);
  }
}

