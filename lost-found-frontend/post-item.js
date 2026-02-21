document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("postItemForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    const imageFile = document.getElementById("image").files[0];

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

        alert("Item posted successfully");
        window.location.href = "dashboard.html";

      } catch (error) {
        console.error(error);
        alert("Item posting failed");
      }
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      alert("Please select an image");
    }

  });

});
