document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
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

    if (!response.ok) {
      showMessage("error", data.message || "Login failed");
      return;
    }

    // ✅ Store authentication data
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    showMessage("success", "Login successful! Redirecting...");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);

  } catch (error) {
    showMessage("error", "Server not reachable.");
  }
});