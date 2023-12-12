
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

