/*****************************Partie Produits du Panier*****************************/


//Récupération du panier(Array) :
let cart = getArrayCartFromLocalStorage("product");
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

    //On change le titre de l'onglet Cart par Votre panier
    selectTagWriteText("title","Votre panier");
    
    //s'il n'y a pas de produits dans le panier et donc dans le local storage
    if(cart == null){
    
        //Alors on écrit votre panier est vide
        selectTagWriteText("h1","Votre panier est vide.");

        //Alors on écrit 0 nombres d'articles
        selectTagWriteText("#totalQuantity","0");

        //Alors on écrit 0 €
        selectTagWriteText("#totalPrice","0");
    
    }
    //si le local storage contient déjà un panier/tableau (avec produits)
    else {
    
        //Efface le contenu de <section id="cart__items">
        document.querySelector("#cart__items").innerHTML = ""; 
        
        //Affiche le panier :
        displayCart(products);

    }
});


/**
 * fonction pour afficher le panier
 * @param { String } products - liste des produits de l'API
 */
function displayCart(products)
{
        
    for (let i = 0; i < cart.length; i++)
    {
        //<section id="cart__items">
        const sectionCartItems = document.querySelector("#cart__items");

        //<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
        const articleElement = createTagWithClass("article","cart__item",sectionCartItems);
        articleElement.setAttribute("data-id",cart[i].productID);
        articleElement.setAttribute("data-color",cart[i].color);

        //<div class="cart__item__img">
        const divImgElement = createTagWithClass("div","cart__item__img",articleElement);

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
        const divContentElement = createTagWithClass("div","cart__item__content",articleElement);

        //<div class="cart__item__content__description">
        const divDescriptionElement = createTagWithClass("div","cart__item__content__description",divContentElement);

        //<h2>Nom du produit</h2>
        const h2Element = createTagWithText("h2",productDetails.name,divDescriptionElement);

        //<p>Vert</p>
        const pColorElement = createTagWithText("p",cart[i].color,divDescriptionElement);

        //<p>42,00 €</p>
        const pPriceElement = createTagWithText("p",productDetails.price+" €",divDescriptionElement);

        //<div class="cart__item__content__settings">
        const divSettingsElement = createTagWithClass("div","cart__item__content__settings",divContentElement);

        //<div class="cart__item__content__settings__quantity">
        const divQuantityElement = createTagWithClass("div","cart__item__content__settings__quantity",divSettingsElement);

        //<p>Qté : </p>
        const pQuantityElement = createTagWithText("p","Qté : ",divQuantityElement);

        //<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
        const inputItemQuantityElement = createInputNumber("itemQuantity","itemQuantity",cart[i].quantity,1,100,divQuantityElement);
        //lorsqu'il y a changement de quantité :
        inputItemQuantityElement.addEventListener("change", function(event){
            
            //on appelle la fonction changeQuantity à l'input où la quantité est modifiée :
            changeQuantity(event.target);
            //on recalcule la quantité et le prix :
            displayCartTotalQuantity(cart);
            displayCartTotalPrice(cart,products);

        });

        //<div class="cart__item__content__settings__delete">
        const divDeleteElement = createTagWithClass("div","cart__item__content__settings__delete",divSettingsElement);

        //<p class="deleteItem">Supprimer</p>
        const pDeleteItemElement = createTagWithClass("p","deleteItem",divDeleteElement);
        pDeleteItemElement.innerText = "Supprimer";
        //lorsqu'il y a suppression du produit :
        pDeleteItemElement.addEventListener("click", function(event){
            
            //on appelle la fonction deleteProduct au click sur supprimer du produit sélectionné :
            deleteProduct(event.target);
            //on recalcule la quantité et le prix :
            displayCartTotalQuantity(cart);
            displayCartTotalPrice(cart,products);

        });
    }

    //Affiche le nombre d'articles total du panier :
    displayCartTotalQuantity(cart);

    //Affiche le prix total du panier :
    displayCartTotalPrice(cart,products);

}


/**
 * fonction pour afficher le nombre d'articles total du panier
 * @param { String } cart - liste des produits dans le panier
 */
function displayCartTotalQuantity(cart){

    let totalCartQuantity = 0;

    for(k=0; k<cart.length; k++){

        totalCartQuantity += parseInt(cart[k].quantity);
    }

    //<span id="totalQuantity"><!-- 2 --></span>
    selectTagWriteText("#totalQuantity",totalCartQuantity);

}


/**
 * fonction pour afficher le prix total du panier
 * @param { String } cart - liste des produits dans le panier
 * @param { String } products - liste des produits de l'API
 */
function displayCartTotalPrice(cart,products){
    
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

    //<span id="totalPrice"><!-- 84,00 --></span>
    selectTagWriteText("#totalPrice",totalCartPrice);

}


/**
 * fonction pour modifier la quantité du produit
 * @param { String } products - liste des produits de l'API
 */
function changeQuantity(inputChangeQuantity){
       
    //retourne la quantité modifiée :
    let newQuantitySelected = inputChangeQuantity.value;

    //recherche la balise article le plus proche
    let articleClosestElement = inputChangeQuantity.closest("article");

    //pour retourner l'id et la couleur du produit où la quantité a été modifiée
    let productIdOfChangeQuantity = articleClosestElement.dataset.id;
    let colorOfChangeQuantity = articleClosestElement.dataset.color;

    let productAlreadyInLocalStorage;
    for (let i=0; i<cart.length; i++){
        
        //Si on trouve le même id et la même couleur dans le panier 
        if(productIdOfChangeQuantity == cart[i].productID && colorOfChangeQuantity == cart[i].color){
            
            //on change la quantité du produit du panier
            productAlreadyInLocalStorage = cart[i];
            productAlreadyInLocalStorage.quantity = newQuantitySelected;
            cart.splice(i,1,productAlreadyInLocalStorage);
            break;
        }
    }
    
    //on le sauvegarde dans le localstorage 
    localStorage.setItem("product",JSON.stringify(cart));

}


