// Cart Management System
const cartManager = {
  // Initialize cart manager
  initializeCartManager() {
    this.loadCartItems();
    this.setupEventListeners();
    this.loadRecommendations();
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
      cartItemsCount.textContent = "0 items";
      return;
    }

    container.style.display = "flex";
    emptyCart.style.display = "none";

    const itemsHTML = cartItems
      .map((item) => this.createCartItemHTML(item))
      .join("");
    container.innerHTML = itemsHTML;

    this.setupCartItemInteractions();
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
    }>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                            <span class="quantity-display">${
                              item.quantity
                            }</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${
                              item.uniqueIdentifier
                            }', ${item.quantity + 1})">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <button class="cart-item__remove" onclick="cartManager.removeItem('${
                          item.uniqueIdentifier
                        }')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
  },

  // Setup cart item interactions
  setupCartItemInteractions() {
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        this.animateCartItem(item, "enter");
      });

      item.addEventListener("mouseleave", () => {
        this.animateCartItem(item, "leave");
      });
    });
  },

  // Animate cart item
  animateCartItem(item, action) {
    const visual = item.querySelector(".cart-item__visual");
    const content = item.querySelector(".cart-item__content");

    if (action === "enter") {
      visual.style.transform = "scale(1.05)";
      content.style.transform = "translateY(-2px)";
    } else {
      visual.style.transform = "scale(1)";
      content.style.transform = "translateY(0)";
    }
  },

  // Update item quantity
  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    cartManagementSystem.updateItemQuantity(itemId, newQuantity);
    this.loadCartItems();
    this.showQuantityUpdateNotification();
  },

  // Remove item from cart
  removeItem(itemId) {
    const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (cartItem) {
      // Add removal animation
      cartItem.style.transform = "translateX(-100%)";
      cartItem.style.opacity = "0";

      setTimeout(() => {
        cartManagementSystem.removeItemFromCart(itemId);
        this.loadCartItems();
        this.showRemovalNotification();
      }, 300);
    }
  },

  // Update cart summary
  updateCartSummary(cartItems) {
    const summaryItems = document.getElementById("summary-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (
      !summaryItems ||
      !subtotalElement ||
      !taxElement ||
      !totalElement ||
      !checkoutBtn
    )
      return;

    // Create summary items
    const summaryItemsHTML = cartItems
      .map(
        (item) => `
            <div class="summary-item">
                <div>
                    <span class="summary-item__name">${item.title}</span>
                    <span class="summary-item__quantity">× ${
                      item.quantity
                    }</span>
                </div>
                <span class="summary-item__price">$${(
                  item.price * item.quantity
                ).toFixed(2)}</span>
            </div>
        `
      )
      .join("");

    summaryItems.innerHTML = summaryItemsHTML;

    // Calculate totals
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Update display
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update checkout button
    checkoutBtn.disabled = cartItems.length === 0;
  },

  // Update cart count
  updateCartCount(cartItems) {
    const cartItemsCount = document.getElementById("cart-items-count");
    if (!cartItemsCount) return;

    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartItemsCount.textContent = `${totalItems} item${
      totalItems !== 1 ? "s" : ""
    }`;
  },

  // Load recommendations
  async loadRecommendations() {
    try {
      const response = await fetch(
        "data/digital-entertainment-collection.json"
      );
      const data = await response.json();

      const recommendations = this.selectRecommendations(
        data.digitalEntertainmentCollection.entertainmentItems
      );
      this.renderRecommendations(recommendations);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
  },

  // Select recommendations
  selectRecommendations(allGames) {
    // Get current cart items
    const cartItems = cartManagementSystem.getCartItemsFromStorage();
    const cartItemIds = cartItems.map((item) => item.uniqueIdentifier);

    // Filter out games already in cart and select random ones
    const availableGames = allGames.filter(
      (game) => !cartItemIds.includes(game.uniqueIdentifier)
    );
    const shuffled = availableGames.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 4);
  },

  // Render recommendations
  renderRecommendations(recommendations) {
    const container = document.getElementById("recommendations-grid");
    if (!container) return;

    const recommendationsHTML = recommendations
      .map(
        (game) => `
            <div class="recommendation-card" onclick="cartManager.addRecommendationToCart('${game.uniqueIdentifier}')">
                <div class="recommendation-card__visual">
                    <img src="${game.visualAssets.primaryImage}" alt="${game.title}" loading="lazy">
                </div>
                <div class="recommendation-card__content">
                    <h4 class="recommendation-card__title">${game.title}</h4>
                    <span class="recommendation-card__price">$${game.price}</span>
                </div>
            </div>
        `
      )
      .join("");

    container.innerHTML = recommendationsHTML;
  },

  // Add recommendation to cart
  addRecommendationToCart(gameId) {
    // Find game data
    fetch("data/digital-entertainment-collection.json")
      .then((response) => response.json())
      .then((data) => {
        const game =
          data.digitalEntertainmentCollection.entertainmentItems.find(
            (item) => item.uniqueIdentifier === gameId
          );

        if (game) {
          const gameData = {
            id: game.uniqueIdentifier,
            title: game.title,
            price: game.price,
            image: game.visualAssets.primaryImage,
          };

          cartManagementSystem.addItemToCart(gameData);
          this.loadCartItems();
          this.loadRecommendations(); // Refresh recommendations
          this.showRecommendationAddedNotification(game.title);
        }
      })
      .catch((error) => {
        console.error("Error adding recommendation to cart:", error);
      });
  },

  // Setup event listeners
  setupEventListeners() {
    // Add keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        // Close any open modals or return to catalog
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "game-catalog.html";
        }
      }
    });

    // Add cart item animations
    this.setupCartAnimations();
  },

  // Setup cart animations
  setupCartAnimations() {
    const style = document.createElement("style");
    style.textContent = `
            .cart-item {
                transition: all 0.3s ease;
            }

            .cart-item__visual {
                transition: all 0.3s ease;
            }

            .cart-item__content {
                transition: all 0.3s ease;
            }

            .quantity-btn {
                transition: all 0.2s ease;
            }

            .cart-item__remove {
                transition: all 0.2s ease;
            }

            @keyframes cartItemSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .cart-item {
                animation: cartItemSlideIn 0.5s ease;
            }

            @keyframes cartItemSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-100%);
                }
            }

            .cart-item.removing {
                animation: cartItemSlideOut 0.3s ease forwards;
            }
        `;
    document.head.appendChild(style);
  },

  // Show quantity update notification
  showQuantityUpdateNotification() {
    this.showNotification("Quantity updated successfully!", "success");
  },

  // Show removal notification
  showRemovalNotification() {
    this.showNotification("Item removed from cart", "info");
  },

  // Show recommendation added notification
  showRecommendationAddedNotification(gameTitle) {
    this.showNotification(`${gameTitle} added to cart!`, "success");
  },

  // Show notification
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `cart-notification cart-notification--${type}`;
    notification.innerHTML = `
            <div class="cart-notification__content">
                <svg class="cart-notification__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${
                      type === "success"
                        ? '<path d="M5 13l4 4L19 7"></path>'
                        : '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6m0 0v6"></path>'
                    }
                </svg>
                <span class="cart-notification__message">${message}</span>
            </div>
        `;

    // Add notification styles if not already added
    if (!document.querySelector("#cart-notification-styles")) {
      const style = document.createElement("style");
      style.id = "cart-notification-styles";
      style.textContent = `
                .cart-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--background-white);
                    color: var(--text-primary);
                    padding: var(--spacing-md) var(--spacing-lg);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-medium);
                    z-index: 1001;
                    transform: translateX(400px);
                    transition: var(--transition-normal);
                    max-width: 300px;
                    border-left: 4px solid var(--primary-emerald);
                }

                .cart-notification--success {
                    border-left-color: var(--primary-emerald);
                }

                .cart-notification--info {
                    border-left-color: var(--accent-coral);
                }

                .cart-notification.show {
                    transform: translateX(0);
                }

                .cart-notification__content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .cart-notification__icon {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    color: var(--primary-emerald);
                }

                .cart-notification--info .cart-notification__icon {
                    color: var(--accent-coral);
                }

                .cart-notification__message {
                    font-weight: 500;
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  // Proceed to checkout
  proceedToCheckout() {
    const cartItems = cartManagementSystem.getCartItemsFromStorage();

    if (cartItems.length === 0) {
      this.showNotification("Your cart is empty!", "info");
      return;
    }

    // Store checkout data
    const checkoutData = {
      items: cartItems,
      total: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("pixelVaultCheckout", JSON.stringify(checkoutData));

    // Navigate to checkout page
    window.location.href = "checkout.html";
  },

  // Get cart statistics
  getCartStats() {
    const cartItems = cartManagementSystem.getCartItemsFromStorage();
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const totalValue = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return {
      itemCount: totalItems,
      uniqueItems: cartItems.length,
      totalValue: totalValue,
      averagePrice: totalItems > 0 ? totalValue / totalItems : 0,
    };
  },
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  cartManager.initializeCartManager();
});

// Export for use in other scripts
window.cartManager = cartManager;
