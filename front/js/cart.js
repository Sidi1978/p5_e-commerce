
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

// fonction supression d'un article dynamiquement du panier et de de l'affichage
//--------------
function suppression() {
  
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  cartdelete.forEach((cartdelete) => {
    // On écoute s'il y a un clic dans l'article concerné
    cartdelete.addEventListener("click", () => {
      // appel de la ressource du local storage
      let panier = JSON.parse(localStorage.getItem("panierclient"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          // déclaration de variable utile pour la suppression
          const num = [d];
          // création d'un tableau miroir, voir mutation
          let nouveauPanier = JSON.parse(localStorage.getItem("panierclient"));
          //suppression de 1 élément à l'indice num
          nouveauPanier.splice(num, 1);
          //affichage informatif
          if (nouveauPanier && nouveauPanier.length == 0) {
            // si il n'y a pas de panier on créait un H1 informatif et quantité appropriées
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          // on renvoit le nouveau panier converti dans le local storage et on appel la fonction
          localStorage.panierclient = JSON.stringify(nouveauPanier);
          totalProduit(); 
          // on recharge la page qui s'affiche sans le produit grace au nouveau panier
          return location.reload();
        }
    });
  });
}
//-------------
// fonction qui calcule et ajout nombre total produit et coût total
//-------------
function totalProduit() {
  
  let totalArticle = 0;
  let totalPrix = 0;
  const cart = document.querySelectorAll(".cart__item");
  // pour chaque élément cart
  cart.forEach((cart) => {
    //recuperation les quantités des produits grâce au dataset
    totalArticle += JSON.parse(cart.dataset.quantité);
    totalPrix += cart.dataset.quantité * cart.dataset.prix;
  });
  // positionnement sur l'endroit d'affichage nombre d'article
  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}
//------------ fin de fonction totalProduit

//  formulaire
//------------//
// les infos du client seront stockées dans ce tableau pour la commande sur page panier

var contactClient = {};
localStorage.contactClient = JSON.stringify(contactClient);
// on pointe les input prenom nom  et ville
var prenom = document.querySelector("#firstName");
prenom.classList.add("regex_texte");
var nom = document.querySelector("#lastName");
nom.classList.add("regex_texte");
var ville = document.querySelector("#city");
ville.classList.add("regex_texte");
// on pointe l'input adresse
var adresse = document.querySelector("#address");
adresse.classList.add("regex_adresse");
// on pointe l'input email
var email = document.querySelector("#email");
email.classList.add("regex_email");
// on pointe les élément qui ont la classe .regex_texte
var regexTexte = document.querySelectorAll(".regex_texte");
// modification du type de l'input type email à text à cause d'un comportement de l'espace blanc non voulu vis à vis de la regex 
document.querySelector("#email").setAttribute("type", "text");

//-----------
//  regex 
//----------
let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;

//------------------------------

regexTexte.forEach((regexTexte) =>
  regexTexte.addEventListener("input", (e) => {
    valeur = e.target.value;
    // regNormal sera la valeur de la réponse regex, 0 ou -1
    let regNormal = valeur.search(regexLettre);
    if (regNormal === 0) {
        contactClient.firstName = prenom.value;
        contactClient.lastName = nom.value;
        contactClient.city = ville.value;
    }
    if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
    ) {
        contactClient.regexNormal = 3;
    } else {
        contactClient.regexNormal = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regNormal, valeur, regexTexte);
    valideClic();
  })
);

//---------//
// le champ ecouté avec la regex regexLettre et réagir,  grâce a  texteInfo,
//---------//
texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
//--------//
// pour la sécurité du clic 
//--------//

  let regexAdresse = document.querySelector(".regex_adresse");
  regexAdresse.addEventListener("input", (e) => {
    valeur = e.target.value;
    // regNormal sera la valeur de la réponse regex, 0 ou -1
    let regAdresse = valeur.search(regexChiffreLettre);
    if (regAdresse == 0) {
      contactClient.address = adresse.value;
    }
    if (contactClient.address !== "" && regAdresse === 0) {
      contactClient.regexAdresse = 1;
    } else {
      contactClient.regexAdresse = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regAdresse, valeur, regexAdresse);
    valideClic();
  });

//--------//
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//--------------------------
// Ecouter et attribuer de point pour la sécurité du clic 
//------------------------

let regexEmail = document.querySelector(".regex_email");
regexEmail.addEventListener("input", (e) => {
  valeur = e.target.value;
  let regMatch = valeur.match(regMatchEmail);
  let regValide = valeur.search(regValideEmail);
  if (regValide === 0 && regMatch !== null) {
    contactClient.email = email.value;
    contactClient.regexEmail = 1;
  } else {
    contactClient.regexEmail = 0;
  }
  localStorage.contactClient = JSON.stringify(contactClient);
  couleurRegex(regValide, valeur, regexEmail);
  valideClic();
});

//-------------//
// texte sous le champ email
//-------------//

email.addEventListener("input", (e) => {
  valeur = e.target.value;
  let regMatch = valeur.match(regMatchEmail);
  let regValide = valeur.search(regValideEmail);
  if (valeur === "" && regMatch === null) {
    document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
    document.querySelector("#emailErrorMsg").style.color = "white";
    
  } else if ( regValide !== 0) {
    document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
    document.querySelector("#emailErrorMsg").style.color = "white";
    // reste des cas
  } else if (valeur != "" && regMatch == null) {
    document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
    document.querySelector("#emailErrorMsg").style.color = "white";
  } else {
    document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
    document.querySelector("#emailErrorMsg").style.color = "white";
  }
});

//-----------------------------
// fonction couleur Regex pour modifier la couleur de l'input,
//---------------//

let valeurEcoute = "";
// fonction à 3 arguments réutilisable, la regex, la valeur d'écoute, et la réponse à l'écoute
function couleurRegex(regSearch, valeurEcoute, inputAction) {
  if (valeurEcoute === "" && regSearch != 0) {
    inputAction.style.backgroundColor = "white";
    inputAction.style.color = "black";
    
  } else if (valeurEcoute !== "" && regSearch != 0) {
    inputAction.style.backgroundColor = "rgb(220, 50, 50)";
    inputAction.style.color = "white";
    //  le reste des cas 
  } else {
    inputAction.style.backgroundColor = "rgb(0, 138, 0)";
    inputAction.style.color = "white";
  }
}
//---------------------------------------
// fonction d'affichage sous les inputs sauf l'input email
//-------------------------------
function texteInfo(regex, pointage, zoneEcoute) {
      
  zoneEcoute.addEventListener("input", (e) => {
  valeur = e.target.value;
  index = valeur.search(regex);

  if (valeur === "" && index != 0) {
    document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
    document.querySelector(pointage).style.color = "white";
    
  } else if (valeur !== "" && index != 0) {
    document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
    document.querySelector(pointage).style.color = "white";
    // le reste des cas 
  } else {
  document.querySelector(pointage).innerHTML = "Caratères acceptés pour ce champ.";
  document.querySelector(pointage).style.color = "white";
  }
});

}

//-----------------------------------
// Fonction de validation accés au clic du bouton du formulaire
//-----------------------------------

let commande = document.querySelector("#order");
// la fonction est pour valider le clic de commande 
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}
//------------------------------

// Envoi  la commande
//-----------------------------

commande.addEventListener("click", (e) => {
  // empeche de recharger la page on prévient le reload du bouton
  e.preventDefault();
  valideClic();
  envoiPaquet();
});

//-----------------------------
// fonction pour recuperer des id et les mettre dans un tableau
//------------------------------

let panierId = [];
function tableauId() {
  // appel des ressources
   var panier = JSON.parse(localStorage.getItem("panierStocké"));
   if (elementpanier && elementpanier.length > 0) {
     for (let indice of elementpanier) {
     panierId.push(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide !");
}
}
//------------------------------------