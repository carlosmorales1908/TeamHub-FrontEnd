
//CODIGO DE PRUEBA PARA CREAR UN USUARIO, FALTA TERMINARLO

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