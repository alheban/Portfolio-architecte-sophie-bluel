async function getWorksApi() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    listProjets.length = 0; // Vider le tableau plutôt que de le réaffecter
    listProjets.push(...data); // Ajouter les nouveaux projets au tableau existant

    return listProjets;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

let listProjets = []; // Initialisation avec un tableau vide

/*------ Sélectionner la section dans le DOM-------*/
const sectionFiltre = document.getElementById("portfolio");
const sectionPortfolio = document.querySelector(".gallery");
const sectionModal = document.querySelector(".galerie_modal");

/*------ boutons pour filtrer projet-----------------------*/
//creation div avec les boutons filtre
const divFiltre = document.createElement("div");
divFiltre.classList.add("filtre");
sectionFiltre.appendChild(divFiltre);
sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

//creation du bouton tous
const tousButton = document.createElement("button");
tousButton.innerText = "Tous";
divFiltre.appendChild(tousButton);
tousButton.classList.add("active");
tousButton.addEventListener("click", () => {
  creerGalerieProjets(listProjets);
  activerBouton(tousButton);
});

//Fonction pour filtrer et afficher les boutons par catégories sans doublons
function filtrerLesBouton() {
  // Créer un ensemble pour suivre les catégoriesname déjà ajoutées
  const categoriesNameAjoutees = new Set();
  listProjets.forEach((workname) => {
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
  const buttonFiltre = document.createElement("button");
  buttonFiltre.innerText = categorieName;
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
  const projetsFiltres = listProjets.filter(
    (work) => work.category.name === categorieName
  );
  creerGalerieProjets(projetsFiltres);
}
/*import {filtrerParCategorie} from "./utils.js"*/

//fonction creation galerie des projets
function creerGalerieProjets(projetsgalerie) {
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
}

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
    modal.style.display = "block";
    modalAdd.style.display = "none";
  }

  const arrowModalElement = document.querySelector(".arrow-modal");
  arrowModalElement.addEventListener("click", afficherModal);

  function afficherModal() {
    modal.style.display = "block";
    modalAdd.style.display = "none";
  }

  const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");
  boutonAjouterPhoto.addEventListener("click", afficherAjoutImageModal);

  function afficherAjoutImageModal() {
    modalAdd.style.display = "block";
    modal.style.display = "none";
  }

  if (token === null) {
    console.log("Aucun token trouvé dans le localStorage");
    maDivBarreEdit.style.display = "none";
    maDivBtnModif.style.display = "none";
  } else {
    console.log("Token présent :", token);
    divFiltre.remove();
    ajoutLogout();
    maDivBarreEdit.style.display = "flex";
    maDivBtnModif.style.display = "flex";
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
getWorksApi().then((projetsRecuperes) => {
  creerGalerieProjets(listProjets);
  activerBouton(tousButton);
  filtrerLesBouton();
});
isAuthe();
