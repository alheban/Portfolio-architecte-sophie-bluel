import {
  createElement,
  ajoutLogout,
  addClass,
  removeClass,
  isAuthe,
  activateButton,
} from "./utils.js";
import {
  modalContainer,
  modal,
  modalAdd,
  arrowModalElement,
  boutonAjouterPhoto,
} from "./dom.js";
import { resetLabelFile } from "./form.js";

/*-------fond noir modal-------------*/
export function handleModalTriggers(modal, modalAdd) {
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      toggleModal(modal, modalAdd);
      resetLabelFile();
    })
  );
}
/*-------affichage modal-------------*/
export function toggleModal() {
  modalContainer.classList.toggle("active");
  if (modalContainer.classList.contains("active")) {
    afficherModal();
  } else {
    effacerModal();
    resetLabelFile();
  }
}

export function afficherModal() {
  addClass(modal, "block");
  removeClass(modal, "none");

  removeClass(modalAdd, "block");
  addClass(modalAdd, "none");
}

export function effacerModal() {
  removeClass(modal, "block");
  addClass(modal, "none");

  removeClass(modalAdd, "block");
  addClass(modalAdd, "none");

  resetLabelFile();
}

export function handleArrowModalElement(arrowModalElement, modal, modalAdd) {
  arrowModalElement.addEventListener("click", () => {
    afficherModal(modal, modalAdd);
    resetLabelFile();
  });
}
/*-------affichage page modal2 formulaire-------------*/
export function handleAjouterPhotoButton(boutonAjouterPhoto, modal, modalAdd) {
  boutonAjouterPhoto.addEventListener("click", () => {
    effacerModal(modal, modalAdd);
    addClass(modal, "none");
    removeClass(modalAdd, "none");
    addClass(modalAdd, "block");
  });
}
