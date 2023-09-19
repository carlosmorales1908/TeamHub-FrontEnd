const host = 'http://127.0.0.1:5000'


// const d = document;

// const $server = d.querySelector(".my-server");
// const $serverChanels = d.querySelector(".server-chanles")

// $server.addEventListener("click", e => {
//   e.preventDefault();
//   $serverChanels.classList.toggle("visible");
// })

document.addEventListener('DOMContentLoaded', function () {
  //getUserData(2);

});

const userName = document.getElementById('user-name')



const btnCreateServer = document.getElementById('btn-create-server');
btnCreateServer.addEventListener('click', function(){
  let url = host + '/api/servers';
  console.log(url);

  const dataToSend = {
    server_name: 'Ejemplo',
    description: 'esta es la descripcion',
    user_id: 1
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(dataToSend)
  };

  fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

})

/*
const btnCreateUser = document.getElementById('btn');
btnCreateUser.addEventListener('click', function(){
  let url = host + '/api/users';
  //console.log(url);

  const dataToSend = {
    first_name: 'Daniel',
    last_name: 'Morales',
    email: 'daniel@gmail.com',
    user_name: 'CHINIs92',
    password: '123456789',
    date_of_birth: '1992-01-01'
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSend)
  };

  fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Hubo un error al enviar los datos.');
      }
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

})
*/

function getUserData(id){
  let url = host + '/api/users/' + id;
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


function getServers(){
  let url = host + '/api/all_servers';
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud no fue exitosa');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//          MODAL create server
const modalCreateServer = document.getElementById('modalCreateServer');
const createServer = document.getElementById('create_server');

createServer.addEventListener("click", function() {
    modalCreateServer.showModal();
});
  
//          MODAL join server
const modalJoinServer = document.getElementById('modalJoinServer');
const modalText = document.getElementById('modalText');
const serversList = document.querySelectorAll('.server');

serversList.forEach(function(server) {
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