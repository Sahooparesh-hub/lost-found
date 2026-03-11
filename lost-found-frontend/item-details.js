document.addEventListener("DOMContentLoaded", async () => {

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

if(!itemId){
    alert("Invalid item");
    return;
}

try{

const res = await fetch(`http://127.0.0.1:5000/api/items/${itemId}`);
const item = await res.json();

renderItem(item);

}catch(err){
console.log("Failed to load item",err);
}

});


function renderItem(item){

document.getElementById("itemName").textContent = item.name;

document.getElementById("itemCategory").textContent = item.category;

document.getElementById("itemLocation").textContent = item.location;

document.getElementById("itemDate").textContent = new Date(item.date).toLocaleDateString();

document.getElementById("itemDescription").textContent = item.description;

document.getElementById("ownerName").textContent = item.ownerName || "Unknown";

document.getElementById("itemImage").src =
item.image || "images/default.png";

const statusElement = document.getElementById("itemStatus");

statusElement.textContent = item.status.toUpperCase();

statusElement.classList.add(item.status);

}