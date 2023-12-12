import { YourApiClass } from "./api.js";
import { isAuthe } from "./editor.js";
import { createElement } from "./utils.js";
import { sectionFiltre,sectionPortfolio,sectionModal,divFiltre } from "./dom.js";


const apiInstance = new YourApiClass("http://localhost:5678/api");

/*------ section filtre boutons-----------------------*/

sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

function btnTous(){
const tousButton = createElement({
  tag: "button",
  text: "Tous",
  className: "active",
  whereAppend: sectionFiltre,
});
tousButton.addEventListener("click", (e) => {
  e.preventDefault();
  creerGalerieProjets(apiInstance.listeProjets);
  activerBouton(tousButton);
});
divFiltre.appendChild(tousButton);
tousButton.classList.add("active");

}

//Fonction activer la classe "active" au bouton
function activerBouton(bouton) {
  document
    .querySelectorAll(".filtre button")
    .forEach((b) => b.classList.remove("active"));
  bouton.classList.add("active");
}
//Fonction pour creer btn et filtrer galerie
function creerBoutonFiltre(categorieName) {
  const buttonFiltre = createElement({
    tag: "button",
    text: categorieName,
    className: "filtre",
    whereAppend: divFiltre,
  });

  buttonFiltre.addEventListener("click", (event) => {
    event.preventDefault(); 
    filtrerParCategorie(categorieName);
    activerBouton(buttonFiltre);
  });
  return buttonFiltre;
}

//Fonction pour filtrer les boutons par catégories sans doublons
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

/* -----------------galerie----------------------------------*/
function filtrerParCategorie(categorieName) {
  const projetsFiltres = apiInstance.listeProjets.filter(
    (work) => work.category.name === categorieName);
  creerGalerieProjets(projetsFiltres);
}

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

    creerModal(work);
})
}
/* -----------------galeriemodal----------------------------------*/
function creerModal(work) {
  const figureModalElement = createElement({
    tag: "figure",
    text: "",
    whereAppend: sectionModal,
  });

  const imageModalElement = createElement({
    tag: "img",
    className: "imageModal",    text: "",
    whereAppend: figureModalElement,
  });

  if (work.imageUrl) {
    imageModalElement.src = work.imageUrl;
  }

  figureModalElement.appendChild(imageModalElement);

  const btnPath = "./assets/icons/delete.svg";
  const btnDeleteElement = createElement({
    tag: "img",
    text: "",
    className: "btndelete",
    whereAppend: figureModalElement,
  });

  btnDeleteElement.src = btnPath;

  figureModalElement.insertBefore(btnDeleteElement, figureModalElement.firstChild);
  if (work.id) {
    btnDeleteElement.setAttribute("data-id", work.id);
  }

  btnDeleteElement.addEventListener("click", async (event) => {
    const idToDelete = event.currentTarget.getAttribute("data-id");

    if (idToDelete) {
      try {
        const success = await apiInstance.deleteWorksApi(idToDelete);

        if (success) {
          event.target.parentElement.remove();
          apiInstance.getWorksApi().then((projetsRecuperes) => {
            creerGalerieProjets(projetsRecuperes);
            btnTous();
            filtrerLesBouton(apiInstance);
            isAuthe();
          });

          console.log(`Le travail avec l'ID ${idToDelete} a été supprimé.`);
        } else {
          console.error(`Échec de la suppression du travail avec l'ID ${idToDelete}.`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du travail :', error);
      }
    } else {
      console.error("ID non défini. Impossible de supprimer.");
    }
  });
}


// Appeler la fonction getWorksApi pour récupérer les projets depuis l'API
apiInstance.getWorksApi().then((projetsRecuperes) => {
  creerGalerieProjets(projetsRecuperes);
  btnTous();
  filtrerLesBouton(apiInstance);
  isAuthe();
});


