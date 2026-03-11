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
  const messageBox = document.getElementById("messageBox");

  let allMessages = [];

  if (!container) return;

  try {

    const response = await fetch(
      "http://localhost:5000/api/messages/my-messages",
      {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      showMessage("Failed to load messages", true);
      return;
    }

    allMessages = await response.json();

    renderMessages(allMessages);

  } catch (error) {
    console.error("Error loading messages:", error);
    showMessage("Server error while loading messages", true);
  }


  // ---------- SHOW MESSAGE ----------
  function showMessage(text, isError = false) {

    messageBox.textContent = text;
    messageBox.style.display = "block";

    messageBox.style.background = isError ? "#ffe5e5" : "#e6ffe6";
    messageBox.style.color = isError ? "#b30000" : "#006600";

    setTimeout(() => {
      messageBox.style.display = "none";
    }, 3000);
  }



  // ---------- RENDER MESSAGES ----------
  function renderMessages(messages) {

    container.innerHTML = "";

    if (messages.length === 0) {
      container.innerHTML = "<p>No messages found.</p>";
      return;
    }

    messages.forEach(msg => {

      const box = document.createElement("div");
      box.classList.add("message-box");
      box.id = msg._id;

      const typeLabel =
        msg.senderId === userId
          ? "<strong>You sent this message</strong>"
          : "<strong>Message received</strong>";

      box.innerHTML = `

        ${typeLabel}

        <p><strong>Name:</strong> ${msg.name}</p>
        <p><strong>Contact:</strong> ${msg.contactInfo}</p>
        <p><strong>Item:</strong> ${msg.itemId?.name || "Unknown Item"}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
        <p><small>${new Date(msg.createdAt).toLocaleString()}</small></p>

        <div class="message-actions">

          <button class="details-btn"
          onclick="openItemDetails('${msg.itemId?._id}')">
          Item Details
          </button>

          <button class="delete-btn"
          onclick="deleteMessage('${msg._id}')">
          Delete
          </button>

        </div>

        <hr/>

      `;

      container.appendChild(box);

    });

  }



  // ---------- FILTER BUTTONS ----------

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



  // ---------- ACTIVE BUTTON ----------
  function setActive(activeBtn) {

    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    activeBtn.classList.add("active");

  }



  // ---------- DELETE MESSAGE ----------
  window.deleteMessage = async function(messageId){

    try{

      const res = await fetch(
        `http://localhost:5000/api/messages/${messageId}`,
        {
          method:"DELETE",
          headers:{
            "Authorization":`Bearer ${token}`
          }
        }
      );

      if(!res.ok){
        showMessage("Failed to delete message", true);
        return;
      }

      // Remove message from UI
      allMessages = allMessages.filter(msg => msg._id !== messageId);

      const element = document.getElementById(messageId);
      if(element) element.remove();

      showMessage("Message deleted successfully");

    }catch(err){
      console.error(err);
      showMessage("Server error while deleting message", true);
    }

  };



});



// ---------- OPEN ITEM DETAILS ----------
function openItemDetails(itemId){

  if(!itemId){
    alert("Item not found");
    return;
  }

  window.location.href = `item-details.html?id=${itemId}`;

}