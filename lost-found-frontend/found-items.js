let foundItems = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {

const container = document.getElementById("foundItemsGrid");

try {

const response = await fetch("http://127.0.0.1:5000/api/items/found");

foundItems = await response.json();

renderFound(foundItems);

}
catch(error){

console.error(error);

container.innerHTML="<p>Error loading found items.</p>";

}

document
.getElementById("foundSearchInput")
.addEventListener("input",applyFoundFilters);

document
.getElementById("foundCategoryBtn")
.addEventListener("click",()=>{

document
.getElementById("foundCategoryDropdown")
.classList
.toggle("hidden");

});


document
.querySelectorAll("#foundCategoryDropdown .category-chip")
.forEach(btn=>{

btn.addEventListener("click",()=>{

activeCategory=btn.dataset.category;

applyFoundFilters();

});

});

});


function applyFoundFilters(){

const value=
document
.getElementById("foundSearchInput")
.value
.toLowerCase()
.trim();

let filtered = foundItems.filter(item =>
item.name.toLowerCase().includes(value)
);

if(activeCategory!=="all"){

filtered = filtered.filter(item =>
item.category === activeCategory
);

}

renderFound(filtered);

}


function renderFound(items){

const container=document.getElementById("foundItemsGrid");

container.innerHTML="";

if(!items.length){

container.innerHTML="<p>No found items.</p>";
return;

}

items.forEach(item=>{

const div=document.createElement("div");

div.classList.add("item-card","found-border");

div.innerHTML=`

<div class="item-image-wrapper">

${item.image ? 
`<img src="${item.image}" class="item-image">`
:
`<img src="images/no-image.png" class="item-image">`
}

<span class="status-badge found">FOUND</span>

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