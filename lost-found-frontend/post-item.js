document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("postItemForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "login.html";
      return;
    }

    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
      showMessage("Please select an image", "error");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {

      const itemData = {
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        owner: {
          name: document.getElementById("ownerName").value.trim(),
          email: document.getElementById("ownerEmail").value.trim(),
          phone: document.getElementById("ownerPhone").value.trim()
        },
        location: document.getElementById("location").value.trim(),
        lostTime: document.getElementById("lostTime").value,
        image: reader.result
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(itemData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Posting failed");
        }

        // ✅ Show success message on page
        showMessage("Item posted successfully! Redirecting...", "success");

        // ✅ Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);

      } catch (error) {
        console.error("Post error:", error);
        showMessage(error.message || "Item posting failed", "error");
      }
    };

    reader.readAsDataURL(imageFile);
  });

});


/* -------- Message Function -------- */
function showMessage(message, type) {
  let msgDiv = document.getElementById("formMessage");

  if (!msgDiv) {
    msgDiv = document.createElement("div");
    msgDiv.id = "formMessage";
    msgDiv.style.marginTop = "15px";
    msgDiv.style.padding = "10px";
    msgDiv.style.borderRadius = "5px";
    document.getElementById("postItemForm").appendChild(msgDiv);
  }

  msgDiv.innerText = message;

  if (type === "success") {
    msgDiv.style.backgroundColor = "#d4edda";
    msgDiv.style.color = "#155724";
  } else {
    msgDiv.style.backgroundColor = "#f8d7da";
    msgDiv.style.color = "#721c24";
  }
}