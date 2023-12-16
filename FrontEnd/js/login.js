import { YourApiClass } from './api.js';
const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const apiInstance = new YourApiClass("http://localhost:5678/api");




form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const loginResult = await apiInstance.loginUser(email, password);

    if (loginResult.success) {
      form.reset();
      window.location.href = "index.html";
    }
  } catch (error) {
    errorMessage();
  }
});



function errorMessage() {
  const existingErrorMessage = passwordInput.nextElementSibling;
  if (!existingErrorMessage || !existingErrorMessage.classList.contains("errorMessage")) {
    const messageErreur = document.createElement("p");
    messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe";
    messageErreur.classList.add("errorMessage");
    messageErreur.style.color = "#ff0000"; 
    passwordInput.style.border = "2px solid red";
    emailInput.style.border = "2px solid red";
    passwordInput.parentNode.insertBefore(messageErreur, passwordInput.nextSibling);
  }
}

// Ajoutez des écouteurs d'événements aux champs de saisie
emailInput.addEventListener("input", clearErrorMessage);
passwordInput.addEventListener("input", clearErrorMessage);

function clearErrorMessage() {
  const existingErrorMessage = passwordInput.nextElementSibling;

  if (existingErrorMessage && existingErrorMessage.classList.contains("errorMessage")) {
    existingErrorMessage.remove();
    passwordInput.style.border = ""; 
    emailInput.style.border = ""; 
  }
}

