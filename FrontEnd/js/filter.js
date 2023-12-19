import { createElement, activateButton } from "./utils.js";
import { sectionPortfolio, divFiltre, tousButton} from "./dom.js";
import { createProjectGallery } from "./gallery.js";


/*------ section filtre boutons-----------------------*/
export function handleFilterButtonClick(projects, button) {
  createProjectGallery(sectionPortfolio, projects);
  activateButton(button);
}
//Fonction pour creer btnCategorie et filtrer galerie
export function createAndActivateFilterButton(categorieName, projects) {
  const btnFilter = createElement({
    tag: "button",
    text: categorieName,
    className: "filtre",
    whereAppend: divFiltre,
  });

  btnFilter.addEventListener("click", (event) => {
    event.preventDefault(); 
    handleFilterButtonClick(projects.filter((work) => work.category.name === categorieName),btnFilter
      );
  });
  return btnFilter;
}

//Fonction pour filtrer les boutons par catégories sans doublons
export function filterButtons(apiInstance, projects) {
  // Créer un ensemble pour suivre les catégories déjà ajoutées
  const categoriesNameAjoutees = new Set();
  projects.forEach((workname) => {
    const categorieName = workname.category.name;
    // si categoriesNameAjoutees ne contient pas encore categorieName = true
    if (!categoriesNameAjoutees.has(categorieName)) { 
      const buttonFiltre = createAndActivateFilterButton(categorieName, projects);
      divFiltre.appendChild(buttonFiltre);
      categoriesNameAjoutees.add(categorieName);
    }
  });
}

//Fonction pour creer btntous et afficher la galerie
export function activateBtnTous(projects) {
  tousButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleFilterButtonClick(projects, tousButton);
  });
  divFiltre.appendChild(tousButton);
  tousButton.classList.add("active");
}