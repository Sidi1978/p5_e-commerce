
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
