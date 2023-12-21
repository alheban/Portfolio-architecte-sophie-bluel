import {
  sectionPortfolio,
  apiInstance,
  fileInput,
  textInput,
  selectCategories,
  labelFileAddPhoto,
  form,
  submitButton,
  buttonColorComplete,
  buttonColorDefault,
} from "./dom.js";

import { createProjectGallery } from "./gallery.js";
import { createElement } from "./utils.js";
import { afficherModal } from "./editor.js";

export function removeErrorMessage(formu, errorClass) {
  const existingErrorMessage = formu.querySelector(`.${errorClass}`);
  if (existingErrorMessage) {
    formu.removeChild(existingErrorMessage);
  }
}

export function initForm() {
  // Ajoutez des écouteurs d'événements aux champs du formulaire
  fileInput.addEventListener("change", async (e) => {
    // Supprimez le message d'erreur s'il existe
    const formu = document.querySelector(".form_ajout_img");
    removeErrorMessage(formu, "error");

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
  submitButton.addEventListener("click", async (event) => {
    await handleSubmit(event);
  });
}
loadOptionsFromApi();
/*--fileinput--*/
let selectedFile;
export function handleFileSelect() {
  selectedFile = fileInput.files[0];

// Supprimer le message d'erreur s'il existe
const formu = document.querySelector(".form_ajout_img");
removeErrorMessage(formu, "error");

  if (selectedFile) {
    try {
      displaySelectedImage(selectedFile);
    } catch (error) {
    }
  }
}
export function displaySelectedImage(file) {
  const imageElement = document.createElement("img");
  imageElement.classList.add("img_uploaded");

  const url = URL.createObjectURL(file);

  imageElement.src = url;
  labelFileAddPhoto.style.padding = "0px";
  labelFileAddPhoto.innerHTML = "";
  labelFileAddPhoto.appendChild(imageElement);
}
/*--textinput--*/
export function handleTextInput(event) {
  const textInputValue = textInput.value;
}
/*--selectcategories--*/
export function updateSelectOptions(categories) {
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
export async function loadOptionsFromApi() {
  try {
    const categories = await apiInstance.getCategoriesApi();
    updateSelectOptions(categories);
  } catch (error) {
  }
}
export function handleSelectChange(event) {
  const selectedOption = event.target.value;
}
/*--formulaire submit--*/
// Fonction pour gérer la soumission de formulaire
export async function handleSubmit(event) {
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

    const data = await apiInstance.uploadFormDataToAPI(formData);

    if (data) {
      
      // Après un POST réussi, récupérez les projets mis à jour
      const projetsRecuperes = await apiInstance.getWorksApi();

      // Mise à jour de la galerie des projets avec les données récentes
      createProjectGallery(sectionPortfolio, projetsRecuperes);

      // Réinitialisez le formulaire et l'état du label de fichier
      form.reset();
      resetLabelFile();
      afficherModal();
    }
  } catch (error) {

  }
}

// Fonction pour valider le formulaire
export function updateSubmitButtonState() {
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
    messageErreur.innerText =
      "Format non pris en charge, merci de choisir une autre photo";
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
    sizeImageErreur.innerText =
      "La taille de l'image ne doit pas dépasser 4 Mo";
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
// Fonction pour reset formulaire
export function resetLabelFile() {
    // Réinitialiser le message d'erreur s'il existe
    const formu = document.querySelector(".form_ajout_img");
    removeErrorMessage(formu, "error");
  
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
