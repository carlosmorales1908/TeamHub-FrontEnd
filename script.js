//                VARIABLES GLOBALES
const apiHost = 'http://127.0.0.1:5000'
const host = 'http://127.0.0.1:5501'
const userName = document.getElementById('user-name');
let userId;
let idServerClicked;
let channelClickedId;
let totalMsg;
let intervaloID;
let serversList;
let serverClickedData;

document.addEventListener('DOMContentLoaded', function () {
  getUserAuthenticated();
  const userCard = document.getElementById('user-card');
  userCard.addEventListener('click', function(){
    window.location.href = host + '/templates/user_profile/user_profile.html'
  });
  const btnChat = document.getElementById('send-button');
  btnChat.addEventListener('click', function() {
    createMessage();
  });
  const btnExplore = document.getElementById('explore_servers');
  btnExplore.addEventListener('click', function (event) {
    event.preventDefault();
    showContainer('explore');
    getServers();
  })
  addListenerToJoinModal();
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('keyup', function () {
      const text = searchBar.value.toLowerCase();
      if (text != "") {
          let serversListFiltered = filterServersByName(serversList, text);
          if (serversListFiltered.length > 0) {
              renderServerList(serversListFiltered);
              addListenerToSevers();
          }
          else {
              renderServerNotFound(text);
          }
      }
      else {
          getServers();
      }
  })

});




/*************************************************************************************************************************************/
//                                              FUNCIONES PARA HACER PETICIONES A LA API
/*************************************************************************************************************************************/



//        OBTENER LOS DATOS DEL USUARIO LOGEADO
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

//        OBTENER LOS SERVIDORES DONDE EL USUARIO ESTA REGISTRADO
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

//        OBTENER TODOS LOS SERVIDORES
function getServers() {
  let url = apiHost + '/api/all_servers';
  fetch(url)
      .then(res=>res.ok?res.json():Promise.reject(res))
      .then(data => {
          console.log('se ejecuta getServers');
          renderServerList(data.Servers);
          addListenerToSevers();
          serversList = data.Servers;
      })
      .catch(error => {
          console.error('Error:', error);
          return showModalError(error);
      });
}

//        OBTENER LOS CANALES DE UN SERVIDOR
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

//        OBTENER LOS MENSAJES DE UN CANAL
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
      iniciarIntervalo();
    })
    .catch((error) => {
      console.log(error);
    });
};

//        CREAR UN SERVIDOR DESDE EL MODAL
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
        window.location.reload();
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

//        CREAR UN CANAL
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
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            return showModalError(error);
        });
    }
};

//        CREAR UN MENSAJE
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

//        ELIMINAR UN MENSAJE
function deleteMessage(messageId){
  let url = apiHost + '/api/messages/' + messageId;
  console.log(url);

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json', 
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      console.log('Recurso eliminado exitosamente');
      getMessages(channelClickedId);
    })
    .catch(error => {
      console.error('Error al eliminar el recurso:', error);
    });
};

//        MODIFICAR UN MENSAJE
function updateMessage(message,messageId){
  let url = apiHost + '/api/messages/' + messageId;
  console.log(url);

  const data = {
    message: message
  };
  
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      console.log('Recurso actualizado exitosamente');
      getMessages(channelClickedId);
    })
    .catch(error => {
      console.error('Error al actualizar el recurso:', error);
    });
};

