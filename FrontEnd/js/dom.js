import { createElement } from "./utils.js";
import { YourApiClass } from "./api.js";
export const sectionFiltre = document.getElementById("portfolio");
export const sectionPortfolio = document.querySelector(".gallery");
export const sectionModal = document.querySelector(".galerie_modal");

export const divFiltre = createElement({
    tag: "div",
    text: "",
    className: "filtre",
    whereAppend: sectionFiltre,
  });

export const tousButton = createElement({
    tag: "button",
    text: "Tous",
    className: "active",
    whereAppend: sectionFiltre,
  });
export const apiInstance = new YourApiClass("http://localhost:5678/api");

/* -----------------galerie principal ----------------------------------*/

