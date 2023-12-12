import { YourApiClass } from "./api.js";
import { createElement, addClass,removeClass,ajoutLogout } from "./utils.js";
import { sectionFiltre,sectionPortfolio,sectionModal } from "./dom.js";



/*------ boutons pour filtrer projet-----------------------*/
const divFiltre = createElement({
  tag: "div",
  text: "",
  className: "filtre",
  whereAppend: sectionFiltre,
});

sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

// Création de la section de filtre
const sectionDesFiltre = createElement({
  tag: "div",
  text:"",
  className: "filtre",
  whereAppend: sectionFiltre,
});

// Création du bouton "Tous"
const tousButton = createElement({
  tag: "button",
  text: "Tous",
  className: "active",
  whereAppend: sectionFiltre,
});

divFiltre.appendChild(tousButton);
tousButton.classList.add("active");

tousButton.addEventListener("click", () => {
  creerGalerieProjets(apiInstance.listeProjets);
  activerBouton(tousButton);
});

//Fonction pour filtrer et afficher les boutons par catégories sans doublons
function filtrerLesBouton(apiInstance) {
  // Créer un ensemble pour suivre les catégories déjà ajoutées
  const categoriesNameAjoutees = new Set();
  apiInstance.listeProjets.forEach((workname) => {
    const categorieName = workname.category.name;
    if (!categoriesNameAjoutees.has(categorieName)) {
      const buttonFiltre = creerBoutonFiltre(categorieName, apiInstance);
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
    whereAppend: divFiltre,
  });

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
    (work) => work.category.name === categorieName);
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
      whereAppend: sectionPortfolio,
    });

    const imageElement = createElement({
      tag: "img",
      whereAppend: figureElement,
    });
    if (work.title) {
      imageElement.alt = work.title;
    }

    if (work.imageUrl) {
      imageElement.src = work.imageUrl;
    }

    const figcaptionElement = createElement({
      tag: "figcaption",
      text: work.title || "",
      whereAppend: figureElement,
    });

    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

    //galerie modal
    const figureModalElement = createElement({
      tag: "figure",
      text: "",
      whereAppend: sectionModal,
    });

    const imageModalElement = createElement({
      tag: "img",
      className: "imageModal",
      text:"",
      whereAppend: figureModalElement,
    });
    if (work.imageUrl) {
      imageModalElement.src = work.imageUrl;
    }

    figureModalElement.appendChild(imageModalElement);

    //btn delete
    const btnPath = "./assets/icons/delete.svg";
    const btnDeleteElement = createElement({
      tag: "img",
      text:"",
      className: "btndelete",
      whereAppend: figureModalElement,
    });
    btnDeleteElement.src = btnPath;
    figureModalElement.insertBefore(btnDeleteElement,figureModalElement.firstChild);
    
    
    if (work.id) {
      btnDeleteElement.setAttribute("data-id", work.id);
    }
  
    btnDeleteElement.addEventListener("click", async (event) => {
      const idToDelete = event.currentTarget.getAttribute("data-id");
      // Vérifiez si l'ID est défini avant d'appeler deleteWorksApi
      if (idToDelete) {
        try {
          const success = await apiInstance.deleteWorksApi(idToDelete);
          
          if (success) {
            event.target.parentElement.remove()
            apiInstance.getWorksApi().then((projetsRecuperes) => {
              creerGalerieProjets(projetsRecuperes);
              activerBouton(tousButton);
              filtrerLesBouton(apiInstance);
            });

            console.log(`Le travail avec l'ID ${idToDelete} a été supprimé.`);
          } else {
            // Suppression échouée côté serveur, gérer les erreurs ou afficher un message d'erreur
            console.error(`Échec de la suppression du travail avec l'ID ${idToDelete}.`);
          }
        } catch (error) {
          // Une erreur s'est produite lors de l'appel à deleteWorksApi
          console.error('Erreur lors de la suppression du travail :', error);
        }
      } else {
        console.error("ID non défini. Impossible de supprimer.");
      }
    });
})
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
  arrowModalElement.addEventListener("click", afficherModal);

  const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");
  boutonAjouterPhoto.addEventListener("click", afficherAjoutImageModal);

  function afficherAjoutImageModal() {
    effacerModal();
    addClass(modal, "none");
    removeClass(modalAdd, "none");
    addClass(modalAdd, "block");
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
}

const apiInstance = new YourApiClass("http://localhost:5678/api");



// Appeler la fonction getWorksApi pour récupérer les projets depuis l'API
apiInstance.getWorksApi().then((projetsRecuperes) => {
  creerGalerieProjets(projetsRecuperes);
  activerBouton(tousButton);
  filtrerLesBouton(apiInstance);
});
isAuthe();

