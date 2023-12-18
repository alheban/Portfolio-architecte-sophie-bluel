import { createElement} from "./utils.js";
import { sectionPortfolio, sectionModal, apiInstance } from "./dom.js";

/* -----------------galerie principal ----------------------------------*/
export function filterByCategory(projects, categoryName) {
    const filteredProjects = projects.filter((work) => work.category.name === categoryName);
    if (filteredProjects.length > 0) {
      createProjectGallery(filteredProjects);
    } 
  }
  
export function createProjectGallery(section, projetsgalerie) {
    section.innerHTML = ""; // Nettoyer la section de la galerie avant d'ajouter les nouveaux projets
    sectionModal.innerHTML = "";
  
    projetsgalerie.forEach((work) => {
      // Boucle galerie pour chaque projet filtré
      const figureElement = createElement({
        tag: "figure",
        text: "",
        whereAppend: section,
      });
  
      const imageElement = createElement({
        tag: "img",
        whereAppend: figureElement,
      });
      const figcaptionElement = createElement({
        tag: "figcaption",
        text: work.title || "",
        whereAppend: figureElement,
      });
      
      if (work.title) {
        imageElement.alt = work.title;
      }
  
      if (work.imageUrl) {
        imageElement.src = work.imageUrl;
      }
      figureElement.appendChild(imageElement);
      figureElement.appendChild(figcaptionElement);
      creerModal(sectionModal,work);
      // Ajoutez le nouvel élément à la fin du conteneur
      section.appendChild(figureElement);
  })
  }
  /* -----------------galerie modal avec btn delete ----------------------------------*/
export function creerModal(section, work) {
    const figureModalElement = createElement({
      tag: "figure",
      text: "",
      whereAppend: section,
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
              createProjectGallery(sectionPortfolio, projetsRecuperes);
            });
  
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
    // Ajoutez le nouvel élément modal à la fin du conteneur
    section.appendChild(figureModalElement);
  }

