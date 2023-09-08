const d = document;

const $server = d.querySelector(".my-server");
const $serverChanels = d.querySelector(".server-chanles")

$server.addEventListener("click", e => {
  e.preventDefault();
  $serverChanels.classList.toggle("visible");
})