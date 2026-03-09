const API_URL = "http://localhost:5000/api/user/profile";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const form = document.getElementById("updateForm");
    const messageBox = document.getElementById("messageBox");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = "block";

        // Auto hide after 4 seconds
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 4000);
    }

    // 🔹 Prefill existing data
    async function loadCurrentData() {
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = await res.json();

            document.getElementById("name").value = user.name || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phone").value = user.phone || "";

        } catch (error) {
            showMessage("Failed to load profile data", "error");
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            password: document.getElementById("password").value.trim()
        };

        try {
            const res = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            const data = await res.json();

            if (!res.ok) {
                showMessage(data.message || "Update failed", "error");
                return;
            }

            showMessage("Profile updated successfully!", "success");

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = "profile.html";
            }, 2000);

        } catch (error) {
            showMessage("Server error. Please try again.", "error");
        }
    });

    loadCurrentData();
});