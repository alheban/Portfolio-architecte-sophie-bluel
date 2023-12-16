
import { createElement, ajoutLogout, addClass, removeClass, isAuthe, activateButton } from "./utils.js";
import { sectionFiltre,sectionPortfolio,sectionModal,divFiltre,tousButton,apiInstance} from "./dom.js";


/*------ section filtre boutons-----------------------*/

sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

function handleFilterButtonClick(projects, button) {
  createProjectGallery(sectionPortfolio, projects);
  activateButton(button);
}
//Fonction pour creer btnCategorie et filtrer galerie
function createAndActivateFilterButton(categorieName, projects) {
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
function filterButtons(apiInstance, projects) {
  // Créer un ensemble pour suivre les catégories déjà ajoutées
  const categoriesNameAjoutees = new Set();
  projects.forEach((workname) => {
    const categorieName = workname.category.name;
    if (!categoriesNameAjoutees.has(categorieName)) {
      const buttonFiltre = createAndActivateFilterButton(categorieName, projects);
      divFiltre.appendChild(buttonFiltre);
      categoriesNameAjoutees.add(categorieName);
    }
  });
}

//Fonction pour creer btntous et afficher la galerie
function activateBtnTous(projects) {
  tousButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleFilterButtonClick(projects, tousButton);
  });
  divFiltre.appendChild(tousButton);
  tousButton.classList.add("active");
}





/* -----------------galerie principal ----------------------------------*/
function filterByCategory(projects, categoryName) {
  const filteredProjects = projects.filter((work) => work.category.name === categoryName);
  if (filteredProjects.length > 0) {
    createProjectGallery(filteredProjects);
  } 
}

function createProjectGallery(section, projetsgalerie) {
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
function creerModal(section, work) {
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

/* -----------------Mode editeur ----------------------------------*/

const modalTriggers = document.querySelectorAll(".modal-trigger");
  modalTriggers.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      toggleModal();
      resetLabelFile();
    })
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
      resetLabelFile();
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

    resetLabelFile();
  }

  const arrowModalElement = document.querySelector(".arrow-modal");
  arrowModalElement.addEventListener("click", () => {
    afficherModal();
    resetLabelFile();
  });

  const boutonAjouterPhoto = document.querySelector(".btn_ajouter_photo");
  boutonAjouterPhoto.addEventListener("click", afficherAjoutImageModal);

  function afficherAjoutImageModal() {
    effacerModal();
    addClass(modal, "none");
    removeClass(modalAdd, "none");
    addClass(modalAdd, "block");
  }

  /*------------formulaire ------------------*/
  const fileInput = document.getElementById("file");
  const textInput = document.getElementById("titre_img");
  const selectCategories = document.getElementById("categories");
  const labelFileAddPhoto = document.querySelector(".add_photo");
  const form = document.querySelector(".form_ajout_img");
  const submitButton = document.querySelector(".btn_valider_off");

  // Ajoutez des écouteurs d'événements aux champs du formulaire
  fileInput.addEventListener("change", async (e) => {
    // Supprimez le message d'erreur s'il existe
    const formu = document.querySelector(".form_ajout_img");
    const existingErrorMessage = formu.querySelector(".error-message");
    if (existingErrorMessage) {
      formu.removeChild(existingErrorMessage);
    }
  
    await handleFileSelect(e);
    updateSubmitButtonState();
  });

  textInput.addEventListener("input", (e) => {
    handleTextInput(e);
    updateSubmitButtonState();
  });
  selectCategories.addEventListener("change", (e) => {
    handleSelectChange(e);
    updateSubmitButtonState();
  });

  loadOptionsFromApi();
  /*--fileinput--*/
  let selectedFile;
