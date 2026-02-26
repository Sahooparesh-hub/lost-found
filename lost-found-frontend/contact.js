document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemId");

  const token = localStorage.getItem("token");

  const messageBox = document.getElementById("messageBox");

  function showMessage(type, text) {
    if (!messageBox) return; // prevent crash

    messageBox.style.display = "block";
    messageBox.className = `message-box ${type}`;
    messageBox.innerText = text;
  }

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  if (!itemId) {
    showMessage("error", "Invalid item.");
    return;
  }

  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
const contactInfo = document.getElementById("contact")?.value.trim();
const message = document.getElementById("description")?.value.trim();

    if (!name || !contactInfo || !message) {
      showMessage("error", "All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          name,
          contactInfo,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message || "Failed to send message.");
        return;
      }

      showMessage("success", "Message sent successfully!");

setTimeout(() => {
  window.location.href = "messages.html";
}, 1000);

    } catch (error) {
      showMessage("error", "Server not reachable.");
    }
  });

});