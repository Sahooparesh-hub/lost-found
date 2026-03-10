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

updateStats(allItems);

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

document
.querySelectorAll(".category-chip")
.forEach(c=>c.classList.remove("active"));

btn.classList.add("active");

activeCategory = btn.dataset.category;

applyFilters();

document
.getElementById("categoryDropdown")
.classList.add("hidden");

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

function updateStats(items){

const total = items.length;

const lost = items.filter(item =>
item.status.toLowerCase() === "lost"
).length;

const found = items.filter(item =>
item.status.toLowerCase() === "found"
).length;

document.getElementById("totalItems").textContent = total;
document.getElementById("lostItems").textContent = lost;
document.getElementById("foundItems").textContent = found;

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

div.innerHTML = `

<div class="item-image-wrapper">

${item.image ? 
`<img src="${item.image}" class="item-image"/>` 
:
`<img src="images/no-image.png" class="item-image"/>`
}

<span class="status-badge ${item.status.toLowerCase()}">
${item.status}
</span>

</div>

<div class="card-body">

<h3 class="item-title">${item.name}</h3>

<p class="item-location">📍 ${item.location}</p>

<p class="item-category">Category: ${item.category}</p>

<button class="view-btn">View Details</button>

</div>

`;

div.addEventListener("click",()=>{

window.location.href=`item-card.html?id=${item._id}`;

});

container.appendChild(div);

});

}