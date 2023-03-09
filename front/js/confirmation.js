//On récupère l'orderId de la page confirmation et nommé par valueOrderId
const linkPage = new URLSearchParams(document.location.search);
const valueOrderId = linkPage.get("orderId");

//et on l'insère dans le texte du <span id="orderId">
document.querySelector("#orderId").innerText= " "+valueOrderId+" ";