//import donnees api
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

// Sélectionner la section dans le DOM
const sectionFiltre = document.getElementById("portfolio");
const sectionPortfolio = document.querySelector(".gallery");

// creation div
const DivFiltre = document.createElement("div");
sectionFiltre.appendChild(DivFiltre);
DivFiltre.classList.add("filtre");

//créer btn tous
const tousButton = document.createElement("button");
tousButton.innerText = "Tous";
DivFiltre.appendChild(tousButton);
tousButton.classList.add("active");
tousButton.addEventListener("click", () => {
    afficherProjetsFiltres(projets)
    activerBouton(tousButton);
    
});

// Ajouter la nouvelle div comme premier enfant à l'élément avec l'ID "portfolio"
sectionFiltre.insertBefore(DivFiltre, sectionFiltre.children[1]);

// Créer un ensemble pour suivre les catégoriesname déjà ajoutées
const categoriesNameAjoutees = new Set();

//Filtrer les projets en fonction de la catégorie sélectionnée
function filtrerParCategorie(categorieName) {
    const projetsFiltres = projets.filter(work => work.category.name === categorieName);
    afficherProjetsFiltres(projetsFiltres);
  }


// Fonction pour ajouter la classe "active" au bouton cliqué
function activerBouton(bouton) {
    // Retirer la classe "active" de tous les boutons
    document.querySelectorAll(".filtre button").forEach(b => b.classList.remove("active"));
    // Ajouter la classe "active" au bouton cliqué
    bouton.classList.add("active");
}


//boucle pour filtre
projets.forEach((work) => {
  const categorieName = work.category.name;
  if (!categoriesNameAjoutees.has(categorieName)) {
    const buttonFiltre = document.createElement("button");
    buttonFiltre.innerText = categorieName;

    buttonFiltre.addEventListener("click", () => {
    filtrerParCategorie(categorieName);
    activerBouton(buttonFiltre);

    });

    DivFiltre.appendChild(buttonFiltre);
    categoriesNameAjoutees.add(categorieName);
  }

});

// Fonction pour afficher les projets filtrés
function afficherProjetsFiltres(projetsFiltres) {
    // Nettoyer la section de la galerie avant d'ajouter les nouveaux projets
    sectionPortfolio.innerHTML = '';

    // Boucle galerie pour chaque projet filtré
    projetsFiltres.forEach((work) => {
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = work.title;

        // Ajouter les nouveaux éléments au DOM dans la section de la galerie
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
        sectionPortfolio.appendChild(figureElement);
    });
}
afficherProjetsFiltres(projets);


