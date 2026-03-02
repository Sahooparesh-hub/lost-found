let allItems = [];

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/items", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    allItems = await response.json();
    renderItems(allItems);

  } catch (error) {
    console.log("Failed to load items");
    document.getElementById("itemsContainer").innerHTML =
      "<p>Error loading items.</p>";
  }

  // Live search on typing
  document.getElementById("searchInput")
    .addEventListener("input", handleSearch);
});

function renderItems(items) {

  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(item => {

    const div = document.createElement("div");
    div.classList.add("item-card");

    div.innerHTML = `
      ${item.image ? `<img src="${item.image}" class="item-image"/>` : ""}
      <h3>${item.name}</h3>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Status:</strong> ${item.status}</p>
    `;

    // 👇 Click event
    div.addEventListener("click", () => {
      window.location.href = `item-card.html?id=${item._id}`;
    });

    container.appendChild(div);
  });
}



function handleSearch(e) {

  const searchValue = e.target.value.toLowerCase().trim();

  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(searchValue)
  );

  renderItems(filtered);
}

const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
    }
});