async function handleFileSelect() {
  selectedFile = fileInput.files[0];

  // Supprimer le message d'erreur s'il existe
  const formu = document.querySelector(".form_ajout_img");
  const existingErrorMessage = formu.querySelector(".error");

  if (existingErrorMessage) {
    existingErrorMessage.remove();
  }

  if (selectedFile) {
    try {
      displaySelectedImage(selectedFile);
    } catch (error) {
      // Gérez les erreurs
      console.error("Erreur lors du téléchargement du fichier :", error);
    }
  }
}
  function displaySelectedImage(file) {
    const imageElement = document.createElement("img");
    imageElement.classList.add("img_uploaded");

    const url = URL.createObjectURL(file);

    imageElement.src = url;
    labelFileAddPhoto.style.padding = "0px";
    labelFileAddPhoto.innerHTML = "";
    labelFileAddPhoto.appendChild(imageElement);
  }
  /*--textinput--*/
  function handleTextInput(event) {
    const textInputValue = textInput.value;
    console.log("Données du textInput :", textInputValue);
  }
  /*--selectcategories--*/
  function updateSelectOptions(categories) {
    // Supprimez toutes les options actuelles du select
    selectCategories.innerHTML = "";

    // Ajoutez une option vide par défaut
    const defaultOption = document.createElement("option");
    defaultOption.text = "Sélectionnez une catégorie";
    selectCategories.add(defaultOption);

    // Ajoutez chaque catégorie comme une nouvelle option
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id; // Remplacez par la propriété appropriée de votre catégorie
      option.text = category.name; // Remplacez par la propriété appropriée de votre catégorie
      selectCategories.add(option);
    });
  }
  async function loadOptionsFromApi() {
    try {
      const categories = await apiInstance.getCategoriesApi();
      updateSelectOptions(categories);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des options depuis l'API :",
        error
      );
    }
  }
  function handleSelectChange(event) {
    const selectedOption = event.target.value;
    console.log("Option sélectionnée :", selectedOption);
  }
  /*--formulaire submit--*/
  // Fonction pour gérer la soumission de formulaire
  async function handleSubmit(event) {
    try {
      event.preventDefault();
  
      // Validez le formulaire
      const isValidForm = updateSubmitButtonState();
  
      if (!isValidForm) {
        return;
      }
  
      // Continuez avec l'envoi du formulaire
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", textInput.value);
      formData.append("category", selectCategories.value);
  
      console.log("Données avant envoi :", {
        image: formData.get("image"),
        title: formData.get("title"),
        category: formData.get("category"),
      });
  
      const data = await apiInstance.uploadFormDataToAPI(formData);
  
      if (data) {
        // Après un POST réussi, récupérez les projets mis à jour
        const projetsRecuperes = await apiInstance.getWorksApi();
  
        // Mise à jour de la galerie des projets avec les données récentes
        createProjectGallery(sectionPortfolio,projetsRecuperes);
  
        // Réinitialisez le formulaire et l'état du label de fichier
        form.reset();
        resetLabelFile()
        afficherModal()
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  // Ajoutez un écouteur d'événements au bouton de soumission
  submitButton.addEventListener("click", handleSubmit);
  const buttonColorComplete = "#1D6154"; // vert
  const buttonColorDefault = "";
  
// Fonction pour valider le formulaire
function updateSubmitButtonState() {
  const fileInputValue = fileInput.value.trim();
  const textInputValue = textInput.value.trim();
  const selectCategoriesValue = selectCategories.value;

  // Vérifiez si tous les champs sont remplis
  const isFormComplete =
    fileInputValue !== "" &&
    textInputValue !== "" &&
    selectCategoriesValue !== "Sélectionnez une catégorie";

  if (!isFormComplete) {
    submitButton.disabled = true;
    submitButton.style.backgroundColor = buttonColorDefault;
    return false;
  }

  // Vérifiez le format du fichier (par exemple, vérifiez l'extension)
  const allowedFileExtensions = ["jpg", "jpeg", "png", "gif"]; // Ajoutez les extensions autorisées
  const fileExtension = fileInputValue.split(".").pop().toLowerCase();

  if (!allowedFileExtensions.includes(fileExtension)) {
    // Le fichier n'a pas la bonne extension
    const formu = document.querySelector(".form_ajout_img");
    const messageErreur = document.createElement("p");
    formu.appendChild(messageErreur);
    messageErreur.innerText = "Format non pris en charge, merci de choisir une autre photo";
    messageErreur.classList.add("error");
    submitButton.disabled = true;
    submitButton.style.backgroundColor = buttonColorDefault;
    return false;
  }

  // Vérifiez la taille du fichier
  const maxFileSizeInBytes = 4000 * 1024; // 4 Mo
  if (selectedFile.size > maxFileSizeInBytes) {
    const formu = document.querySelector(".form_ajout_img");
    // Si la taille du fichier dépasse 4 Mo, affichez un message d'erreur
    const sizeImageErreur = document.createElement("p");
    sizeImageErreur.innerText = "La taille de l'image ne doit pas dépasser 4 Mo";
    sizeImageErreur.classList.add("error");
    formu.appendChild(sizeImageErreur);
    submitButton.disabled = true;
    submitButton.style.backgroundColor = buttonColorDefault;
    return false; // Le formulaire n'est pas valide
  }

  // Le formulaire est valide
  submitButton.disabled = false;
  submitButton.style.backgroundColor = buttonColorComplete;
  return true;
}



  function resetLabelFile() {
    // Réinitialiser le message d'erreur s'il existe
  const formu = document.querySelector(".form_ajout_img");
  const existingErrorMessage = formu.querySelector(".error");
  if (existingErrorMessage) {
    existingErrorMessage.remove();
  }
    labelFileAddPhoto.style.padding = "30px 0 0";
    labelFileAddPhoto.innerHTML = `
    <img src="assets/icons/icon_picture.svg" alt="">
    <span class="btn_add_photo">+ Ajouter photo</span>
    <span class="text_format">jpg, png: 4mo max</span>
    `;
    selectCategories.selectedIndex = 0;
    textInput.value = "";
    updateSubmitButtonState();
  }
/* -----------------récupérer les projets depuis l'API ----------------------------------*/
apiInstance.getWorksApi().then((projetsRecuperes) => {
  createProjectGallery(sectionPortfolio, projetsRecuperes);
  activateBtnTous(projetsRecuperes);
  filterButtons(apiInstance, projetsRecuperes);
  isAuthe();
});


