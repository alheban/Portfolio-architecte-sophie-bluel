import { YourApiClass } from "./api.js";
import { createElement, addClass,removeClass,ajoutLogout } from "./utils.js";
import { divFiltre } from "./dom.js";
export function isAuthe() {

  let token = localStorage.getItem("token");
  const maDivBarreEdit = document.querySelector(".main_barre_edition");
  const maDivBtnModif = document.querySelector(".btn_modifier");

  const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      toggleModal();
      resetLabelPhoto();
    })
  );

  const modalContainer = document.querySelector(".modal-container");
  const modalAdd = document.querySelector(".modal-add");
  const modal = document.querySelector(".modal");

  function toggleModal() {
    modalContainer.classList.toggle("active");
    if (modalContainer.classList.contains("active")) {
      afficherModal();
    } else {
      effacerModal();
    }
  }

  function afficherModal() {
    addClass(modal, "block");
    removeClass(modal, "none");

    removeClass(modalAdd, "block");
    addClass(modalAdd, "none");

  }

  function effacerModal() {
    removeClass(modal, "block");
    addClass(modal, "none");

    removeClass(modalAdd, "block");
    addClass(modalAdd, "none");
  }

  const arrowModalElement = document.querySelector(".arrow-modal");
  arrowModalElement.addEventListener("click", () => {
    afficherModal();
    resetLabelPhoto();
  })

  const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");
  boutonAjouterPhoto.addEventListener("click", afficherAjoutImageModal);

  function afficherAjoutImageModal() {
    effacerModal();
    addClass(modal, "none");
    removeClass(modalAdd, "none");
    addClass(modalAdd, "block");
  }

/*------------formulaire ajout------------------*/
  document.getElementById('file').addEventListener('change', handleFileSelect);

  function handleFileSelect(event) {
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];
  
    if (selectedFile) {
      // Vous pouvez maintenant faire quelque chose avec le fichier, par exemple l'afficher.
      displaySelectedImage(selectedFile);
    }
  }
  const labelFileAddPhoto = document.querySelector(".add_photo");
  const imageElement = document.createElement('img');
  function displaySelectedImage(file) {
    
    imageElement.classList.add('img_uploaded')
    const url = URL.createObjectURL(file);
  
    // Définissez la propriété src de l'élément img avec l'URL du fichier sélectionné
    imageElement.src = url;
    labelFileAddPhoto.style.padding = "0px";
    labelFileAddPhoto.innerHTML="";
  labelFileAddPhoto.appendChild(imageElement);
  }



  if (token === null) {
    console.log("Aucun token trouvé dans le localStorage");
    maDivBarreEdit.classList.add("none");
    maDivBtnModif.classList.add("none");
  } else {
    console.log("Token présent :", token);
    divFiltre.remove();
    ajoutLogout();
    maDivBarreEdit.classList.add("flex");
    maDivBtnModif.classList.add("flex");
  }
  function resetLabelPhoto() {
    labelFileAddPhoto.style.padding = "30px 0 0"
    labelFileAddPhoto.innerHTML=`
    <img src="assets/icons/icon_picture.svg" alt="">
    <span class="btn_add_photo">+ Ajouter photo</span>
    <span class="text_format">jpg, png: 4mo max</span>
    `
  }

}

