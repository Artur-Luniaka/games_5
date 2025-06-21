// Navigation and Footer Injection System
const navigationInjectionSystem = {
  // Initialize the injection system
  initializeInjectionSystem() {
    this.injectNavigationBar();
    this.injectFooterSection();
    this.setupNavigationInteractions();
    this.updateCartIndicator();
  },

  // Inject navigation bar into the page
  injectNavigationBar() {
    const navigationContainer = document.getElementById("navigation-container");
    if (!navigationContainer) return;

    const navigationHTML = `
            <nav class="navigation-bar">
                <div class="navigation-bar__content">
                    <a href="index.html" class="navigation-bar__logo">
                        <div class="navigation-bar__logo-image">OGFL</div>
                        <span class="navigation-bar__logo-text">OnlineGameFusionLab</span>
                    </a>
                    
                    <div class="navigation-bar__actions">
                        <button class="cart-indicator" id="cart-indicator" onclick="window.location.href='shopping-cart.html'">
                            <img src="public/cart-icon.png" alt="Cart" class="cart-indicator__icon"/>
                            <span class="cart-indicator__count" id="cart-count">0</span>
                        </button>
                        
                        <button class="menu-trigger" id="menu-trigger">
                            <span class="menu-trigger__line"></span>
                            <span class="menu-trigger__line"></span>
                            <span class="menu-trigger__line"></span>
                        </button>
                    </div>
                </div>
            </nav>
            
            <div class="menu-overlay" id="menu-overlay"></div>
            
            <div class="menu-panel" id="menu-panel">
                <div class="menu-panel__header">
                    <h3>Menu</h3>
                    <button class="menu-panel__close" id="menu-close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <nav class="menu-panel__nav">
                    <ul class="menu-panel__nav-list">
                        <li class="menu-panel__nav-item">
                            <a href="index.html" class="menu-panel__nav-link">Home</a>
                        </li>
                        <li class="menu-panel__nav-item">
                            <a href="game-catalog.html" class="menu-panel__nav-link">Games Catalog</a>
                        </li>
                        <li class="menu-panel__nav-item">
                            <a href="index.html#game-bundles" class="menu-panel__nav-link">Bundles</a>
                        </li>
                        <li class="menu-panel__nav-item">
                            <a href="index.html#new-releases" class="menu-panel__nav-link">New Releases</a>
                        </li>
                        <li class="menu-panel__nav-item">
                            <a href="contact-page.html" class="menu-panel__nav-link">Contact</a>
                        </li>
                    </ul>
                </nav>
            </div>
        `;

    navigationContainer.innerHTML = navigationHTML;
  },

  // Inject footer section into the page
  injectFooterSection() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    const footerHTML = `
            <footer class="footer-section">
                <div class="footer-section__content">
                    <div class="footer-section__grid">
                        <div class="footer-section__column">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#bundles">Bundles</a></li>
                                <li><a href="#new-releases">New Releases</a></li>
                                <li><a href="game-catalog.html">Games Catalog</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section__column">
                            <h3>Legal</h3>
                            <ul>
                                <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                <li><a href="terms-of-service.html">Terms of Service</a></li>
                                <li><a href="return-policy.html">Return Policy</a></li>
                                <li><a href="shipping-delivery.html">Shipping & Delivery</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-section__bottom">
                        <p>&copy; 2025 OnlineGameFusionLab.com | All rights reserved</p>
                    </div>
                </div>
            </footer>
        `;

    footerContainer.innerHTML = footerHTML;
  },

  // Setup navigation interactions
  setupNavigationInteractions() {
    const menuTrigger = document.getElementById("menu-trigger");
    const menuOverlay = document.getElementById("menu-overlay");
    const menuPanel = document.getElementById("menu-panel");
    const menuClose = document.getElementById("menu-close");

    if (menuTrigger && menuOverlay && menuPanel && menuClose) {
      // Open menu
      menuTrigger.addEventListener("click", () => {
        this.openNavigationMenu();
      });

      // Close menu via overlay
      menuOverlay.addEventListener("click", () => {
        this.closeNavigationMenu();
      });

      // Close menu via close button
      menuClose.addEventListener("click", () => {
        this.closeNavigationMenu();
      });

      // Close menu via escape key
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.closeNavigationMenu();
        }
      });
    }
  },

  // Open navigation menu
  openNavigationMenu() {
    const menuOverlay = document.getElementById("menu-overlay");
    const menuPanel = document.getElementById("menu-panel");

    if (menuOverlay && menuPanel) {
      menuOverlay.classList.add("active");
      menuPanel.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  // Close navigation menu
  closeNavigationMenu() {
    const menuOverlay = document.getElementById("menu-overlay");
    const menuPanel = document.getElementById("menu-panel");

    if (menuOverlay && menuPanel) {
      menuOverlay.classList.remove("active");
      menuPanel.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  // Update cart indicator count
  updateCartIndicator() {
    const cartCount = document.getElementById("cart-count");
    if (!cartCount) return;

    const cartItems = this.getCartItemsFromStorage();
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCount.textContent = totalItems;

    if (totalItems > 0) {
      cartCount.classList.add("active");
    } else {
      cartCount.classList.remove("active");
    }
  },

  // Get cart items from localStorage
  getCartItemsFromStorage() {
    try {
      const cartData = localStorage.getItem("pixelVaultCart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart data:", error);
      return [];
    }
  },
};

// Cart management system
const cartManagementSystem = {
  // Add item to cart
  addItemToCart(gameData) {
    const cartItems = this.getCartItemsFromStorage();
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === gameData.id
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        id: gameData.id,
        title: gameData.title,
        price: gameData.price,
        image: gameData.image,
        quantity: 1,
      });
    }

    this.saveCartToStorage(cartItems);
    this.updateCartIndicator();
    this.showAddToCartNotification(gameData.title);
  },

  // Remove item from cart
  removeItemFromCart(gameId) {
    const cartItems = this.getCartItemsFromStorage();
    const filteredItems = cartItems.filter((item) => item.id !== gameId);
    this.saveCartToStorage(filteredItems);
    this.updateCartIndicator();
  },

  // Update item quantity
  updateItemQuantity(gameId, newQuantity) {
    const cartItems = this.getCartItemsFromStorage();
    const itemIndex = cartItems.findIndex((item) => item.id === gameId);

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        cartItems.splice(itemIndex, 1);
      } else {
        cartItems[itemIndex].quantity = newQuantity;
      }
      this.saveCartToStorage(cartItems);
      this.updateCartIndicator();
    }
  },

  // Get cart items from localStorage
  getCartItemsFromStorage() {
    try {
      const cartData = localStorage.getItem("pixelVaultCart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart data:", error);
      return [];
    }
  },

  // Save cart to localStorage
  saveCartToStorage(cartItems) {
    try {
      localStorage.setItem("pixelVaultCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart data:", error);
    }
  },

  // Update cart indicator
  updateCartIndicator() {
    navigationInjectionSystem.updateCartIndicator();
  },

  // Show add to cart notification
  showAddToCartNotification(gameTitle) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <div class="notification__content">
                <svg class="notification__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="notification__message">${gameTitle} added to cart!</span>
            </div>
        `;

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

  // Calculate cart total
  calculateCartTotal() {
    const cartItems = this.getCartItemsFromStorage();
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  // Clear cart
  clearCart() {
    this.saveCartToStorage([]);
    this.updateCartIndicator();
  },
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  navigationInjectionSystem.initializeInjectionSystem();
});

// Export for use in other scripts
window.navigationInjectionSystem = navigationInjectionSystem;
window.cartManagementSystem = cartManagementSystem;
