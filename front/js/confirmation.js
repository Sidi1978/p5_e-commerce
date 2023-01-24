sessionStorage.clear();
localStorage.clear();
//  numero de commande
let numCommande = new URLSearchParams(document.location.search).get("commande");
document.querySelector("#orderId").innerHTML = `<br>${numCommande}<br>Merci pour vos achats`;
    
//console.log(" l'orderId venant de l'url est: " + numCommande);
//réinitialisation du numero de commande
   
numCommande = undefined;