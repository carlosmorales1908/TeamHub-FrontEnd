//                VARIABLES GLOBALES
const apiHost = 'http://127.0.0.1:5000'
const host = 'http://127.0.0.1:5501'
const userName = document.getElementById('user-name');
let userId;
let idServerClicked;
let channelClickedId;

document.addEventListener('DOMContentLoaded', function () {
  getUserAuthenticated();
  const btnChat = document.getElementById('send-button');
  btnChat.addEventListener('click', function() {
    createMessage();
  })
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
  console.log('se ejecuta getUserServers');
  const url = apiHost + '/api/user_server/' + userId;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      // Inserta de manera dinámica los servidores en el DOM
      if(data.hasOwnProperty('error')){
        console.log(data.error);
        showModalError(data.error.description);
      }
      else{
        renderSidebarServerList(data.Servers);
      }
      console.log(data)
      
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
        const channelsContainer = document.getElementById('server-channels');
        emptyingElement(channelsContainer);
        renderNoChannels();
        renderMainMessageText('Este servidor aún no tiene canales.');
        console.log('NO TIENE CANALES');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//OBTENER LOS MENSAJES DE UN CANAL
function getMessages(channelId){
  const url = apiHost + '/api/channels/' + channelId;
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      console.log(data);
      const messagesContainer = document.getElementById('chat-messages');
      emptyingElement(messagesContainer);
      if(data.hasOwnProperty('messages')){
        renderMessages(data.messages);
      }
      else{
        console.log('NO TIENE mensajes');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

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
};

//  FUNCION PARA CREAR UN MENSAJE
function createMessage(){
  let url = apiHost + '/api/messages';
  console.log(url);
  const input = document.getElementById('message-input');
  let msg = input.value;

  if(msg != ""){
    const data = {
      'message': msg,
      'channel_id': channelClickedId,
      'user_id': userId
  };
  console.log(data);

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
            const inputEntry = document.getElementById('message-input');
            inputEntry.value = "";
            getMessages(channelClickedId);
              // Procede con la lógica de la aplicación si la respuesta es exitosa
              console.log('Respuesta de la API:', response);
          }
          //window.location.href = host + '/templates/search_server/search_server.html'
      })
      .catch(error => {
          console.error('Error:', error);
          return showModalError(error);
      });
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
  const mainMessage = document.getElementById('mainMessage');
  const chatContainer = document.getElementById('chat-container');

  emptyingElement(channelsContainer);
  const fragTemp = document.createDocumentFragment();
  channelList.forEach(channel => {
    const liElement = document.createElement('li');
    liElement.innerHTML = `
          <a href="#" id="${channel.channel_id}">#${channel.channel_name}</a>`;
        fragTemp.appendChild(liElement);
        const aElement = liElement.querySelector('a');
        aElement.addEventListener('click', function (){
          channelClickedId = channel.channel_id;
          console.log('SE HIZO CLICK EN EL SERVER CON ID: ',channelClickedId);
          mainMessage.classList.add('hidden');
          getMessages(channelClickedId);
          chatContainer.classList.remove('hidden');
          console.log(aElement.id);
        })
        
  });
  channelsContainer.prepend(fragTemp);
  
}

//  Renderiza los mensajes
function renderMessages(messages){
  const fragTemp = document.createDocumentFragment();
  messages.forEach(message => {
    const divElement = document.createElement('div');
    divElement.id = message.user_id;
    const creationDate = new Date(message.creation_date);
    const creationDateFormated = `${creationDate.getDate()}/${creationDate.getMonth() + 1}/${creationDate.getFullYear()} - 
    ${creationDate.getHours()}:${creationDate.getMinutes()}`;
    divElement.innerHTML = `
        <div class="msg-header">
            <h4 id="${message.message_id}">${message.user_name}</h4>
            <h4>${creationDateFormated}</h4>
        </div>
        <div class="msg-body">
            <p>${message.message}</p>
        </div>`;
    divElement.addEventListener('click', function(){
      if(userId == message.user_id){
        showModalEditMessage();
      }
      else{
        console.log('No autorizados');
      };
      
    })
    //fragTemp.appendChild(divElement);
    fragTemp.prepend(divElement);
  });
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.appendChild(fragTemp);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderNoChannels(){
  const channelsContainer = document.getElementById('server-channels');
  emptyingElement(channelsContainer);
  // const h2Element = document.createElement('h2');
  // h2Element.innerHTML = 'Este servidor aún no tiene canales.';
  const liElement = document.createElement('li');
  liElement.innerHTML = `
  <li class="msg-server-empty">
    <small>Este servidor aún no tiene canales.</small>
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

//            MODAL PARA EDITAR UN MENSAJE
function showModalEditMessage(){
  const modalContainer = document.getElementById('editMessageModalContainer');
  const modalHTML = `
    <dialog class="new-modal" id="modalEditMessage">
      <div class="modal-container">
          <h3>Mensaje</h3>
          <form id="form-message" action="#">
              <textarea id="message" name="message" rows="4" cols="50"></textarea>
              <button id="btn-update-message" type="submit" class="btn-form-ns">Guardar</button>
              <button id="btn-delete-message" type="submit" class="btn-form-ns">Eliminar</button>
              <button type="submit" formmethod="dialog" class="btn-form-ns cancel-modal">Cancelar</button>
          </form>
      </div>
    </dialog>`;
    modalContainer.innerHTML = modalHTML;
    const modalEditMessage = document.getElementById('modalEditMessage');
    modalEditMessage.showModal();
    // const btnCreateChannel = document.getElementById('btn-create-channel');
    // btnCreateChannel.addEventListener('click', function(event){
    //   console.log('id del sv clickeado: ',idServerClicked);
    //   event.preventDefault();
    //   const inputName = document.getElementById('channel_name');
    //   createChannel(inputName.value, idServerClicked);
    // });
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