//        TRAER EL TOTAL DE MENSAJES DEL SERVIDOR ACTUAL
function getTotalMsg() {
  let url = apiHost + '/api/total_msgs/' + channelClickedId;
  console.log(url);

  if(channelClickedId==null){
    return clearInterval(intervaloID);
  }
  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then(res=>res.ok?res.json():Promise.reject(res))
    .then((data) => {
      console.log(data)
      if(data.hasOwnProperty('total_msgs')){
        if(totalMsg == data.total_msgs){
          console.log('no hay mensajes nuevos');
        }
        else{
          getMessages(channelClickedId);
        }
      }
      else{
        // //renderNoChannels();
        // const channelsContainer = document.getElementById('server-channels');
        // emptyingElement(channelsContainer);
        // renderNoChannels();
        // renderMainMessageText('Este servidor aún no tiene canales.');
        // console.log('NO TIENE CANALES');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//        REGISTRARSE EN UN SERVIDOR
function registerInServer() {
  let url = apiHost + '/api/join_server';
  console.log(url);

  const data = {
      'user_id': userId,
      'server_id': serverClickedData[0]
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
          window.location.reload();
      })
      .catch(error => {
          console.error('Error:', error);
          return showModalError(error);
      });

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
          changeActiveElement(liElement,'servers');
          const btnAddChannel = document.getElementById('new-channel-container');
          if(server.rol != 'Admin'){
            btnAddChannel.classList.add('hidden');
          }
          else{
            btnAddChannel.classList.remove('hidden');
          }
          idServerClicked = server.server_id;
          channelClickedId = null;
          clearInterval(intervaloID);
          showContainer('main');
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
          <a href="#" id="${channel.channel_id}">#${channel.channel_name}</a>`;
        fragTemp.appendChild(liElement);
        const aElement = liElement.querySelector('a');
        aElement.addEventListener('click', function (){
          changeActiveElement(liElement,'channels');
          channelClickedId = channel.channel_id;
          console.log('SE HIZO CLICK EN EL SERVER CON ID: ',channelClickedId);
          clearInterval(intervaloID);
          getMessages(channelClickedId);
          showContainer('chat');
          console.log(aElement.id);
        })
        
  });
  channelsContainer.prepend(fragTemp);
  
}

//         Renderiza los mensajes de un canal
function renderMessages(messages){
  let contMsg = 0;
  const fragTemp = document.createDocumentFragment();
  messages.forEach(message => {
    contMsg++;
    const divElement = document.createElement('div');
    divElement.classList.add('message');

    const creationDate = new Date(message.creation_date);
    let minutes = creationDate.getMinutes();
    if(minutes<10){
      minutes = `0${minutes}`;
    }
    let hours = creationDate.getHours();
    if(hours<10){
      hours = `0${hours}`;
    }
    const creationDateFormated = `${creationDate.getDate()}/${creationDate.getMonth() + 1}/${creationDate.getFullYear()} - 
    ${hours}:${minutes}`;
    divElement.innerHTML = `
        <div class="msg-header">
            <h4>${message.user_name}</h4>
            <h4>${creationDateFormated}</h4>
        </div>
        <div class="msg-body">
            <p>${message.message}</p>
        </div>`;
    if(userId == message.user_id){
      divElement.classList.add('my-msg');
    }
    divElement.addEventListener('click', function(){
      if(userId == message.user_id){
        showModalEditMessage(message.message, message.message_id);
      }
      else{
        console.log('No autorizados');
        showModalError('Solo puedes modificar tus mensajes.');
      };
      
    })
    fragTemp.appendChild(divElement);
    //fragTemp.prepend(divElement);
  });
  totalMsg=contMsg;
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.appendChild(fragTemp);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

//      RENDERIZA LA VISTA DE TODOS LOS SERVIDORES
function renderServerList(servers) {
  const serversContainer = document.getElementById('servers');
  emptyingElement(serversContainer);
  const fragTemp = document.createDocumentFragment();
  servers.forEach(server => {
      console.log('nombre del sv: ', server.server_name);
      const divElement = document.createElement('div');
      divElement.classList.add('server');
      divElement.innerHTML = `
              <a href="#" class="server" id="${server.server_name}">
                  <div>
                      <span class="material-symbols-outlined" title="${server.description}">
                          crowdsource
                      </span>
                  </div>
                  <h3 id="${server.server_id}">${server.server_name}</h3>
                  <h3>Usuarios: ${server.total_users}</h3>
              </a>`;
      fragTemp.appendChild(divElement);
  });
  serversContainer.prepend(fragTemp);
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

//          Renderiza un mensaje en el mainMessage
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

//            MODAL PARA EDITAR O ELIMINAR UN MENSAJE
function showModalEditMessage(message, messageId){
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
    const msg = document.getElementById('message');
    msg.value=message;
    const modalEditMessage = document.getElementById('modalEditMessage');
    modalEditMessage.showModal();
    //      AL PRESIONAR EL BOTON DE GUARDAR
    const btnUpdateMsg = document.getElementById('btn-update-message');
    btnUpdateMsg.addEventListener('click', function(event){
      event.preventDefault();
      updateMessage(msg.value,messageId);
      modalEditMessage.close();
    });
    //      AL PRESIONAR EL BOTON DE ELIMINAR
    const btnDeleteMsg = document.getElementById('btn-delete-message');
    btnDeleteMsg.addEventListener('click', function (event) {
      event.preventDefault();
      deleteMessage(messageId);
      modalEditMessage.close();
    });
};

//          MODAL JOIN SERVER
function addListenerToSevers() {
  const modalJoinServer = document.getElementById('modalJoinServer');
  const modalText = document.getElementById('modalText');
  const serversListElement = document.querySelectorAll('.server');
  serversListElement.forEach(function (server) {
      server.addEventListener("click", function () {
          if (server) {
              let h3Element = server.querySelector('h3');
              var texto = h3Element.textContent;
              modalText.textContent = `¿Quieres unirte a ${texto}?`
              serverClickedData = [parseInt(h3Element.id), `${texto}`];
              console.log('dataSave: ', serverClickedData);
              modalJoinServer.showModal();
          };
      });
  });
};


function addListenerToJoinModal() {
  const btnJoinServer = document.getElementById('btn-join-server');
  btnJoinServer.addEventListener('click', function (event) {
      event.preventDefault();
      registerInServer()
  });
}
//            MODAL PARA MOSTRAR UN ERROR
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

function filterServersByName(servers, name) {
  let listData = [];
  for (let i = 0; i < servers.length; i++) {
      console.log(servers[i]);
      if (servers[i].server_name.toLowerCase().includes(name)) {
          listData.push(servers[i]);
      }
  }
  return listData;
}

function renderServerNotFound(name) {
  const serversContainer = document.getElementById('servers');
  emptyingElement(serversContainer);
  const divElement = document.createElement('div');
  divElement.classList.add('message-no-found');
  divElement.innerHTML = `
          <h2>No se ha encontrado el servidor con el nombre: "${name}"</h2>
          <h2>Prueba con otro nombre</h2>
          `;
  serversContainer.appendChild(divElement);
}

function iniciarIntervalo() {
  // Establece el intervalo de tiempo en milisegundos (en este caso, 3 segundos)
  const intervalo = 5000; // 3000 milisegundos = 3 segundos

  // Inicia el intervalo y almacena el ID del intervalo
  intervaloID = setInterval(getTotalMsg, intervalo);

  // Puedes devolver el ID del intervalo si deseas detenerlo posteriormente desde otro lugar
  return intervaloID;
}

function showContainer(container){
  const exploreServersContainer = document.getElementById('explore-servers-container');
  const mainMessage = document.getElementById('mainMessage');
  const chatContainer = document.getElementById('chat-container');
  switch (container) {
    case 'explore':
      exploreServersContainer.classList.remove('hidden');
      mainMessage.classList.add('hidden');
      chatContainer.classList.add('hidden');
      break;
    case 'main':
      mainMessage.classList.remove('hidden');
      exploreServersContainer.classList.add('hidden');
      chatContainer.classList.add('hidden');
      break;
    case 'chat':
      chatContainer.classList.remove('hidden');
      exploreServersContainer.classList.add('hidden');
      mainMessage.classList.add('hidden');
      break;
  }
}

function changeActiveElement(element, sidebar){
  if(sidebar == 'servers'){
    const serverListBar = document.getElementById('servers-list');
    const liElements = serverListBar.querySelectorAll('li');
    liElements.forEach(li => {
      if (li.classList.contains('active')) {
        const spanElement = li.querySelector('span');
        spanElement.classList.remove('active');
        li.classList.remove('active');
      }
    });
    element.classList.add('active');
    const newSpanElement = element.querySelector('span');
    newSpanElement.classList.add('active');
  }
  else if(sidebar == 'channels'){
    const channelListBar = document.getElementById('server-channels');
    const liElements = channelListBar.querySelectorAll('li');
    liElements.forEach(li => {
      if (li.classList.contains('active')) {
        const aElement = li.querySelector('a');
        aElement.classList.remove('active');
        li.classList.remove('active');
      }
    });
    element.classList.add('active');
    const newAElement = element.querySelector('a');
    newAElement.classList.add('active');
  }
  
}
