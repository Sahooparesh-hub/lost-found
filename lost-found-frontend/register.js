document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageBox = document.getElementById("messageBox");

    function showMessage(type, text) {
        messageBox.style.display = "block";
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = text;
    }

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !phone || !password) {
        showMessage("error", "All fields are required");
        return;
    }

    if (phone.length !== 10) {
        showMessage("error", "Phone number must be 10 digits");
        return;
    }

    if (password.length < 6) {
        showMessage("error", "Password must be at least 6 characters");
        return;
    }

    const userData = { name, email, phone, password };

    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("success", "Registration successful! Redirecting...");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            showMessage("error", data.message || "Registration failed");
        }

    } catch (error) {
        console.error("Error:", error);
        showMessage("error", "Server not reachable. Check backend.");
    }
});