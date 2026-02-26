document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const container = document.querySelector(".activity-container");

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

        const items = await res.json();

        items.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("item-card");
            div.id = item._id; // needed for delete without reload

            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.location}</p>
                <p>
                    Status:
                    <span class="status ${item.status}">
                        ${item.status.toUpperCase()}
                    </span>
                </p>

                ${item.status === "lost"
                    ? `<button class="found-btn" onclick="markFound('${item._id}')">Mark Found</button>`
                    : ""
                }

                <button class="delete-btn" onclick="deleteItem('${item._id}')">
                    Delete
                </button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log("Failed to load activity", err);
    }
});


async function markFound(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:5000/api/items/${id}/found`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        console.log("Failed to update");
        return;
    }

    location.reload();
}


async function deleteItem(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `http://127.0.0.1:5000/api/items/${id}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        console.log("Delete failed");
        return;
    }

    // Remove card instantly without reload
    const card = document.getElementById(id);
    if (card) {
        card.remove();
    }
}