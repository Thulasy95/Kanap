//Récupération des données de l'API HTTP et converti en données JSON :
async function fetchRécupérerProduits()
{
    const reponse = await fetch('http://localhost:3000/api/products', {
        method:'GET', // on veut obtenir les informations
        headers: {Accept: "application/json"} // on accepte que le format json
    })

    if (reponse.ok===true) // si le statut est ok
    {
        return reponse.json(); //alors nous converti les données en JSON
    }
    throw new Error('Impossible de contacter le serveur') //sinon affiche l'erreur
}

//Traitrement des données JSON
fetchRécupérerProduits().then(produits => {
    console.log(produits);
    //efface le contenu de <section class="items">
    document.querySelector(".items").innerHTML = ""; 
    //Affiche les produits de l'API :
    insererProduits(produits);
});
//catch ?? faut-il le mettre ?

// fonction pour Afficher les produits de l'API dans la page d'accueil
function insererProduits(produits)
{
    for (let i = 0; i < produits.length; i++)
    {
        //Sélection de l'endroit où les balises doivent s'afficher, ici dans la balise section nommer par la classe items
        const sectionItems = document.querySelector(".items");
        
        //Création des balises HTML :
        const lienElement = document.createElement("a");
        lienElement.setAttribute('href',''); // attribut href créé
        lienElement.href = './product.html?id='+produits[i]._id; // valeur de l'attribut href modifiée
        
        const produitsElement = document.createElement("article");
        
        const imageElement = document.createElement("img");
        imageElement.src = produits[i].imageUrl; // attribut src
        imageElement.alt = produits[i].altTxt; // attribut alt
        
        const nomElement = document.createElement("h3");
        nomElement.innerText = produits[i].name; // texte de h3
        nomElement.setAttribute('class','productName'); // attribut class

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = produits[i].description; // texte de p
        descriptionElement.setAttribute('class','productDescription'); // attribut class

        //Rattachement des balises au DOM :
        // <section class="items"> contient <a>
        sectionItems.appendChild(lienElement); //balise a
        // <a> contient <article>
        lienElement.appendChild(produitsElement); //balise article
        // <article> contient <img>, <h3> et <p>
        produitsElement.appendChild(imageElement); //balise img
        produitsElement.appendChild(nomElement); //balise h3
        produitsElement.appendChild(descriptionElement); //balise p
        
    }
}