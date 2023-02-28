//Récupération des données de l'API HTTP et converti en données JSON :
const allProducts = 'http://localhost:3000/api/products';
async function fetchRequestAPIData()
{
    const reponse = await fetch(allProducts, {
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
fetchRequestAPIData().then(products => {
    
    //Efface le contenu de <section class="items">
    document.querySelector(".items").innerHTML = ""; 
    
    //Affiche les produits de l'API :
    display(products);
});


/**
 * fonction pour afficher les produits de l'API dans la page d'accueil 
 * @param { String } products - liste des produits
 */
function display(products)
{
    for (let i = 0; i < products.length; i++)
    {
        //Sélection de l'endroit où les balises doivent s'afficher, ici dans la balise section nommer par la classe items
        const sectionItems = document.querySelector(".items");
        
        //Création des balises HTML :
        const linkElement = document.createElement("a"); //balise a créée
        linkElement.setAttribute('href',`./product.html?id=${products[i]._id}`); // attribut href créé
        sectionItems.appendChild(linkElement); //<a> rattachée à <section class="items">

        const articleElement = document.createElement("article");
        linkElement.appendChild(articleElement);

        createIMG(products[i],articleElement);
        
        createTextWithClass("h3",products[i].name,'productName',articleElement);

        createTextWithClass("p",products[i].description,'productDescription',articleElement);  
    }
}


/**
 * Création d'une balise img avec les attributs src et alt qui contient l'image du produit 
 * @param { String } item - image du produit
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function createIMG(item,parent)
{
    const imageElement = document.createElement("img");
    imageElement.src = item.imageUrl;
    imageElement.alt = item.altTxt;
    parent.appendChild(imageElement);
}


/**
 * Création d'une balise avec un attribut class qui contient du texte 
 * @param { "String" } tag - balise HTML entre " "
 * @param { String } itemText - texte contenu dans la balise HTML
 * @param { 'String' } classAttribute - nom de la classe entre ' '
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function createTextWithClass(tag,itemText,classAttribute,parent)
{
    const textElement = document.createElement(tag);
    textElement.innerText = itemText;
    textElement.setAttribute('class',classAttribute);
    parent.appendChild(textElement);
}