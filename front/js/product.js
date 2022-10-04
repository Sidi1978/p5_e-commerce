
// Récupération de l'id du produit via l' URL

const params = new URLSearchParams(document.location.search); 
const id = params.get("_id");
console.log(id); 

// Récupération des produits et traitement des données 

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
    // execution de la fontion lesProduits
    mesProduits(objetProduits);
  })
  .catch((err) => {
    document.querySelector(".item").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404, sur ressource api: " + err);
  });

// déclaration objet articleClient prêt à être modifiée par les fonctions
let articleClient = {};
articleClient._id = id;

// fonction d'affichage des produits

function mesProduits(produit) {
  // déclaration des variables 
  let imageAlt = document.querySelector("article div.item__img");
  let titre = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");
  let couleurOption = document.querySelector("#colors");
  // boucle pour chercher un indice
  for (let choix of produit) {
    if (id === choix._id) {
      //ajout les éléments de manière dynamique
      imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
      titre.textContent = `${choix.name}`;
      prix.textContent = `${choix.price}`;
      description.textContent = `${choix.description}`;
      // boucle pour les couleurs pour chaque produit  
      for (let couleur of choix.colors) {
        // Ajout les balises d'option couleur avec leur valeur
        couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      }
    }
  }
  console.log("affichage effectué");
}


// choix couleur;  définition des variables
let choixCouleur = document.querySelector("#colors");
choixCouleur.addEventListener("input", (ec) => {
  let couleurProduit;
  couleurProduit = ec.target.value;
  // on ajoute la couleur à l'objet panierClient
  articleClient.couleur = couleurProduit;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(couleurProduit);
});

// choix quantité dynamique
// définition des variables
let choixQuantité = document.querySelector('input[id="quantity"]');
let quantitéProduit;
choixQuantité.addEventListener("input", (eq) => {
  // recuperation la valeur de la cible de l'évenement dans couleur
  quantitéProduit = eq.target.value;
  // on ajoute la quantité à l'objet panierClient
  articleClient.quantité = quantitéProduit;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
  console.log(quantitéProduit);
});

// conditions de validation du clic via le bouton ajouter au panier

let choixProduit = document.querySelector("#addToCart");
choixProduit.addEventListener("click", () => {
  //conditions de validation du bouton ajouter au panier
  if (
    // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, 
    articleClient.quantité < 1 ||
    articleClient.quantité > 100 ||
    articleClient.quantité === undefined ||
    articleClient.couleur === "" ||
    articleClient.couleur === undefined
  ) {
    // joue l'alerte
    alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
    // si ça passe le controle
  } else {
    // joue panier
    Panier();
    console.log("clic effectué");
    //effet visuel
    document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
    document.querySelector("#addToCart").textContent = "Produit ajouté !";
  }
});

// Déclaration de tableaux utiles

let choixProduitClient = [];
// déclaration tableau qui sera ce qu'on récupère du local storage appelé panierStocké 
let produitsEnregistrés = [];
// déclaration tableau qui sera un choix d'article/couleur non présent dans le panierStocké
let produitsTemporaires = [];
// déclaration tableau qui sera la concaténation des produitsEnregistrés 
let produitsAPousser = [];

// fonction commandPremierProduit 

function commandPremierProduit() {
  console.log(produitsEnregistrés);
  if (produitsEnregistrés === null) {
    choixProduitClient.push(articleClient);
    console.log(articleClient);
    return (localStorage.panierStocké = JSON.stringify(choixProduitClient));
  }
}

// fonction commandAutreProduit 
 
function commandAutreProduit() {
  // initialise produitsAPousser 
  produitsAPousser = [];
  produitsTemporaires.push(articleClient);
  produitsAPousser = [...produitsEnregistrés, ...produitsTemporaires];
  //Fonction pour trier et classer les id puis les couleurs 
  produitsAPousser.sort(function triage(a, b) {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    if (a._id = b._id){
      if (a.couleur < b.couleur) return -1;
      if (a.couleur > b.couleur) return 1;
    }
    return 0;
  });
  // initialise produitsTemporaires 
  produitsTemporaires = [];
  return (localStorage.panierStocké = JSON.stringify(produitsAPousser));
}

// fonction qui ajuste la quantité si le produit est déja dans le tableau, ou créait le tableau avec un premier article 

function Panier() {
  // variable qu'on récupère du local storage appelé panierStocké en json
  produitsEnregistrés = JSON.parse(localStorage.getItem("panierStocké"));
  if (produitsEnregistrés) {
    for (let choix of produitsEnregistrés) {
      if (choix._id === id && choix.couleur === articleClient.couleur) {
        //information d'un client
        alert("RAPPEL: Vous aviez déja choisit cet article.");
        //modifie la quantité existant dans le panier du localstorage
        let additionQuantité = parseInt(choix.quantité) + parseInt(quantitéProduit);
        // conversion en JSON le résultat précédent 
        choix.quantité = JSON.stringify(additionQuantité);
        return (localStorage.panierStocké = JSON.stringify(produitsEnregistrés));
      }
    }
    // appel fonction commandAutreProduit 
    return commandAutreProduit();
  }
  // appel fonction commandPremierProduit
  return commandPremierProduit();
}
//--------------------------------------------------------------------------------------------------
