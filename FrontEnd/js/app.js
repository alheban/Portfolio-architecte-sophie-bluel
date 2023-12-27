import { isAuthe, deplacerVersAncre } from "./utils.js";
import { sectionPortfolio, apiInstance, modalContainer, modal, modalAdd, arrowModalElement, boutonAjouterPhoto, insertDivFiltre } from "./dom.js";
import { activateBtnTous, filterButtons } from "./filter.js";
import { createProjectGallery } from "./gallery.js";
import { handleModalTriggers, handleArrowModalElement, handleAjouterPhotoButton, afficherModal, effacerModal, toggleModal } from "./editor.js";
import { initForm, updateSelectOptions } from "./form.js";



// Section filtre boutons
insertDivFiltre();

// Formulaire
handleModalTriggers(modalContainer, modalAdd);
handleArrowModalElement(arrowModalElement, modal, modalAdd);
handleAjouterPhotoButton(boutonAjouterPhoto, modal, modalAdd);
initForm();

// Récupérer les projets depuis l'API
async function fetchDataAndDisplay() {
    try {
        const projetsRecuperes = await apiInstance.getWorksApi();
        createProjectGallery(sectionPortfolio, projetsRecuperes);
        activateBtnTous(projetsRecuperes);
        filterButtons(apiInstance, projetsRecuperes);
        isAuthe();
        // Déplacer la vue vers l'ancre si spécifiée
        const hash = window.location.hash;
        if (hash === "#portfolio" || hash === "#contact") {
            deplacerVersAncre(hash);
        }
    } catch (error) {
    }
}

// Déplacer la vue lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', fetchDataAndDisplay);

// Déplacer également la vue lorsque la page est entièrement chargée
window.addEventListener('load', function () {
  setTimeout(function () {
      const hash = window.location.hash;
      if (hash === "#portfolio" || hash === "#contact") {
          deplacerVersAncre(hash);
      }
  }, 200); // Augmentez le délai si nécessaire
});