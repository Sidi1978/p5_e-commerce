
var elementpanier =JSON.parse(localStorage.getItem("panierclient"));
//console.log(elementpanier);

// Récupération des produits de l'api
//----------------------------------------------------------------
// appel de la ressource api product si je suis sur la page panier

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
      //console.log(objetProduits);
      // appel de la fonction affichagePanier
      affichagePanier(objetProduits);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
  });
 

//-------
// Fonction d'affichage les produits du panier
//--------
function affichagePanier(index) {
  // on récupère le panier converti
  var panier =[];
  //console.log(elementpanier);
  if (elementpanier && elementpanier.length != 0) {
    // zone de clef/valeur de l'api et du panier 
    for (let choix of elementpanier) {
      console.log(choix);
      for (let g = 0, h = index.length; g < h; g++) {
        if (choix._id === index[g]._id) {
          choix.name = index[g].name;
          choix.prix = index[g].price;
          choix.image = index[g].imageUrl;
          choix.description = index[g].description;
          choix.alt = index[g].altTxt;
        }
      }
    }
    // j' appele la fonction affiche, 
    affiche(elementpanier);
  } else {
    // on crée un h1 qui informe quantité null
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  // appel ses fontion  pour etre a l'ecoute
  //suppression();
  //modifQuantité();
  
  
}
//---------
//Fonction d'affichage de :  panier
//----------
function affiche(indexé) {
  // on déclare et on pointe la zone d'affichage
  let zonePanier = document.querySelector("#cart__items");
  zonePanier.innerHTML += indexé.map((choix) => 
  `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
    <div class="cart__item__img">
      <img src="${choix.image}" alt="${choix.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${choix.name}</h2>
        <span>couleur : ${choix.couleur}</span>
        <p data-prix="${choix.prix}">${choix.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); 
  // fonction qui totalise les produis  
  totalProduit();
}

//...........
// fonctio modification dynamiquement les quantités des produits dans panier
//----------
function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
  // On écoute ce qui se passe dans itemQuantity de l'article concerné
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      //var element = JSON.parse(localStorage.getItem("panierStocké"));
      for (article of elementpanier)
        if (article._id === cart.dataset.id && cart.dataset.couleur === article.couleur ) 
        {
          let somme = parseInt(eq.target.value);
          console.log(somme);
          if (somme < 101 && somme > 0){
            article.quantité = eq.target.value;
            localStorage.panierStocké = JSON.stringify(elementpanier);
            // on met à jour le dataset quantité
            cart.dataset.quantité = eq.target.value;
            // on appel la fonction pour actualiser les données
            totalProduit();
          }
          else{
            alert("choisissez une valeur entre 1 et 100")
          }
          
          
        }
    });
  });
}

//...................
