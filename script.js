// const d = document;

// const $server = d.querySelector(".my-server");
// const $serverChanels = d.querySelector(".server-chanles")

// $server.addEventListener("click", e => {
//   e.preventDefault();
//   $serverChanels.classList.toggle("visible");
// })




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