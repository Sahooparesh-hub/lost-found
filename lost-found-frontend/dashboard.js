let allItems = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {

const token = localStorage.getItem("token");
const username = localStorage.getItem("username") || "User";

if (!token) {
window.location.href = "login.html";
return;
}

/* ---------- SIDEBAR USER NAME ---------- */

const nameElement = document.getElementById("sidebarUserName");
if(nameElement){
nameElement.textContent = username;
}

/* ---------- LOAD ITEMS ---------- */

try {

const response = await fetch("http://127.0.0.1:5000/api/items",{
headers:{ "Authorization":`Bearer ${token}` }
});

allItems = await response.json();

updateStats(allItems);

renderItems(allItems);

/* ---------- UPDATE REPUTATION ---------- */

updateReputation(allItems);

}
catch(error){

console.log("Failed to load items");

document.getElementById("itemsContainer").innerHTML =
"<p>Error loading items.</p>";

}

/* ---------- SEARCH FILTER ---------- */

document
.getElementById("searchInput")
.addEventListener("input", applyFilters);

/* ---------- CATEGORY DROPDOWN ---------- */

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


/* ---------- CATEGORY DROPDOWN FUNCTION ---------- */

function toggleCategoryDropdown(){

document
.getElementById("categoryDropdown")
.classList
.toggle("hidden");

}


/* ---------- FILTER ITEMS ---------- */

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


/* ---------- DASHBOARD STATS ---------- */

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


/* ---------- USER REPUTATION SYSTEM ---------- */

function updateReputation(items){

const userId = localStorage.getItem("userId");

/* Items returned (found items posted by user) */

const returned = items.filter(item =>
item.status.toLowerCase() === "found" &&
item.userId === userId
).length;

/* Items reported lost */

const lost = items.filter(item =>
item.status.toLowerCase() === "lost" &&
item.userId === userId
).length;

/* Simple trust score formula */

let trustScore = 4.0;

if(returned > 0){
trustScore = 4 + (returned * 0.2);
}

if(trustScore > 5){
trustScore = 5;
}

/* Update Sidebar */

const returnedEl = document.getElementById("itemsReturned");
const lostEl = document.getElementById("itemsLost");
const scoreEl = document.getElementById("trustScore");

if(returnedEl) returnedEl.textContent = returned;
if(lostEl) lostEl.textContent = lost;
if(scoreEl) scoreEl.textContent = trustScore.toFixed(1);

}


/* ---------- RENDER ITEM CARDS ---------- */

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