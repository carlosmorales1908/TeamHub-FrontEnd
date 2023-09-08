const d = document
const $nuevoServer = d.querySelector(".new-server");
const $cerrarModal = d.querySelector(".close-modal")
const $modal = d.querySelector(".nuevo-modal");

$nuevoServer.addEventListener("click", e => {
  e.preventDefault()
  $modal.showModal()
  // alert("ANDA PAYA BOBO")
})

$cerrarModal.addEventListener("click", e => {
  $modal.close()
})
