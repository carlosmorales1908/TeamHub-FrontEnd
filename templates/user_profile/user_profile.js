const d = document;
const $changePassword = d.querySelector(".change-password");
const $cerrarModal = d.querySelector(".close-modal");
const $modal = d.querySelector(".nuevo-modal");

$changePassword.addEventListener("click",e=>{
  e.preventDefault()
  $modal.showModal()
})

$cerrarModal.addEventListener("click",e=>{
  $modal.close()
})