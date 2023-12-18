import { divFiltre } from "./dom.js";

export function createElement(args) {
  const element = document.createElement(args.tag);
  element.innerText = args.text;

  // Ajouter le texte si défini
  if (args.text) {
    element.innerText = args.text;
  }
  // Ajouter la classe si elle est définie
  if (args.className) {
    element.classList.add(args.className);
  }
  if (args.whereAppend) {
    args.whereAppend.appendChild(element);
  }
  args.whereAppend.insertBefore(element, args.whereAppend.children[1]);
  return element;
}

  // Fonction pour ajouter une classe à un élément
 export function addClass(element, className) {
    element.classList.add(className);
  }

  // Fonction pour supprimer une classe d'un élément
 export function removeClass(element, className) {
    element.classList.remove(className);
  }

 export function ajoutLogout() {
    const logoutLien = document.getElementById("login-out");
    logoutLien.innerHTML = "<li>Logout</li>";
    logoutLien.href = "";
    logoutLien.addEventListener("click", () => {
      localStorage.removeItem("token");
    });
  }


  // Fonction pour afficher mode editeur en verifiant le token
  export function isAuthe() {
    let token = localStorage.getItem("token");
    const maDivBarreEdit = document.querySelector(".main_barre_edition");
    const maDivBtnModif = document.querySelector(".btn_modifier");
  
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


/*------ section filtre boutons-----------------------*/
//Fonction activer la classe "active" au bouton
export function activateButton(bouton) {
  document
    .querySelectorAll(".filtre button")
    .forEach((b) => b.classList.remove("active"));
  bouton.classList.add("active");
}
