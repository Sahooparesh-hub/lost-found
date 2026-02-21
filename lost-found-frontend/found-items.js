let foundItems = [];

document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("foundItemsGrid");

  try {

    const response = await fetch("http://127.0.0.1:5000/api/items/found");

    if (!response.ok) {
      throw new Error("Network error");
    }

    foundItems = await response.json();
    renderFound(foundItems);

  } catch (error) {
    console.error("Error loading found items:", error);
    container.innerHTML = "<p>Error loading found items.</p>";
  }

  document.getElementById("foundSearchInput")
    .addEventListener("input", handleFoundSearch);
});

function renderFound(items) {

  const container = document.getElementById("foundItemsGrid");
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p>No found items yet.</p>";
    return;
  }

  items.forEach(item => {

    const div = document.createElement("div");
    div.classList.add("item-card", "found-border");

    div.innerHTML = `
      <div class="status-badge found">FOUND</div>
      <h3>${item.name}</h3>
      <p><strong>Location:</strong> ${item.location}</p>
    `;

    // 👇 Same details page
    div.addEventListener("click", () => {
      window.location.href = `item-card.html?id=${item._id}`;
    });

    container.appendChild(div);
  });
}



function handleFoundSearch(e) {

  const value = e.target.value.toLowerCase().trim();

  const filtered = foundItems.filter(item =>
    item.name.toLowerCase().includes(value)
  );

  renderFound(filtered);
}
