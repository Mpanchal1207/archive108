
const products = Array.from({ length: 5 }, (_, index) => ({
  id: index,
  blackImage: null,
  whiteImage: null,
  selectedColor: "black",
  price: 58
}));

let cart = [];

// YEAR
document.getElementById("year").textContent =
  new Date().getFullYear();

// PRODUCT IMAGE UPLOADS
document.querySelectorAll("[data-upload]").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.upload;
    const color = products[id].selectedColor;

    const input = document.querySelector(
      color === "black"
        ? `[data-file-for="${id}"]`
        : `[data-file-white-for="${id}"]`
    );

    input.click();
  });
});

// HANDLE BLACK AND WHITE IMAGE UPLOADS
products.forEach(product => {
  const blackInput = document.querySelector(
    `[data-file-for="${product.id}"]`
  );

  const whiteInput = document.querySelector(
    `[data-file-white-for="${product.id}"]`
  );

  function handleUpload(input, color) {
    input.addEventListener("change", event => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        product[color + "Image"] = reader.result;
        updateProductImage(product);
      };

      reader.readAsDataURL(file);
    });
  }

  handleUpload(blackInput, "black");
  handleUpload(whiteInput, "white");
});

// DISPLAY SELECTED IMAGE
function updateProductImage(product) {
  const card = document.querySelector(
    `[data-product="${product.id}"]`
  );

  const imageButton = card.querySelector(".product-image");
  const placeholder = imageButton.querySelector(".upload-placeholder");

  const image = product[
    product.selectedColor + "Image"
  ];

  imageButton.querySelectorAll("img").forEach(img => img.remove());

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = `${product.selectedColor} hoodie design`;
    imageButton.appendChild(img);

    imageButton.classList.remove("empty-art");
    placeholder.style.display = "none";
  } else {
    imageButton.classList.add("empty-art");
    placeholder.style.display = "flex";
  }

  const label = placeholder.querySelector("strong");

  if (label) {
    label.textContent =
      `UPLOAD ${product.selectedColor.toUpperCase()} HOODIE`;
  }
}

// COLOR SELECTORS
document.querySelectorAll(".color-options").forEach(options => {
  const card = options.closest(".product-card");
  const id = Number(card.dataset.product);
  const product = products[id];

  options.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.addEventListener("click", () => {
      product.selectedColor = swatch.dataset.color;

      options.querySelectorAll(".color-swatch").forEach(button => {
        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
      });

      swatch.classList.add("selected");
      swatch.setAttribute("aria-pressed", "true");

      options.querySelector(".selected-color").textContent =
        product.selectedColor.toUpperCase();

      updateProductImage(product);
    });
  });
});

// SHOPPING BAG
function updateCart() {
  const count = cart.length;

  document.getElementById("cartCount").textContent = count;
  document.getElementById("bagCount").textContent = `(${count})`;

  const items = document.getElementById("cartItems");

  items.innerHTML = "";

  if (count === 0) {
    items.innerHTML =
      '<p class="empty-bag">Nothing in the archive yet.</p>';
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const name = document.createElement("span");
    name.textContent =
      `DESIGN ${String(item.id + 1).padStart(2, "0")} — ${item.color.toUpperCase()}`;

    const price = document.createElement("span");
    price.textContent = `$${item.price}`;

    const remove = document.createElement("button");
    remove.textContent = "REMOVE";
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    row.append(name, price, remove);
    items.appendChild(row);
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  document.getElementById("subtotal").textContent =
    `$${subtotal.toFixed(2)}`;
}

// ADD PRODUCTS
document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    const product = products[Number(button.dataset.add)];

    cart.push({
      id: product.id,
      color: product.selectedColor,
      price: product.price
    });

    updateCart();
  });
});

// OPEN AND CLOSE BAG
const overlay = document.getElementById("cartOverlay");

document.getElementById("cartOpen").addEventListener("click", () => {
  overlay.hidden = false;
});

document.getElementById("cartClose").addEventListener("click", () => {
  overlay.hidden = true;
});

document.getElementById("cartX").addEventListener("click", () => {
  overlay.hidden = true;
});

updateCart();
