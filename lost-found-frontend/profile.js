const API_URL = "http://localhost:5000/api/user/profile";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const messageBox = document.getElementById("messageBox");

    function showMessage(type, text) {
        messageBox.style.display = "block";
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = text;
    }

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const form = document.querySelector("form");
    const logoutBtn = document.querySelector(".btn-logout");

    async function loadProfile() {
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                }
                throw new Error("Failed to fetch profile");
            }

            const user = await response.json();

            document.getElementById("name").value = user.name || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phone").value = user.phone || "";
            document.getElementById("address").value = user.address || "";

        } catch (error) {
            console.error("Load Profile Error:", error);
            showMessage("error", "Unable to load profile.");
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedData = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim()
        };

        try {
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            showMessage("success", "Profile updated successfully");

        } catch (error) {
            console.error("Update Error:", error);
            showMessage("error", "Profile update failed.");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    loadProfile();
});