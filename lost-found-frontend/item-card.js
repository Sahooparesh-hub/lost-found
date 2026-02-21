document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detailsContainer").innerHTML =
      "<p>Invalid item.</p>";
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/api/items/${id}`);

    if (!response.ok) {
      throw new Error("Item not found");
    }

    const item = await response.json();

    renderDetails(item);

  } catch (error) {
    document.getElementById("detailsContainer").innerHTML =
      "<p>Error loading item details.</p>";
  }
});


function renderDetails(item) {

  const container = document.getElementById("detailsContainer");

  container.innerHTML = `
    <div class="details-card">

      ${item.status === "found"
        ? `<div class="status-badge found">FOUND</div>`
        : `<div class="status-badge lost">LOST</div>`
      }

      ${item.image ? `<img src="${item.image}" class="details-image"/>` : ""}

      <h2>${item.name}</h2>

      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Date:</strong> ${new Date(item.lostTime).toLocaleDateString()}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>

    </div>
  `;
}
