// Checkout Management System
const checkoutManager = {
  // Current state
  currentState: {
    currentStep: 1,
    totalSteps: 2,
    cartItems: [],
    contactInfo: {},
    orderSummary: {
      subtotal: 0,
      tax: 0,
      total: 0,
    },
  },

  // Initialize checkout system
  initializeCheckout() {
    this.loadCartItems();
    this.setupEventListeners();
    this.updateOrderSummary();
    this.setupInputFormatting();
  },

  // Load cart items from localStorage
  loadCartItems() {
    try {
      const cartData = localStorage.getItem("pixelVaultCart");
      this.currentState.cartItems = cartData ? JSON.parse(cartData) : [];

      if (this.currentState.cartItems.length === 0) {
        this.redirectToCart();
        return;
      }

      this.renderOrderSummary();
    } catch (error) {
      console.error("Error loading cart items:", error);
      this.redirectToCart();
    }
  },

  // Setup event listeners
  setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleContactSubmit();
      });
    }

    // Place order button
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => {
        this.handlePlaceOrder();
      });
    }
  },

  // Setup input formatting
  setupInputFormatting() {
    // Phone number formatting
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        this.formatPhoneNumber(e.target);
      });
    }
  },

  // Handle contact form submission
  handleContactSubmit() {
    const formData = new FormData(document.getElementById("contact-form"));
    const contactInfo = {};

    for (let [key, value] of formData.entries()) {
      contactInfo[key] = value.trim();
    }

    // Validate required fields
    const requiredFields = ["name", "email"];
    const missingFields = requiredFields.filter((field) => !contactInfo[field]);

    if (missingFields.length > 0) {
      this.showError("Please fill in all required fields.");
      return;
    }

    // Validate email
    if (!this.isValidEmail(contactInfo.email)) {
      this.showError("Please enter a valid email address.");
      return;
    }

    this.currentState.contactInfo = contactInfo;
    this.nextStep();
  },

  // Handle place order
  async handlePlaceOrder() {
    const placeOrderBtn = document.getElementById("place-order-btn");
    const btnText = placeOrderBtn.querySelector(".btn__text");
    const btnLoader = placeOrderBtn.querySelector(".btn__loader");

    // Show loading state
    btnText.style.display = "none";
    btnLoader.style.display = "block";
    placeOrderBtn.disabled = true;

    try {
      // Simulate API call
      await this.simulateOrderProcessing();

      // Generate order ID
      const orderId = this.generateOrderId();
      const orderTotal = this.currentState.orderSummary.total;

      // Show success modal
      this.showSuccessModal(orderId, orderTotal);

      // Clear cart
      this.clearCart();
    } catch (error) {
      console.error("Order processing error:", error);
      this.showError(
        "There was an error processing your order. Please try again."
      );
    } finally {
      // Reset button state
      btnText.style.display = "block";
      btnLoader.style.display = "none";
      placeOrderBtn.disabled = false;
    }
  },

  // Simulate order processing
  simulateOrderProcessing() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  },

  // Generate order ID
  generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `OGFL-${timestamp}-${random}`.toUpperCase();
  },

  // Navigation methods
  nextStep() {
    if (this.currentState.currentStep < this.currentState.totalSteps) {
      this.currentState.currentStep++;
      this.updateStepDisplay();
      this.updateProgressIndicator();
    }
  },

  previousStep() {
    if (this.currentState.currentStep > 1) {
      this.currentState.currentStep--;
      this.updateStepDisplay();
      this.updateProgressIndicator();
    }
  },

  editStep(step) {
    this.currentState.currentStep = step;
    this.updateStepDisplay();
    this.updateProgressIndicator();
  },

  // Update step display
  updateStepDisplay() {
    const steps = document.querySelectorAll(".checkout-step");
    steps.forEach((step, index) => {
      if (index + 1 === this.currentState.currentStep) {
        step.style.display = "block";
      } else {
        step.style.display = "none";
      }
    });

    // Update review sections if on step 2
    if (this.currentState.currentStep === 2) {
      this.updateReviewSections();
    }
  },

  // Update progress indicator
  updateProgressIndicator() {
    const progressSteps = document.querySelectorAll(".progress-step");

    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove(
        "progress-step--active",
        "progress-step--completed"
      );

      if (stepNumber < this.currentState.currentStep) {
        step.classList.add("progress-step--completed");
      } else if (stepNumber === this.currentState.currentStep) {
        step.classList.add("progress-step--active");
      }
    });
  },

  // Update review sections
  updateReviewSections() {
    this.updateContactReview();
    this.updateOrderItemsReview();
  },

  // Update contact review
  updateContactReview() {
    const contactReview = document.getElementById("contact-review");
    const contact = this.currentState.contactInfo;

    if (contactReview && contact) {
      contactReview.innerHTML = `
        <p><strong>${contact.name}</strong></p>
        <p>${contact.email}</p>
        <p>${contact.phone || "No phone provided"}</p>
      `;
    }
  },

  // Update order items review
  updateOrderItemsReview() {
    const orderItemsReview = document.getElementById("order-items-review");

    if (orderItemsReview) {
      const itemsHTML = this.currentState.cartItems
        .map(
          (item) => `
        <div class="order-item">
          <img src="${item.image}" alt="${item.title}" class="order-item__image">
          <div class="order-item__info">
            <div class="order-item__title">${item.title}</div>
            <div class="order-item__price">$${item.price} × ${item.quantity}</div>
          </div>
        </div>
      `
        )
        .join("");

      orderItemsReview.innerHTML = itemsHTML;
    }
  },

  // Render order summary
  renderOrderSummary() {
    const summaryItems = document.getElementById("summary-items");

    if (summaryItems) {
      const itemsHTML = this.currentState.cartItems
        .map(
          (item) => `
        <div class="summary-item">
          <div class="summary-item__info">
            <div class="summary-item__title">${item.title}</div>
            <div class="summary-item__details">Qty: ${item.quantity}</div>
          </div>
          <div class="summary-item__price">$${(
            item.price * item.quantity
          ).toFixed(2)}</div>
        </div>
      `
        )
        .join("");

      summaryItems.innerHTML = itemsHTML;
    }
  },

  // Update order summary totals
  updateOrderSummary() {
    const subtotal = this.currentState.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    this.currentState.orderSummary = { subtotal, tax, total };

    // Update display
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  },

  // Show success modal
  showSuccessModal(orderId, orderTotal) {
    const modal = document.getElementById("success-modal");
    const orderIdSpan = document.getElementById("order-id");
    const orderTotalSpan = document.getElementById("order-total");

    if (modal && orderIdSpan && orderTotalSpan) {
      orderIdSpan.textContent = orderId;
      orderTotalSpan.textContent = `$${orderTotal.toFixed(2)}`;
      modal.style.display = "flex";
    }
  },

  // Show error message
  showError(message) {
    // Create error notification
    const notification = document.createElement("div");
    notification.className = "notification notification--error";
    notification.innerHTML = `
      <div class="notification__content">
        <div class="notification__icon">⚠️</div>
        <div class="notification__message">${message}</div>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  },

  // Clear cart
  clearCart() {
    localStorage.removeItem("pixelVaultCart");
    this.currentState.cartItems = [];
  },

  // Redirect to cart
  redirectToCart() {
    window.location.href = "shopping-cart.html";
  },

  // Go to home page
  goToHome() {
    window.location.href = "index.html";
  },

  // Input formatting methods
  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, "($1) $2");
    }
    input.value = value;
  },

  // Validation methods
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

// Add notification styles if not already present
const addNotificationStyles = () => {
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-medium);
        padding: var(--spacing-md);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification--error {
        border-left: 4px solid #ef4444;
      }
      
      .notification__content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
      
      .notification__icon {
        font-size: 1.25rem;
      }
      
      .notification__message {
        color: var(--text-primary);
        font-size: 0.875rem;
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize notification styles
addNotificationStyles();
