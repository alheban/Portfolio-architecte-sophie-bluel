const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;


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

