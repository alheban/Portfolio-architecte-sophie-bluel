
import { YourApiClass } from './api.js';
import { createElement } from './utils.js';
/*------ Sélectionner la section dans le DOM-------*/
const sectionFiltre = document.getElementById("portfolio");
const sectionPortfolio = document.querySelector(".gallery");
const sectionModal = document.querySelector(".galerie_modal");

/*------ boutons pour filtrer projet-----------------------*/
//creation div avec les boutons filtre
//const divFiltre = document.createElement("div");
//divFiltre.classList.add("filtre");
//sectionFiltre.appendChild(divFiltre);

const divFiltre = createElement({
  tag: "div",
  text:"",
  className: "filtre",
  whereAppend: sectionFiltre
});

sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

// Création de la section de filtre
const sectionDesFiltre = createElement({
  tag: "div",
  className: "filtre",
  whereAppend: sectionFiltre
});

// Création du bouton "Tous"
const tousButton = createElement({
  tag: "button",
  text: "Tous",
  className: "active",
  whereAppend: sectionFiltre
});
//creation du bouton tous
//const tousButton = document.createElement("button");
//tousButton.innerText = "Tous";
divFiltre.appendChild(tousButton);
tousButton.classList.add("active");
tousButton.addEventListener("click", () => {
  creerGalerieProjets(apiInstance.listeProjets);
  activerBouton(tousButton);
});

//Fonction pour filtrer et afficher les boutons par catégories sans doublons
function filtrerLesBouton() {
  // Créer un ensemble pour suivre les catégoriesname déjà ajoutées
  const categoriesNameAjoutees = new Set();
  apiInstance.listeProjets.forEach((workname) => {
    const categorieName = workname.category.name;
    if (!categoriesNameAjoutees.has(categorieName)) {
      const buttonFiltre = creerBoutonFiltre(categorieName);
      divFiltre.appendChild(buttonFiltre);
      categoriesNameAjoutees.add(categorieName);
    }
  });
}
//Fonction pour creer les boutons par catégories
function creerBoutonFiltre(categorieName) {
  const buttonFiltre = createElement({
    tag: "button",
    text: categorieName,
    className: "filtre",
    whereAppend: divFiltre
});
  //const buttonFiltre = document.createElement("button");
  ///buttonFiltre.innerText = categorieName;
  buttonFiltre.addEventListener("click", () => {
    filtrerParCategorie(categorieName);
    activerBouton(buttonFiltre);
  });
  return buttonFiltre;
}

//Fonction activer la classe "active" au bouton
function activerBouton(bouton) {
  document
    .querySelectorAll(".filtre button")
    .forEach((b) => b.classList.remove("active"));
  bouton.classList.add("active");
}
/* -----------------galerie----------------------------------*/
//Filtrer les projets en fonction de la catégorie sélectionnée
function filtrerParCategorie(categorieName) {
  const projetsFiltres = apiInstance.listeProjets.filter(
    (work) => work.category.name === categorieName
  );
  creerGalerieProjets(projetsFiltres);
}

