// Cart Management System
const cartManager = {
  // Initialize cart manager
  initializeCartManager() {
    this.loadCartItems();
    this.setupEventListeners();
  },

  // Load cart items from localStorage
  loadCartItems() {
    const cartItems = cartManagementSystem.getCartItemsFromStorage();
    this.renderCartItems(cartItems);
    this.updateCartSummary(cartItems);
    this.updateCartCount(cartItems);
  },

  // Render cart items
  renderCartItems(cartItems) {
    const container = document.getElementById("cart-items-container");
    const emptyCart = document.getElementById("empty-cart");
    const cartItemsCount = document.getElementById("cart-items-count");

    if (!container || !emptyCart || !cartItemsCount) return;

    if (cartItems.length === 0) {
      container.style.display = "none";
      emptyCart.style.display = "block";
    } else {
      container.style.display = "flex";
      emptyCart.style.display = "none";
    }

    const itemsHTML = cartItems
      .map((item) => this.createCartItemHTML(item))
      .join("");
    container.innerHTML = itemsHTML;
  },

  // Create cart item HTML
  createCartItemHTML(item) {
    return `
      <div class="cart-item" data-item-id="${item.uniqueIdentifier}">
        <div class="cart-item__visual">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item__content">
          <div class="cart-item__header">
            <h3 class="cart-item__title">${item.title}</h3>
            <span class="cart-item__price">$${(
              item.price * item.quantity
            ).toFixed(2)}</span>
          </div>
          <div class="cart-item__controls">
            <div class="cart-item__quantity">
              <button class="quantity-btn" onclick="cartManager.updateQuantity('${
                item.uniqueIdentifier
              }', ${item.quantity - 1})" ${
      item.quantity <= 1 ? "disabled" : ""
    }>-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" onclick="cartManager.updateQuantity('${
                item.uniqueIdentifier
              }', ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item__remove" onclick="cartManager.removeItem('${
              item.uniqueIdentifier
            }')">
              <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Update item quantity
  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    cartManagementSystem.updateItemQuantity(itemId, newQuantity);
    this.loadCartItems();
  },

  // Remove item from cart
  removeItem(itemId) {
    cartManagementSystem.removeItemFromCart(itemId);
    this.loadCartItems();
  },

  // Update cart summary
  updateCartSummary(cartItems) {
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!subtotalElement || !taxElement || !totalElement || !checkoutBtn)
      return;

    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    checkoutBtn.disabled = cartItems.length === 0;

    if (cartItems.length > 0) {
      checkoutBtn.textContent = `Checkout · $${total.toFixed(2)}`;
    } else {
      checkoutBtn.textContent = "Checkout";
    }
  },

  // Update cart count header
  updateCartCount(cartItems) {
    const cartItemsCount = document.getElementById("cart-items-count");
    if (cartItemsCount) {
      const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartItemsCount.textContent = `${totalItems} item${
        totalItems !== 1 ? "s" : ""
      }`;
    }
  },

  setupEventListeners() {
    // This can be used for events that need to be setup once
  },

  proceedToCheckout() {
    const cartItems = cartManagementSystem.getCartItemsFromStorage();
    if (cartItems.length > 0) {
      // Simulate checkout process
      console.log("Proceeding to checkout with:", cartItems);
      alert("Checkout is not implemented yet, but your items are ready!");
    } else {
      alert("Your cart is empty!");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".cart-main")) {
    cartManager.initializeCartManager();
  }
});
