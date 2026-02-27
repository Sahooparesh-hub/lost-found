document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const container = document.getElementById("messagesContainer");
  const allBtn = document.getElementById("allBtn");
  const receivedBtn = document.getElementById("receivedBtn");
  const sentBtn = document.getElementById("sentBtn");
  const pageTitle = document.getElementById("pageTitle");

  let allMessages = [];

  if (!container) return;

  try {
    const response = await fetch("http://localhost:5000/api/messages/my-messages", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      container.innerHTML = "<p>Failed to load messages.</p>";
      return;
    }

    allMessages = await response.json();

    renderMessages(allMessages); // default = show all

  } catch (error) {
    console.error("Error loading messages:", error);
    container.innerHTML = "<p>Server error.</p>";
  }

  // -------- RENDER FUNCTION --------
  function renderMessages(messages) {
    container.innerHTML = "";

    if (messages.length === 0) {
      container.innerHTML = "<p>No messages found.</p>";
      return;
    }

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
        <p><strong>Item ID:</strong> ${msg.itemId?._id || ""}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
        <p><small>${new Date(msg.createdAt).toLocaleString()}</small></p>
        <hr/>
      `;

      container.appendChild(box);
    });
  }

  // -------- FILTER BUTTONS --------

  allBtn.addEventListener("click", () => {
    setActive(allBtn);
    pageTitle.textContent = "All Contact Requests";
    renderMessages(allMessages);
  });

  receivedBtn.addEventListener("click", () => {
    setActive(receivedBtn);
    pageTitle.textContent = "Received Messages";

    const received = allMessages.filter(
      msg => msg.receiverId === userId
    );

    renderMessages(received);
  });

  sentBtn.addEventListener("click", () => {
    setActive(sentBtn);
    pageTitle.textContent = "Sent Messages";

    const sent = allMessages.filter(
      msg => msg.senderId === userId
    );

    renderMessages(sent);
  });

  // -------- ACTIVE BUTTON UI --------
  function setActive(activeBtn) {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    activeBtn.classList.add("active");
  }

});