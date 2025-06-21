/**
 * Flash Deals Countdown Timer
 * Manages countdown functionality for flash deals section
 */

const flashDealsCountdown = {
  countdownElement: null,
  hoursElement: null,
  minutesElement: null,
  secondsElement: null,
  endTime: null,
  intervalId: null,

  /**
   * Initialize the countdown timer
   */
  initializeCountdown() {
    this.countdownElement = document.getElementById("flash-countdown");
    this.hoursElement = document.getElementById("hours");
    this.minutesElement = document.getElementById("minutes");
    this.secondsElement = document.getElementById("seconds");

    if (
      !this.countdownElement ||
      !this.hoursElement ||
      !this.minutesElement ||
      !this.secondsElement
    ) {
      console.warn("Countdown elements not found");
      return;
    }

    // Set end time to 24 hours from now
    this.endTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    // Start the countdown
    this.startCountdown();

    // Add visual effects
    this.addVisualEffects();
  },

  /**
   * Start the countdown timer
   */
  startCountdown() {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  },

  /**
   * Update the countdown display
   */
  updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = this.endTime - now;

    if (timeLeft <= 0) {
      this.handleCountdownEnd();
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    this.hoursElement.textContent = hours.toString().padStart(2, "0");
    this.minutesElement.textContent = minutes.toString().padStart(2, "0");
    this.secondsElement.textContent = seconds.toString().padStart(2, "0");

    // Add pulse effect when time is running low
    if (hours === 0 && minutes < 10) {
      this.addUrgencyEffect();
    }
  },

  /**
   * Handle countdown end
   */
  handleCountdownEnd() {
    clearInterval(this.intervalId);

    // Update display to show expired
    this.hoursElement.textContent = "00";
    this.minutesElement.textContent = "00";
    this.secondsElement.textContent = "00";

    // Add expired styling
    this.countdownElement.classList.add("countdown-expired");

    // Show expired message
    this.showExpiredMessage();

    // Trigger deal refresh (simulate new deals)
    setTimeout(() => {
      this.refreshDeals();
    }, 3000);
  },

  /**
   * Add visual effects to countdown
   */
  addVisualEffects() {
    // Add hover effect
    this.countdownElement.addEventListener("mouseenter", () => {
      this.countdownElement.style.transform = "scale(1.05)";
    });

    this.countdownElement.addEventListener("mouseleave", () => {
      this.countdownElement.style.transform = "scale(1)";
    });

    // Add click effect
    this.countdownElement.addEventListener("click", () => {
      this.addClickEffect();
    });
  },

  /**
   * Add urgency effect when time is running low
   */
  addUrgencyEffect() {
    this.countdownElement.style.animation = "pulse 1s infinite";

    // Add CSS for pulse animation if not exists
    if (!document.getElementById("countdown-pulse-style")) {
      const style = document.createElement("style");
      style.id = "countdown-pulse-style";
      style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `;
      document.head.appendChild(style);
    }
  },

  /**
   * Add click effect
   */
  addClickEffect() {
    this.countdownElement.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.countdownElement.style.transform = "scale(1)";
    }, 150);
  },

  /**
   * Show expired message
   */
  showExpiredMessage() {
    const expiredMessage = document.createElement("div");
    expiredMessage.className = "countdown-expired-message";
    expiredMessage.innerHTML = `
            <div class="expired-content">
                <span class="expired-icon">⏰</span>
                <span class="expired-text">Deals Expired! New deals coming soon...</span>
            </div>
        `;

    // Add styles for expired message
    const style = document.createElement("style");
    style.textContent = `
            .countdown-expired-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #e74c3c, #c0392b);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
                z-index: 1000;
                animation: slideIn 0.5s ease;
            }
            
            .expired-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .expired-icon {
                font-size: 1.2rem;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(expiredMessage);

    // Remove message after 5 seconds
    setTimeout(() => {
      expiredMessage.remove();
    }, 5000);
  },

  /**
   * Refresh deals (simulate new deals)
   */
  refreshDeals() {
    // Simulate loading new deals
    const dealsGrid = document.querySelector(".flash-deals__grid");
    if (dealsGrid) {
      dealsGrid.style.opacity = "0.5";
      dealsGrid.style.pointerEvents = "none";

      setTimeout(() => {
        // Reset countdown for new deals
        this.endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        this.countdownElement.classList.remove("countdown-expired");
        this.countdownElement.style.animation = "";

        // Restore deals grid
        dealsGrid.style.opacity = "1";
        dealsGrid.style.pointerEvents = "auto";

        // Restart countdown
        this.startCountdown();

        // Show refresh message
        this.showRefreshMessage();
      }, 2000);
    }
  },

  /**
   * Show refresh message
   */
  showRefreshMessage() {
    const refreshMessage = document.createElement("div");
    refreshMessage.className = "deals-refresh-message";
    refreshMessage.innerHTML = `
            <div class="refresh-content">
                <span class="refresh-icon">🆕</span>
                <span class="refresh-text">New deals loaded! Check them out!</span>
            </div>
        `;

    // Add styles for refresh message
    const style = document.createElement("style");
    style.textContent = `
            .deals-refresh-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #27ae60, #229954);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 20px rgba(39, 174, 96, 0.3);
                z-index: 1000;
                animation: slideIn 0.5s ease;
            }
            
            .refresh-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .refresh-icon {
                font-size: 1.2rem;
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(refreshMessage);

    // Remove message after 5 seconds
    setTimeout(() => {
      refreshMessage.remove();
    }, 5000);
  },

  /**
   * Get formatted time remaining
   */
  getFormattedTimeRemaining() {
    const now = new Date().getTime();
    const timeLeft = this.endTime - now;

    if (timeLeft <= 0) {
      return "Expired";
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  },

  /**
   * Pause countdown
   */
  pauseCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  /**
   * Resume countdown
   */
  resumeCountdown() {
    if (!this.intervalId) {
      this.startCountdown();
    }
  },

  /**
   * Reset countdown to specific time
   */
  resetCountdown(hours = 24) {
    this.pauseCountdown();
    this.endTime = new Date().getTime() + hours * 60 * 60 * 1000;
    this.countdownElement.classList.remove("countdown-expired");
    this.countdownElement.style.animation = "";
    this.startCountdown();
  },

  /**
   * Add deal interaction handlers
   */
  addDealInteractions() {
    const dealButtons = document.querySelectorAll(".deal-btn");

    dealButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleDealClick(button);
      });
    });
  },

  /**
   * Handle deal button click
   */
  handleDealClick(button) {
    const dealCard = button.closest(".deal-card");
    const gameName = dealCard.querySelector("h3").textContent;

    // Add click animation
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);

    // Show added to cart message
    this.showAddedToCartMessage(gameName);

    // Simulate adding to cart
    setTimeout(() => {
      button.textContent = "Added to Cart!";
      button.style.background = "#27ae60";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.style.background = "linear-gradient(45deg, #e74c3c, #c0392b)";
        button.disabled = false;
      }, 2000);
    }, 500);
  },

  /**
   * Show added to cart message
   */
  showAddedToCartMessage(gameName) {
    const message = document.createElement("div");
    message.className = "cart-message";
    message.innerHTML = `
            <div class="cart-content">
                <span class="cart-icon">🛒</span>
                <span class="cart-text">${gameName} added to cart!</span>
            </div>
        `;

    // Add styles for cart message
    const style = document.createElement("style");
    style.textContent = `
            .cart-message {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(45deg, #3498db, #2980b9);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
                z-index: 1000;
                animation: slideInUp 0.5s ease;
            }
            
            .cart-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .cart-icon {
                font-size: 1.2rem;
            }
            
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(message);

    // Remove message after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = flashDealsCountdown;
}
