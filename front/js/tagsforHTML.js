/**************** Functions Cart ************************/
/**
 * Récupération du panier  
 * @param { String } item - image du produit
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function getArrayCartFromLocalStorage(key) {
    
    //On récupére le panier(String) du local storage
    let cart = localStorage.getItem(key);
    //et on convertit ce panier du string en Array.
    cart = JSON.parse(cart);
    
    return cart;

}

/**
 * Création d'une balise img avec les attributs src et alt qui contient l'image du produit 
 * @param { String } item - image du produit
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function setStringCartInLocalStorage(cart,objectPushed,key){

    //on ajoute une ligne objet dans le panier(Array),
    cart.push(objectPushed);
    //et on sauvegarde le panier, convertit du Array en String, dans le local storage,
    localStorage.setItem(key,JSON.stringify(cart));

}

/**************** End of Functions Cart *****************/

/**************** Functions Tags for Html ***************/

/**
 * Création d'une balise a avec l'attribut href 
 * @param { "String" } hrefValue - valeur de l'attribut href entre " "
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 * */
function createAHref(hrefValue,parent){

    //balise a créée
    const aElement = document.createElement("a"); 
    // attribut href créé
    aElement.setAttribute('href',hrefValue);
    //<a href=...> rattachée à <section class="items">
    parent.appendChild(aElement); 

    return aElement;
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


/**
 * Création d'une balise qui contient du texte 
 * @param { "String" } tag - balise HTML entre " "
 * @param { String } textValue - texte contenu dans la balise HTML
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function createTagWithText(tag,textValue,parent){

    const textElement = document.createElement(tag);
    textElement.innerText = textValue;
    parent.appendChild(textElement);

    return textElement;

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
 * Création d'une balise option qui contient du texte et une value
 * @param { String } value - valeur du value
 * @param { String } text - texte contenu dans la balise HTML
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function createOption(value,text,parent){

    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.innerText = text;
    parent.appendChild(optionElement);

    return optionElement;
}


/**
 * Création d'une balise qui contient une class 
 * @param { "String" } tag - balise HTML entre " "
 * @param { "String" } classValue - nom de la class entre " "
 * @param { String } parent - nom du parent où la balise HTML est rattachée
 */
function createTagWithClass(tag,classValue,parent){

    const tagElement = document.createElement(tag);
    tagElement.setAttribute("class",classValue);
    parent.appendChild(tagElement);

    return tagElement;

}


function createInputNumber(classe,name,value,min,max,parent){
    
    const inputNumberElement = document.createElement("input");
    inputNumberElement.setAttribute("type","number");
    inputNumberElement.setAttribute("class",classe);
    inputNumberElement.setAttribute("name",name);
    inputNumberElement.setAttribute("min",min);
    inputNumberElement.setAttribute("max",max);    
    inputNumberElement.setAttribute("value",value );
    parent.appendChild(inputNumberElement);
    
    return inputNumberElement;   

}
