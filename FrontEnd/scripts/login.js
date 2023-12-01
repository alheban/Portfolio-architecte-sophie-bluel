const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = {
    email: email,
    password: password,
  };
  const chargeUtile = JSON.stringify(user);

  try {
    // Appel à l'API pour uploader les données du formulaire
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    });

    if (!response.ok) {
      // Gérer les erreurs HTTP
      throw new Error("Erreur HTTP : " + response.status);
    }

    const data = await response.json();
    const token = data.token;
    const userId = data.userId;

    localStorage.setItem("token", token);

    form.reset();

    window.location.href = "index.html";

  } catch (error) {
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");
    const existingErrorMessage = passwordInput.nextElementSibling;


    if (!existingErrorMessage || existingErrorMessage.id !== "errorMessage") {
    const messageErreur = document.createElement("p");
    messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe";
    messageErreur.id = "errorMessage"; 
    messageErreur.style.color = "#ff0000"; 
    passwordInput.style.border = "2px solid red";
    emailInput.style.border = "2px solid red";
    passwordInput.parentNode.insertBefore(messageErreur,passwordInput.nextSibling);
    }
  }
});
// Ajout d'un écouteur d'événement pour la saisie dans le champ de mot de passe


