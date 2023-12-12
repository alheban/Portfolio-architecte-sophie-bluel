import { createElement } from "./utils.js";
export const sectionFiltre = document.getElementById("portfolio");
export const sectionPortfolio = document.querySelector(".gallery");
export const sectionModal = document.querySelector(".galerie_modal");

export const divFiltre = createElement({
    tag: "div",
    text: "",
    className: "filtre",
    whereAppend: sectionFiltre,
  });