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

