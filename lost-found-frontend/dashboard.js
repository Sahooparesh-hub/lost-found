let allItems = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("token");

if (!token) {
window.location.href = "login.html";
return;
}

try {

const response = await fetch("http://127.0.0.1:5000/api/items",{
headers:{ "Authorization":`Bearer ${token}` }
});

allItems = await response.json();

renderItems(allItems);

}
catch(error){

console.log("Failed to load items");

document.getElementById("itemsContainer").innerHTML =
"<p>Error loading items.</p>";

}

document
.getElementById("searchInput")
.addEventListener("input", applyFilters);


document
.getElementById("categoryBtn")
.addEventListener("click",toggleCategoryDropdown);

document
.querySelectorAll(".category-chip")
.forEach(btn=>{

btn.addEventListener("click",()=>{

activeCategory = btn.dataset.category;

applyFilters();

});

});

});


function toggleCategoryDropdown(){

document
.getElementById("categoryDropdown")
.classList
.toggle("hidden");

}


function applyFilters(){

const searchValue =
document
.getElementById("searchInput")
.value
.toLowerCase()
.trim();


let filtered = allItems.filter(item =>
item.name.toLowerCase().includes(searchValue)
);

if(activeCategory !== "all"){

filtered = filtered.filter(item =>
item.category === activeCategory
);

}

renderItems(filtered);

}


function renderItems(items){

const container = document.getElementById("itemsContainer");

container.innerHTML = "";

if(!items.length){

container.innerHTML="<p>No items found.</p>";
return;

}

items.forEach(item=>{

const div=document.createElement("div");

div.classList.add("item-card");

div.innerHTML=`

${item.image ? `<img src="${item.image}" class="item-image"/>` : ""}

<h3>${item.name}</h3>

<p><strong>Category:</strong> ${item.category}</p>

<p><strong>Location:</strong> ${item.location}</p>

<p><strong>Status:</strong> ${item.status}</p>

`;

div.addEventListener("click",()=>{

window.location.href=`item-card.html?id=${item._id}`;

});

container.appendChild(div);

});

}