/**
 * fonction pour supprimer le produit
 * @param { String } products - liste des produits de l'API
 */
function deleteProduct(clickDeleteProduct){

    //recherche la balise article le plus proche
    let articleClosestElement = clickDeleteProduct.closest("article");

    //pour retourner l'id et la couleur du produit où la quantité a été modifiée
    let productIdOfDeleteProduct = articleClosestElement.dataset.id;
    let colorOfDeleteProduct = articleClosestElement.dataset.color;

    for (let i=0; i<cart.length; i++){
    
        //Si on trouve le même id et la même couleur dans le panier 
        if(productIdOfDeleteProduct == cart[i].productID && colorOfDeleteProduct == cart[i].color){
            
            //on supprime l'objet produit du panier et on sort de la boucle
            cart.splice(i,1);
            break;
        }
    }

    //On le sauvegarde dans le localstorage
    localStorage.setItem("product",JSON.stringify(cart));

    //Si le panier est vide dans le localstorage :
    if(cart.length===0){

        //alors on vide le localstorage
        localStorage.clear();
    }

    //on raffraichît la page panier
    location.reload();  

}


/*****************************Partie Formulaire de Commande*****************************/


//Fonction pour commander lors du clic sur "Commander" :
const formCartOrderElement = document.querySelector(".cart__order__form");
formCartOrderElement.addEventListener("submit", function(event){

    //pour ne pas changer l’URL de l’onglet et initier le chargement d’une nouvelle page, on ajoute :
    event.preventDefault();

    //on crée l'objet Contact :
    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const address = document.querySelector("#address");
    const city = document.querySelector("#city");
    const email = document.querySelector("#email");

    let contact = {

        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value

    };

    //Récupération du tableau des produits(panier) du localstorage :
    let cart = getArrayCartFromLocalStorage("product");

    //Si le panier est vide :
    if(cart == null){

        //alors on retourne un message d'alerte :
        alert("Attention votre panier est vide. Pour commander, merci d'ajouter au moins un produit au panier.");
    
    } else {

        //Sinon on créé un tableau avec les ids des produits du panier :  
        let productsId = [];

        for(i=0;i<cart.length;i++){
    
            productsId.push(cart[i].productID);

        }

 /*       //on définit les regex pour les champs de saisies du formulaire :
        const firstLastNameRegExp = /^[A-Za-z]+$/;
        const addressCityRegExp = /^[0-9a-zA-Z]+$/;
        const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        //et si les données saisies dans le formulaire sont tous validées :
        if(firstLastNameRegExp.test(firstName.value) && firstLastNameRegExp.test(lastName.value) && addressCityRegExp.test(address.value) && addressCityRegExp.test(city.value) && emailRegExp.test(email.value)){
*/
            //alors on envoie l'objet order convertit en String à l'API :
            let order = {
                contact,
                products:productsId
            };

            const orderAPI = `http://localhost:3000/api/products/order`;
            fetch(orderAPI,{
                method:'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(order)
            })
            .then(response => response.json())
            .then(orders => {

                //on vide le panier du local storage :
                localStorage.clear();

                //on vide les champs de saisies du formulaire :
                formCartOrderElement.reset();

                //et on va sur la page confirmation :
                document.location.href=`./confirmation.html?orderId=${orders.orderId}`;

            })
            .catch(()=>{new Error('Impossible de contacter le serveur pour envoyer les commandes')});
            
/*        } else {

            //Sinon on un affiche le message d'alerte
            alert("Merci de vérifier vos champs de saisie dans le formulaire de commande.");

            //Et les messages d'erreur dans les champs de saisies incorrectes :
            firstName.addEventListener("change", function(){
            
                //Si le champs prénom n'est pas valide : 
                if(!firstLastNameRegExp.test(firstName.value)){
                    
                    //Alors on affiche le message d'erreur :
                    document.querySelector("#firstNameErrorMsg").innerText = "Le prénom ne peut contenir que des lettres majuscules et miniuscules";
                }     
            });
        
            lastName.addEventListener("change", function(){
            
                //Si le champs prénom n'est pas valide : 
                if(!firstLastNameRegExp.test(lastName.value)){
                    
                    //Alors on affiche le message d'erreur :
                    document.querySelector("#lastNameErrorMsg").innerText = "Le nom ne peut contenir que des lettres majuscules et miniuscules";
                }     
            });
        
            address.addEventListener("change", function(){
            
                //Si le champs prénom n'est pas valide : 
                if(!addressCityRegExp.test(address.value)){
                    
                    //Alors on affiche le message d'erreur :
                    document.querySelector("#addressErrorMsg").innerText = "L'adresse ne peut contenir que des lettres majuscules, miniuscules et des chiffres";
                
                }     
            });
        
            city.addEventListener("change", function(){
            
                //Si le champs prénom n'est pas valide : 
                if(!addressCityRegExp.test(city.value)){
                    
                    //Alors on affiche le message d'erreur :
                    document.querySelector("#cityErrorMsg").innerText = "La ville ne peut contenir que des lettres majuscules, miniuscules et des chiffres";
                
                }     
            });
        
            email.addEventListener("change", function(){
            
                //Si le champs prénom n'est pas valide : 
                if(!emailRegExp.test(email.value)){
                    
                    //Alors on affiche le message d'erreur :
                    document.querySelector("#emailErrorMsg").innerText = "L'email doit contenir un @.";                                
                
                }     
            });
        }*/
    }    
});