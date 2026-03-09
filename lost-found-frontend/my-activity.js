let allItems = [];

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const res = await fetch("http://127.0.0.1:5000/api/items/my-items", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        allItems = await res.json();

        updateCounts();
        renderItems("all");
        setupFilters();

    } catch (err) {
        console.log("Failed to load activity", err);
    }

});


function updateCounts(){

    const lost = allItems.filter(item => item.status === "lost").length;
    const found = allItems.filter(item => item.status === "found").length;

    document.getElementById("lostCount").textContent = lost;
    document.getElementById("foundCount").textContent = found;

}


function renderItems(filter){

    const container = document.getElementById("activityList");
    container.innerHTML = "";

    let filteredItems = allItems;

    if(filter === "lost"){
        filteredItems = allItems.filter(item => item.status === "lost");
    }

    if(filter === "found"){
        filteredItems = allItems.filter(item => item.status === "found");
    }

    if(filteredItems.length === 0){
        container.innerHTML = "<p>No items found.</p>";
        return;
    }

    filteredItems.forEach(item => {

        const div = document.createElement("div");
        div.classList.add("item-card");
        div.id = item._id;

        div.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-location">📍 ${item.location}</div>

                <span class="status ${item.status}">
                    ${item.status.toUpperCase()}
                </span>
            </div>

            <div class="item-actions">

                ${item.status === "lost"
                    ? `<button class="found-btn" onclick="markFound('${item._id}')">Mark Found</button>`
                    : ""
                }

                <button class="delete-btn" onclick="deleteItem('${item._id}')">
                    Delete
                </button>

            </div>
        `;

        container.appendChild(div);

    });

}


function setupFilters(){

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;

            renderItems(filter);

        });

    });

}


function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },3000);

}


async function markFound(id){

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:5000/api/items/${id}/found`,
        {
            method:"PUT",
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    );

    if(!response.ok){
        console.log("Failed to update");
        return;
    }

    allItems = allItems.map(item=>{
        if(item._id === id){
            item.status = "found";
        }
        return item;
    });

    updateCounts();

    const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;

    renderItems(activeFilter);

    showToast("Item marked as found ✅");

}


async function deleteItem(id){

    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:5000/api/items/${id}`,
        {
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    );

    if(!response.ok){
        console.log("Delete failed");
        return;
    }

    allItems = allItems.filter(item => item._id !== id);

    updateCounts();

    const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;

    renderItems(activeFilter);

    showToast("Item deleted successfully 🗑️");

}