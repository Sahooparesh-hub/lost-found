document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    const messageBox = document.getElementById("messageBox");

    function showMessage(type, text) {
        messageBox.style.display = "block";
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = text;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            showMessage("success", "Login successful! Redirecting...");

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);

        } else {
            showMessage("error", data.message || "Login failed");
        }

    } catch (error) {
        showMessage("error", "Server not reachable.");
    }
});