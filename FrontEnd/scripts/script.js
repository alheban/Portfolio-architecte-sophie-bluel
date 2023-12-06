
let listProjets = []; // Initialisation avec un tableau vide

async function getWorksApi() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    listProjets.length = 0; // Vider le tableau plutôt que de le réaffecter
    listProjets.push(...data); // Ajouter les nouveaux projets au tableau existant

    return listProjets;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
  }
}

/*------ Sélectionner la section dans le DOM-------*/
const sectionFiltre = document.getElementById("portfolio");
const sectionPortfolio = document.querySelector(".gallery");

/*------ creation div avec les boutons filtre projet-------*/
const divFiltre = document.createElement("div");
divFiltre.classList.add("filtre");
sectionFiltre.appendChild(divFiltre);
// Ajouter la nouvelle div comme premier enfant à l'élément avec l'ID "portfolio"
sectionFiltre.insertBefore(divFiltre, sectionFiltre.children[1]);

/* -----------------creation du bouton tous -----------------------*/
const tousButton = document.createElement("button");
tousButton.innerText = "Tous";
divFiltre.appendChild(tousButton);
tousButton.classList.add("active");
tousButton.addEventListener("click", () => {
  creerGalerieProjets(listProjets);
  activerBouton(tousButton);
});



/* -----------------Fonction pour creer les boutons par catégories-----------------------*/
  function creerBoutonFiltre(categorieName) {
    const buttonFiltre = document.createElement("button");
    buttonFiltre.innerText = categorieName;
    buttonFiltre.addEventListener("click", () => {
      filtrerParCategorie(categorieName);
      activerBouton(buttonFiltre);
      
    });
    return buttonFiltre;
  }

/* -----------------Fonction pour filtrer et afficher les boutons par catégories sans doublons-----------------------*/
function filtrerLesBouton() {
  // Créer un ensemble pour suivre les catégoriesname déjà ajoutées
  const categoriesNameAjoutees = new Set();
  listProjets.forEach((workname) => {
    const categorieName = workname.category.name;
    if (!categoriesNameAjoutees.has(categorieName)) {
      const buttonFiltre = creerBoutonFiltre(categorieName);
      divFiltre.appendChild(buttonFiltre);
      categoriesNameAjoutees.add(categorieName);
    }
  });
  
}
/* -----------------Fonction pour ajouter la classe "active" au bouton filtres cliqué -----------------------*/
function activerBouton(bouton) {
  // Retirer la classe "active" de tous les boutons
  document.querySelectorAll(".filtre button").forEach((b) => b.classList.remove("active"));
  bouton.classList.add("active");
}

/* -----------------Filtrer les projets en fonction de la catégorie sélectionnée -----------------------*/
function filtrerParCategorie(categorieName) {
  const projetsFiltres = listProjets.filter((work) => work.category.name === categorieName);
  creerGalerieProjets(projetsFiltres);
}

/* -----------------fonction creation galerie des projets-----------------------*/
function creerGalerieProjets(projetsgalerie) {
  sectionPortfolio.innerHTML = ""; // Nettoyer la section de la galerie avant d'ajouter les nouveaux projets
  // Boucle galerie pour chaque projet filtré
  projetsgalerie.forEach((work) => {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    sectionPortfolio.appendChild(figureElement);
  });
}
/* -----------------Mode editeur-----------------------*/
function isAuthe() {
  let token = localStorage.getItem("token");
  const maDivBarreEdit = document.querySelector(".main_barre_edition");
  const maDivBtnModif = document.querySelector(".btn_modifier");
  const modalContainer = document.querySelector(".modal-container");
  const modalTriggers = document.querySelectorAll(".modal-trigger");

  modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

  function toggleModal (){
    modalContainer.classList.toggle("active");
  }

  if (token===null) {
    console.log("Aucun token trouvé dans le localStorage");
    maDivBarreEdit.style.display = "none";
    maDivBtnModif.style.display = "none";
    
  } else {
    console.log("Token présent :", token);
    divFiltre.remove();
    ajoutLogout();
    maDivBarreEdit.style.display = "flex";
    maDivBtnModif.style.display = "flex";
    
  }
}
function ajoutLogout() {
  const logoutLien = document.getElementById("login-out");
  logoutLien.innerHTML = "<li>Logout</li>";
  logoutLien.href = "";
  logoutLien.addEventListener("click",() => { 
    localStorage.removeItem("token");

  });
}

// Appeler la fonction getWorksApi pour récupérer les projets depuis l'API
getWorksApi().then((projetsRecuperes) => {
  creerGalerieProjets(listProjets);
  activerBouton(tousButton);
  filtrerLesBouton();
});
isAuthe();


