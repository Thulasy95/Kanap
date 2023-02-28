//Récupération de l'id de la page produit et nommé par valueID
const linkPage = new URLSearchParams(document.location.search);
const valueId = linkPage.get("id");

//Nombre d'article maximum autorisé 
const MAX_QTE = 100;

//Récupération des données d'un produit de l'API HTTP et converti en données JSON :
const oneProduct = `http://localhost:3000/api/products/${valueId}`;
async function fetchRequestAPIData()
{
    const reponse = await fetch(oneProduct, {
        method:'GET',
        headers: {Accept: "application/json"}
    })

    if (reponse.ok===true)
    {
        return reponse.json();
    }
    throw new Error('Impossible de contacter le serveur')
}

//Traitrement des données JSON du produit et affichage des details du produit
fetchRequestAPIData().then(product => {
    
    //Affiche le nom du produit dans l'onglet
    selectTagWriteText("title",product.name);

    //Affiche l'image du produit
    const divItemImg = document.querySelector(".item__img");
    createIMG(product,divItemImg);

    //Affiche le nom du produit
    selectTagWriteText("#title",product.name);

    //Affiche le prix du produit
    selectTagWriteText("#price",product.price);

    //Affiche la description du produit
    selectTagWriteText("#description",product.description);

    //Affiche dans le menu déroulant les couleurs disponibles du produit
    for (let i = 0; i < product.colors.length; i++)
    {
        const selectColors = document.querySelector("#colors");
        
        const optionElement = document.createElement("option");
        optionElement.value = product.colors[i];
        optionElement.innerText = product.colors[i];
        selectColors.appendChild(optionElement);
    }

    //Fonction pour ajouter le produit, la couleur, et la quantité au panier lors du clic du bouton :
    const buttonAddToCart = document.querySelector("#addToCart");
    buttonAddProduct(buttonAddToCart,product);

});


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

function buttonAddProduct(buttonAddToCart,product)
{
    buttonAddToCart.addEventListener("click", function(){
    
        //retourne l'ID du produit choisie :
        let productIdSelected = product._id;

        //retourne le value de la couleur choisie :
        const colorSelected = document.getElementById('colors');
        let colorValueSelected = colorSelected.value;

        //retourne la quantity choisie :
        const quantitySelected = document.getElementById('quantity');
        let quantityValueSelected = Number(quantitySelected.value);

        //Si couleur différent de "" ET quantité nombre entier ET quantity compris entre 1 et 100
        if(colorValueSelected !=="" && quantityValueSelected >= 1 && quantityValueSelected <= 100 && Number.isInteger(quantityValueSelected)){

            //alors retourner dans un objet l'ID du produit, la couleur et la quantité sélectionné :
            let productSelected = {
                productID: productIdSelected,
                color: colorValueSelected,
                quantity: quantityValueSelected 
            };
             
            //On récupére le panier du local storage (tableau en String)
            let cart = localStorage.getItem("product");
            
            //s'il n'y a pas de panier/tableau (avec produit) dans le local storage
            if(cart == null) {

                //alors on créé un panier/tableau(Array) vide,
                let cart = [];

                //on ajoute une ligne de l'objet produit sélectionné dans le panier/tableau(Array),
                cart.push(productSelected);

                //on sauvegarde le panier/tableau (convertit du Array en String) dans le local storage,
                localStorage.setItem("product",JSON.stringify(cart));

                //et on affiche un message
                alert("Votre premier produit a été ajouté au panier.");

            }
            //si le local storage contient déjà un panier/tableau (avec produit)
            else {
                
                //Alors on récupère le panier/tableau (convertit du string en Array) du local storage,
                cart = JSON.parse(cart);

                let productAlreadyInLocalStorage;

                //on parcours le panier/tableau(Array) pour récupérer le produit s'il est déjà présent dans le panier/tableau
                for(let i=0; i<cart.length; i++)
                {
                    // si le produit sélectionné est dans le panier (meme id et meme couleur)
                    if( productSelected.productID == cart[i].productID && productSelected.color == cart[i].color){

                        //Alors on récupère la ligne du tableau qui contient le même produit,
                        productAlreadyInLocalStorage = cart[i];

                        //on supprime cette ligne pour pouvoir mettre à jour la quantité
                        cart.splice(i,1);

                        //et on sort de la boucle si on a trouvé le produit
                        break;
                    }
                }
                
                //si le produit sélectionné est dans le panier/tableau
                if(productAlreadyInLocalStorage != null){

                    //on additionne la quantité du produit sléctionné et la quantité du produit déjà dans le panier/tableau
                    let quantityTotal = productAlreadyInLocalStorage.quantity + productSelected.quantity;

                    //si la quantité totale est inférieure à la quantité maximum autorisée
                    if(quantityTotal <= MAX_QTE){

                    //alors on modifie la quantité du produit déjà dans le tableau par la quantité totale,
                    productAlreadyInLocalStorage.quantity = quantityTotal;

                    }
                    else{

                    //sinon on modifie la quantité du produit déjà dans le tableau par la quantité maximum autorisée,
                    productAlreadyInLocalStorage.quantity = MAX_QTE;

                    }

                    //on ajoute la ligne de l'objet du même produit avec la quantité modifiée dans le panier/tableau(Array),
                    cart.push(productAlreadyInLocalStorage);

                    //on sauvegarde le panier/tableau (convertit du Array en String) avec la quantité modifiée dans le local storage,
                    localStorage.setItem("product",JSON.stringify(cart));

                    //on affiche un message
                    alert("La quantité du produit sélectionné a été modifiée dans le panier. ("+ productAlreadyInLocalStorage.quantity+" articles)");
               
                }
                //si le produit sélectionné n'est pas dans le panier
                else{

                    //alors on ajoute une ligne de l'objet produit sélectionné dans le panier/tableau(Array),
                    cart.push(productSelected);

                    //on sauvegarde le panier/tableau (convertit du Array en String) dans le local storage,
                    localStorage.setItem("product",JSON.stringify(cart));

                    //et on affiche un message
                    alert("Votre produit a été ajouté au panier.");

                }
            }
            //console.log(cart);
        } 
        // Sinon afficher message d'erreur
        else {

            alert("Merci de verifier que vous avez seléctionné une couleur et une quantité compris entre 1 et 100.");

        }
    });
}














