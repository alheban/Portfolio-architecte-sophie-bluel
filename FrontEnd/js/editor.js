import { YourApiClass } from "./api.js";
import { apiInstance } from "./app.js";
import { creerGalerieProjets } from "./app.js";

import { createElement, addClass, removeClass, ajoutLogout } from "./utils.js";
import { divFiltre } from "./dom.js";

export function isAuthe() {
  let token = localStorage.getItem("token");
  const maDivBarreEdit = document.querySelector(".main_barre_edition");
  const maDivBtnModif = document.querySelector(".btn_modifier");

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
  fileInput.addEventListener("change", (e) => {
    handleFileSelect(e);
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
  async function handleFileSelect(event) {
    selectedFile = event.target.files[0];

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
      const isValidForm = validateForm();
  
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
        creerGalerieProjets(projetsRecuperes);
  
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
function validateForm() {
  const fileInputValue = fileInput.value.trim();
  const textInputValue = textInput.value.trim();
  const selectCategoriesValue = selectCategories.value;

  // Vérifiez si tous les champs sont remplis
  const isFormComplete =
    fileInputValue !== "" &&
    textInputValue !== "" &&
    selectCategoriesValue !== "Sélectionnez une catégorie";

  if (!isFormComplete) {
    // Affichez un message d'erreur
    alert("Veuillez remplir tous les champs du formulaire.");

    // Ajoutez un style ou un message d'erreur spécifique aux champs manquants
    if (fileInputValue === "") {
      fileInput.classList.add("error");
    } else {
      fileInput.classList.remove("error");
    }

    if (textInputValue === "") {
      textInput.classList.add("error");
    } else {
      textInput.classList.remove("error");
    }

    if (selectCategoriesValue === "Sélectionnez une catégorie") {
      selectCategories.classList.add("error");
    } else {
      selectCategories.classList.remove("error");
    }

    return false;
  }

  // Le formulaire est valide
  return true;
}
  // Fonction pour activer ou désactiver le bouton en fonction de l'état du formulaire
  function updateSubmitButtonState() {
    const fileInputValue = fileInput.value.trim();
    const textInputValue = textInput.value.trim();
    const selectCategoriesValue = selectCategories.value;

    // Vérifiez si tous les champs sont remplis
    const isFormComplete =
      fileInputValue !== "" &&
      textInputValue !== "" &&
      selectCategoriesValue !== "Sélectionnez une catégorie";

    // Activez ou désactivez le bouton en fonction du résultat
    submitButton.disabled = !isFormComplete;
    submitButton.style.backgroundColor = isFormComplete
      ? buttonColorComplete
      : buttonColorDefault;
    console.log("Formulaire complet :", isFormComplete);
  }

  function resetLabelFile() {
    labelFileAddPhoto.style.padding = "30px 0 0";
    labelFileAddPhoto.innerHTML = `
    <img src="assets/icons/icon_picture.svg" alt="">
    <span class="btn_add_photo">+ Ajouter photo</span>
    <span class="text_format">jpg, png: 4mo max</span>
    `;
    
    // Réinitialiser le champ de sélection
    selectCategories.selectedIndex = 0;
    textInput.value = "";
    updateSubmitButtonState();
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
