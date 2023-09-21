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
  //getUserData(userId);

  getUserAuthenticated();
});

const userName = document.getElementById('user-name')
const serversList = document.getElementById('servers-list');

//http://127.0.0.1:5000/api/all_servers



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
      userId = data.user_id;
      console.log(userId);
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function getServers(){
  let url = apiHost + '/api/all_servers';
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


const btnCreateServer = document.getElementById('btn-create-server');
btnCreateServer.addEventListener('click', function(event){
  event.preventDefault();
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
          return showModalError(response.error.description);
          
          console.error('Error de la API:', response.error.description);
        } else {
          // Procede con la lógica de la aplicación si la respuesta es exitosa
          console.log('Respuesta de la API:', response);
        }
        window.location.href = host + '/templates/main/main.html'
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  else{
    console.log('hay campos sin completar');
  }
  
  

  




  

})








const modalCreateServer = document.getElementById('modalCreateServer');
const createServer = document.getElementById('create_server');
createServer.addEventListener("click", function() {
    modalCreateServer.showModal();
});


  
//          MODAL join server
const modalJoinServer = document.getElementById('modalJoinServer');
const modalText = document.getElementById('modalText');
//const serversList = document.querySelectorAll('.server');

// serversList.forEach(function(server) {
//   server.addEventListener("click", function() {
//     if (server) {
//       let spanTitleIcon = server.querySelector('span.title-icon');
//       var texto = spanTitleIcon.textContent;   
//       console.log(texto);
//       modalText.textContent = `¿Quieres unirte a ${texto}?`
//       modalJoinServer.showModal();
//     }
//   });
// });

//    MODAL Error
const btnModalError = document.getElementById('btn-close-modalError');
const modalError = document.getElementById('modalError');
function showModalError(message) {
  //const errorTitle = document.getElementById('errorTitle');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  modalError.showModal();
}

document.getElementById('btn-close-modalError').addEventListener('click', function () {
  modalError.close();
});

function objectNotEmpty(objeto) {
  for (let clave in objeto) {
    if (objeto.hasOwnProperty(clave)) {
      if (objeto[clave] === undefined || objeto[clave] === null || objeto[clave] === '') {
        return false;
      }
    }
  }
  return true; // Devuelve true si todas las claves tienen valor
}