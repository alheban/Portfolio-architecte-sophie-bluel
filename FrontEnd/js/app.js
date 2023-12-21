
import { isAuthe} from "./utils.js";
import { sectionPortfolio,apiInstance,modalContainer,modal,modalAdd,arrowModalElement,boutonAjouterPhoto, insertDivFiltre} from "./dom.js";
import { activateBtnTous, filterButtons } from "./filter.js";
import {createProjectGallery} from "./gallery.js";
import { handleModalTriggers,handleArrowModalElement,handleAjouterPhotoButton,afficherModal,effacerModal,toggleModal} from "./editor.js";
import { initForm,updateSelectOptions} from "./form.js";

/*------ section filtre boutons-----------------------*/

insertDivFiltre()


/*------------formulaire ------------------*/


handleModalTriggers(modalContainer, modalAdd);
handleArrowModalElement(arrowModalElement, modal, modalAdd);
handleAjouterPhotoButton(boutonAjouterPhoto, modal, modalAdd);
initForm();





/* -----------------récupérer les projets depuis l'API ----------------------------------*/
async function fetchDataAndDisplay() {
  try {
      const projetsRecuperes = await apiInstance.getWorksApi();
      createProjectGallery(sectionPortfolio, projetsRecuperes);
      activateBtnTous(projetsRecuperes);
      filterButtons(apiInstance, projetsRecuperes);
      isAuthe();

      // Résoudre la promesse lorsque les données sont chargées
      return Promise.resolve();
  } catch (error) {
      return Promise.reject(error);
  }
}

  fetchDataAndDisplay();
