const products = [
  { id: 1, name: "Fablush Nightwear Green", price: 1599, image: "images/FB5008-GRN_107fae63-7b44-41cb-91cb-d19c3a2db080.webp" },
  { id: 2, name: "Fablush Nightwear Pink", price: 1699, image: "images/FB5008-PK_2_f8f37617-d9e7-42e8-9250-504efdc4f072.webp" },
  { id: 3, name: "Fablush Nightwear Sky", price: 1499, image: "images/FB5008-SK_1_b32c3c1c-dd89-4c8e-9b04-232a8ba0da24.webp" },
  { id: 4, name: "Fablush D-Grey", price: 1899, image: "images/FB34002-DGY_1_014d56c5-c132-47a0-9089-08628d986ab6.webp" },
  { id: 5, name: "Fablush D-Pink", price: 1599, image: "images/FB14117-A_2_6d3a709d-193f-4e35-93d3-c8eabd348bd0.webp" },
  { id: 6, name: "Fablush D-Blue", price: 1699, image: "images/FB14117-B_1_2_a1a55106-ef38-4efb-9848-f4d40028caba.webp" },
  { id: 7, name: "Fablush Black", price: 1599, image: "images/FB15102-A_2_68edd00a-a5f2-4955-9aa1-14c1cba2481d.webp" },
  { id: 8, name: "Fablush Pink", price: 1899, image: "images/FB15102-B_1_e84ce321-8345-4adc-97e4-c2a755850ad6.webp" },
  { id: 9, name: "Fablush Silver", price: 1799, image: "images/FB30001-GRN_1_a9ad0b89-c4ae-43c1-9380-ebd4f7f0579f.webp" },
  { id: 10, name: "Fablush Peach", price: 1899, image: "images/FB30001-PEACH_1_67664557-9221-4dfb-988c-db0e70a158c8.webp" },
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart function with proper event handling
function addToCart(id, event) {
  if (event) event.stopPropagation();
  
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification('Added to cart!');
}

// Update cart count display
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.innerText = totalItems;
}

// Show cart popup
function showCart(event) {
  if (event) event.stopPropagation();
  const cartPopup = document.getElementById("cart-popup");
  const cartItems = document.getElementById("cart-items");
  
  if (!cartPopup || !cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">₹${item.price}</span>
          <div class="cart-item-controls">
            <button onclick="decreaseQuantity(${item.id}, event)">-</button>
            <span class="cart-item-quantity">${item.quantity}</span>
            <button onclick="increaseQuantity(${item.id}, event)">+</button>
            <button onclick="removeFromCart(${item.id}, event)" class="remove-btn">Remove</button>
          </div>
        </div>
      </div>
    `;
    cartItems.appendChild(li);
  });

  const totalPrice = document.getElementById("total-price");
  if (totalPrice) totalPrice.innerText = total.toFixed(2);
  cartPopup.classList.remove("hidden");
}

// Quantity modification functions
function increaseQuantity(id, event) {
  if (event) event.stopPropagation();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    updateCartCount();
  }
}

function decreaseQuantity(id, event) {
  if (event) event.stopPropagation();
  const item = cart.find(p => p.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart = cart.filter(p => p.id !== id);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showCart();
    updateCartCount();
  }
}

// Remove item from cart
function removeFromCart(id, event) {
  if (event) event.stopPropagation();
  cart = cart.filter(p => p.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  showCart();
  updateCartCount();
  showNotification('Item removed from cart');
}

// Close cart popup
function closeCart() {
  const cartPopup = document.getElementById("cart-popup");
  if (cartPopup) cartPopup.classList.add("hidden");
}

// Product rendering with proper click handling
function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product";
    productCard.innerHTML = `
      <div class="product-image-container" onclick="window.location.href='product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">₹${product.price}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">
          Add to Cart
        </button>
      </div>
    `;
    productList.appendChild(productCard);
  });

  // Cart click handler
  const cartButton = document.getElementById("cart");
  if (cartButton) {
    cartButton.addEventListener("click", (e) => {
      e.stopPropagation();
      showCart();
    });
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();

  // Close cart when clicking outside
  document.addEventListener('click', (e) => {
    const cartPopup = document.getElementById("cart-popup");
    const cartButton = document.getElementById("cart");
    if (cartPopup && !cartPopup.contains(e.target) && e.target !== cartButton) {
      closeCart();
    }
  });
});

// Notification system
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Save cart before unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('cart', JSON.stringify(cart));
});
