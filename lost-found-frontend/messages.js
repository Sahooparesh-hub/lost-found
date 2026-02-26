document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/messages/my-messages", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const messages = await response.json();

    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    messages.forEach(msg => {
      const box = document.createElement("div");
      box.classList.add("message-box");

      const typeLabel =
        msg.senderId === userId
          ? "<strong>You sent this message</strong>"
          : "<strong>Message received</strong>";

      box.innerHTML = `
        ${typeLabel}
        <p><strong>Name:</strong> ${msg.name}</p>
        <p><strong>Contact:</strong> ${msg.contactInfo}</p>
        <p><strong>Item:</strong> ${msg.itemId?.title || ""}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
        <hr/>
      `;

      container.appendChild(box);
    });

  } catch (error) {
    console.error(error);
  }
});