//fonction creation galerie des projets
function creerGalerieProjets(projetsgalerie) {
  sectionPortfolio.innerHTML = ""; // Nettoyer la section de la galerie avant d'ajouter les nouveaux projets
  sectionModal.innerHTML = "";

  projetsgalerie.forEach((work) => {

      // Boucle galerie pour chaque projet filtré
      const figureElement = createElement({
          tag: "figure",
          text: "",
          whereAppend: sectionPortfolio
      });

      // Vérifier que work.title est défini avant de l'utiliser
      const imageElement = createElement({
          tag: "img",
          whereAppend: figureElement
      });
      if (work.title) {
          imageElement.alt = work.title;
      }

      // Vérifier que work.imageUrl est défini avant de l'utiliser
      if (work.imageUrl) {
          imageElement.src = work.imageUrl;
      }

      const figcaptionElement = createElement({
          tag: "figcaption",
          text: work.title || "",
          whereAppend: figureElement
      });

      // Ajoutez les éléments à la structure HTML
      figureElement.appendChild(imageElement);
      figureElement.appendChild(figcaptionElement);

      //galerie modal
      const figureModalElement = createElement({
          tag: "figure",
          text:"",
          whereAppend: sectionModal
      });

      // Vérifier que work.imageUrl est défini avant de l'utiliser
      const imageModalElement = createElement({
          tag: "img",
          className: "imageModal",
          whereAppend: figureModalElement
      });
      if (work.imageUrl) {
          imageModalElement.src = work.imageUrl;
      }

      // Ajoutez les éléments à la structure HTML
      figureModalElement.appendChild(imageModalElement);

      //btn delete
      const btnPath = "./assets/icons/delete.svg";
      const btnDeleteElement = createElement({
          tag: "img",
          className: "btndelete",
          whereAppend: figureModalElement
      });
      btnDeleteElement.src = btnPath;

      // Ajouter le bouton delete à la structure HTML
      figureModalElement.insertBefore(btnDeleteElement, figureModalElement.firstChild);
  });
}
//fonction creation galerie des projets
/*function creerGalerieProjets(projetsgalerie) {
  sectionPortfolio.innerHTML = ""; // Nettoyer la section de la galerie avant d'ajouter les nouveaux projets
  sectionModal.innerHTML = "";

  projetsgalerie.forEach((work) => {
    // Boucle galerie pour chaque projet filtré
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    sectionPortfolio.appendChild(figureElement);

    //galerie modal
    const figureModalElement = document.createElement("figure");
    const imageModalElement = document.createElement("img");
    imageModalElement.classList.add("imageModal");
    imageModalElement.src = work.imageUrl;
    sectionModal.appendChild(figureModalElement);
    figureModalElement.appendChild(imageModalElement);
    //btn delete
    const btnPath = "./assets/icons/delete.svg";
    const btnDeleteElement = document.createElement("img");
    btnDeleteElement.classList.add("btndelete");
    btnDeleteElement.src = btnPath;
    figureModalElement.appendChild(btnDeleteElement);
    figureModalElement.insertBefore(
      btnDeleteElement,
      figureModalElement.firstChild
    );
  });
}*/

/* -----------------Mode editeur-----------------------*/
function isAuthe() {
  let token = localStorage.getItem("token");
  const maDivBarreEdit = document.querySelector(".main_barre_edition");
  const maDivBtnModif = document.querySelector(".btn_modifier");

  const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", toggleModal)
  );

  const modalContainer = document.querySelector(".modal-container");
  const modalAdd = document.querySelector(".modal-add");
  const modal = document.querySelector(".modal");

  function toggleModal() {
    modalContainer.classList.toggle("active");
    if (modalContainer.classList.contains("active")) {
        afficherModal();
    }else{
      effacerModal();
    }
  }
  function afficherModal() {
    modal.classList.add("block");
    modalAdd.classList.remove("block");
    modal.classList.remove("none");
    modalAdd.classList.add("none");
}

function effacerModal() {
    modal.classList.remove("block");
    modalAdd.classList.remove("block");
    modal.classList.add("none");
    modalAdd.classList.add("none");
}

  const arrowModalElement = document.querySelector(".arrow-modal");
  arrowModalElement.addEventListener("click", afficherModal);

  const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");
  boutonAjouterPhoto.addEventListener("click", afficherAjoutImageModal);

  function afficherAjoutImageModal() {
    effacerModal();
    modal.classList.add("none");
    modalAdd.classList.remove("none");
    modalAdd.classList.add("block");
}

  if (token === null) {
    console.log("Aucun token trouvé dans le localStorage");
    maDivBarreEdit.classList.add("none")
    maDivBtnModif.classList.add("none")
  } else {
    console.log("Token présent :", token);
    divFiltre.remove();
    ajoutLogout();
    maDivBarreEdit.classList.add("flex")
    maDivBtnModif.classList.add("flex")
  }
}
function ajoutLogout() {
  const logoutLien = document.getElementById("login-out");
  logoutLien.innerHTML = "<li>Logout</li>";
  logoutLien.href = "";
  logoutLien.addEventListener("click", () => {
    localStorage.removeItem("token");
  });
}

// Appeler la fonction getWorksApi pour récupérer les projets depuis l'API
const apiInstance = new YourApiClass("http://localhost:5678/api");

apiInstance.getWorksApi().then((projetsRecuperes) => {
  creerGalerieProjets(projetsRecuperes);
  activerBouton(tousButton);
  filtrerLesBouton(apiInstance.listeProjets);
});
isAuthe();
