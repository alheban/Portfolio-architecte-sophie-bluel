
import { createElement, ajoutLogout, addClass, removeClass, isAuthe, activateButton } from "./utils.js";
import { sectionFiltre,sectionPortfolio,sectionModal,divFiltre,tousButton,apiInstance,modalContainer,modal,modalAdd,arrowModalElement,boutonAjouterPhoto, insertDivFiltre} from "./dom.js";


/*------ section filtre boutons-----------------------*/
import { activateBtnTous, filterButtons } from "./filter.js";
insertDivFiltre()
/* -----------------galerie principal ----------------------------------*/
import { filterByCategory, createProjectGallery, creerModal } from "./gallery.js";

/* -----------------Mode editeur ----------------------------------*/
import { handleModalTriggers,handleArrowModalElement,handleAjouterPhotoButton,afficherModal,effacerModal,toggleModal} from "./editor.js";

  /*------------formulaire ------------------*/
  import { initForm,updateSelectOptions} from "./form.js";

handleModalTriggers(modalContainer, modalAdd);
handleArrowModalElement(arrowModalElement, modal, modalAdd);
handleAjouterPhotoButton(boutonAjouterPhoto, modal, modalAdd);
initForm();


/* -----------------récupérer les projets depuis l'API ----------------------------------*/
apiInstance.getWorksApi().then((projetsRecuperes) => {
  createProjectGallery(sectionPortfolio, projetsRecuperes);
  activateBtnTous(projetsRecuperes);
  filterButtons(apiInstance, projetsRecuperes);
  isAuthe();
});


