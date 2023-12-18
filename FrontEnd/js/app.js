
import { isAuthe} from "./utils.js";
import { sectionPortfolio,apiInstance,modalContainer,modal,modalAdd,arrowModalElement,boutonAjouterPhoto, insertDivFiltre} from "./dom.js";


/*------ section filtre boutons-----------------------*/
import { activateBtnTous, filterButtons } from "./filter.js";
insertDivFiltre()
/* -----------------galerie principal ----------------------------------*/
import {createProjectGallery} from "./gallery.js";

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


