//On récupére le panier du local storage (tableau en String)
let cart = localStorage.getItem("product");
//et on convertit du string en Array le panier/tableau du local storage,
cart = JSON.parse(cart);

console.log(cart);

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
    
    //Efface le contenu de <section id="cart__items">
    document.querySelector("#cart__items").innerHTML = ""; 
    
    //Affiche le panier :
    displayCart(products);

    //Affiche le nombre d'articles total du panier :
    displayCartTotalQuantity();

    //Affiche le prix total du panier :
    displayCartTotalPrice(products);
    
});

/**
 * fonction pour afficher le panier
 * @param { String } products - liste des produits de l'API
 */
function displayCart(products)
{
    //On change le titre de l'onglet Cart par Votre panier
    selectTagWriteText("title","Votre panier");

    for (let i = 0; i < cart.length; i++)
    {
        //<section id="cart__items">
        const sectionCartItems = document.querySelector("#cart__items");

        //<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
        const articleElement = document.createElement("article");
        articleElement.setAttribute("class","cart__item");
        articleElement.setAttribute("data-id",`${cart[i].productID}`);
        articleElement.setAttribute("data-color",`${cart[i].color}`);
        sectionCartItems.appendChild(articleElement);

        //<div class="cart__item__img">
        const divImgElement = document.createElement("div");
        divImgElement.setAttribute("class","cart__item__img");
        articleElement.appendChild(divImgElement);

        //<img src="../images/product01.jpg" alt="Photographie d'un canapé">
        let productDetails;
        for (let j = 0; j < products.length; j++)
        {
            if(cart[i].productID == products[j]._id)
            {
                productDetails = products[j];
                break;
            }
        }
        createIMG(productDetails,divImgElement);

        //<div class="cart__item__content">
        const divContentElement = document.createElement("div");
        divContentElement.setAttribute("class","cart__item__content");
        articleElement.appendChild(divContentElement);

        //<div class="cart__item__content__description">
        const divDescriptionElement = document.createElement("div");
        divDescriptionElement.setAttribute("class","cart__item__content__description");
        divContentElement.appendChild(divDescriptionElement);

        //<h2>Nom du produit</h2>
        const h2Element = document.createElement("h2");
        h2Element.innerText = productDetails.name;
        divDescriptionElement.appendChild(h2Element);

        //<p>Vert</p>
        const pColorElement = document.createElement("p");
        pColorElement.innerText = cart[i].color;
        divDescriptionElement.appendChild(pColorElement);

        //<p>42,00 €</p>
        const pPriceElement = document.createElement("p");
        pPriceElement.innerText = productDetails.price+" €";
        divDescriptionElement.appendChild(pPriceElement);

        //<div class="cart__item__content__settings">
        const divSettingsElement = document.createElement("div");
        divSettingsElement.setAttribute("class","cart__item__content__settings");
        divContentElement.appendChild(divSettingsElement);

        //<div class="cart__item__content__settings__quantity">
        const divQuantityElement = document.createElement("div");
        divQuantityElement.setAttribute("class","cart__item__content__settings");
        divSettingsElement.appendChild(divQuantityElement);

        //<p>Qté : </p>
        const pQuantityElement = document.createElement("p");
        pQuantityElement.innerText = "Qté :";
        divQuantityElement.appendChild(pQuantityElement);

        //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
        const inputItemQuantityElement = document.createElement("input");
        inputItemQuantityElement.setAttribute("type","number");
        inputItemQuantityElement.setAttribute("class","itemQuantity");
        inputItemQuantityElement.setAttribute("name","itemQuantity");
        inputItemQuantityElement.setAttribute("min","1");
        inputItemQuantityElement.setAttribute("max","100");
        inputItemQuantityElement.setAttribute("value",`${cart[i].quantity}`);
        divQuantityElement.appendChild(inputItemQuantityElement);

        //<div class="cart__item__content__settings__delete">
        const divDeleteElement = document.createElement("div");
        divDeleteElement.setAttribute("class","cart__item__content__settings__delete");
        divSettingsElement.appendChild(divDeleteElement);

        //<p class="deleteItem">Supprimer</p>
        const pDeleteItemElement = document.createElement("p");
        pDeleteItemElement.setAttribute("class","deleteItem");
        pDeleteItemElement.innerText = "Supprimer";
        divDeleteElement.appendChild(pDeleteItemElement);
    }
}


/**
 * fonction pour afficher le nombre d'articles total du panier
 */
function displayCartTotalQuantity(){
    //<span id="totalQuantity"><!-- 2 --></span>
    let totalCartQuantity = 0;
    for(k=0; k<cart.length; k++){
        totalCartQuantity += cart[k].quantity;
    }
    selectTagWriteText("#totalQuantity",totalCartQuantity);
}


/**
 * fonction pour afficher le prix total du panier
 * @param { String } products - liste des produits de l'API
 */
function displayCartTotalPrice(products){
    //<span id="totalPrice"><!-- 84,00 --></span>
    let totalCartPrice = 0;
    let productPrice;
    for(l=0; l<cart.length; l++){
        for(m=0; m<products.length; m++){
            if(cart[l].productID == products[m]._id){
                productPrice = products[m].price;
                break;
            }
        }
        totalCartPrice += (cart[l].quantity * productPrice);
    }
    selectTagWriteText("#totalPrice",totalCartPrice);
}


/**
 * Création d'une balise qui contient du texte 
 * @param { "String" } tag - balise HTML entre " "
 * @param { String } itemText - texte contenu dans la balise HTML
*/
function selectTagWriteText(tag,itemText)
{
    const textElement = document.querySelector(tag);
    textElement.innerText = itemText;
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