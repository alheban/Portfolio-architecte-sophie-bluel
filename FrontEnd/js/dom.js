import { createElement } from "./utils.js";
import { YourApiClass } from "./api.js";
export const sectionFiltre = document.getElementById("portfolio");
export const sectionPortfolio = document.querySelector(".gallery");
export const sectionModal = document.querySelector(".galerie_modal");
export const tousButton = createElement({
  tag: "button",
  text: "Tous",
  className: "active",
  whereAppend: sectionFiltre,
});
export const divFiltre = createElement({
  tag: "div",
  text: "",
  className: "filtre",
  whereAppend: sectionFiltre,
});

export function insertDivFiltre() {
  sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);
}



export const apiInstance = new YourApiClass("http://localhost:5678/api");

/* -----------------galerie principal ----------------------------------*/

/* -----------------Mode editeur ----------------------------------*/
export const modalContainer = document.querySelector(".modal-container");
export const modalAdd = document.querySelector(".modal-add");
export const modal = document.querySelector(".modal");
export const arrowModalElement = document.querySelector(".arrow-modal");
export const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");

/* -----------------formulaire odal ----------------------------------*/
export const fileInput = document.getElementById("file");
export const textInput = document.getElementById("titre_img");
export const selectCategories = document.getElementById("categories");
export const labelFileAddPhoto = document.querySelector(".add_photo");
export const form = document.querySelector(".form_ajout_img");
export const submitButton = document.querySelector(".btn_valider_off");
export const buttonColorComplete = "#1D6154"; // vert
export const buttonColorDefault = "";
