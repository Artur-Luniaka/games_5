// Newsletter Subscription Handler
const newsletterSubscriptionHandler = {
  // Initialize newsletter handler
  initializeNewsletterHandler() {
    this.setupNewsletterForm();
    this.setupEmailValidation();
  },

  // Setup newsletter form
  setupNewsletterForm() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (!newsletterForm) return;

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector(
      ".newsletter-form__submit"
    );

    if (emailInput && submitButton) {
      // Real-time email validation
      emailInput.addEventListener("input", () => {
        this.validateEmailInRealTime(emailInput);
      });

      // Form submission
      newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleNewsletterSubmission(newsletterForm);
      });

      // Focus effects
      emailInput.addEventListener("focus", () => {
        this.animateInputFocus(emailInput, "focus");
      });

      emailInput.addEventListener("blur", () => {
        this.animateInputFocus(emailInput, "blur");
      });
    }
  },

  // Setup email validation
  setupEmailValidation() {
    // Add custom validation styles
    const style = document.createElement("style");
    style.textContent = `
            .newsletter-form__input-group {
                position: relative;
            }

            .newsletter-form__input-group input {
                transition: all 0.3s ease;
            }

            .newsletter-form__input-group input:focus {
                transform: scale(1.02);
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }

            .newsletter-form__input-group input.valid {
                border-color: var(--primary-emerald);
                background: rgba(16, 185, 129, 0.05);
            }

            .newsletter-form__input-group input.invalid {
                border-color: var(--accent-coral);
                background: rgba(249, 115, 22, 0.05);
                animation: shake 0.5s ease-in-out;
            }

            .newsletter-form__input-group input.valid + .newsletter-form__submit {
                background: var(--primary-emerald);
                transform: scale(1.05);
            }

            .newsletter-form__input-group input.invalid + .newsletter-form__submit {
                background: var(--accent-coral);
                opacity: 0.7;
                pointer-events: none;
            }

            .validation-indicator {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: all 0.3s ease;
            }

            .validation-indicator.valid {
                opacity: 1;
                background: var(--primary-emerald);
                color: white;
            }

            .validation-indicator.invalid {
                opacity: 1;
                background: var(--accent-coral);
                color: white;
            }

            .validation-indicator svg {
                width: 12px;
                height: 12px;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes success-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .newsletter-success {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--background-white);
                padding: var(--spacing-xl);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-large);
                z-index: 1002;
                text-align: center;
                max-width: 400px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .newsletter-success.show {
                opacity: 1;
                visibility: visible;
            }

            .newsletter-success__icon {
                width: 64px;
                height: 64px;
                margin: 0 auto var(--spacing-lg);
                background: var(--primary-emerald);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                animation: success-pulse 2s ease-in-out infinite;
            }

            .newsletter-success__icon svg {
                width: 32px;
                height: 32px;
            }

            .newsletter-success h3 {
                color: var(--text-primary);
                margin-bottom: var(--spacing-sm);
            }

            .newsletter-success p {
                color: var(--text-secondary);
                margin-bottom: var(--spacing-lg);
            }

            .newsletter-success__close {
                background: var(--primary-emerald);
                color: white;
                border: none;
                padding: var(--spacing-sm) var(--spacing-lg);
                border-radius: var(--radius-lg);
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .newsletter-success__close:hover {
                background: var(--primary-emerald-dark);
                transform: translateY(-2px);
            }
        `;
    document.head.appendChild(style);
  },

  // Validate email in real time
  validateEmailInRealTime(emailInput) {
    const email = emailInput.value.trim();
    const isValid = this.isValidEmailFormat(email);
    const submitButton = emailInput.parentElement.querySelector(
      ".newsletter-form__submit"
    );

    // Remove existing validation indicator
    const existingIndicator = emailInput.parentElement.querySelector(
      ".validation-indicator"
    );
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Add validation indicator
    const indicator = document.createElement("div");
    indicator.className = `validation-indicator ${
      isValid ? "valid" : "invalid"
    }`;

    if (isValid) {
      indicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
            `;
    } else {
      indicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
    }

    emailInput.parentElement.appendChild(indicator);

    // Update input and button states
    emailInput.classList.remove("valid", "invalid");
    if (email.length > 0) {
      emailInput.classList.add(isValid ? "valid" : "invalid");
    }

    if (submitButton) {
      submitButton.disabled = !isValid || email.length === 0;
    }
  },

  // Check if email format is valid
  isValidEmailFormat(email) {
    if (!email) return false;

    // Custom email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Additional checks
    const hasAtSymbol = email.includes("@");
    const hasDomain = email.split("@")[1]?.includes(".");
    const hasValidLength = email.length >= 5 && email.length <= 254;
    const startsWithValidChar = /^[a-zA-Z0-9._%+-]/.test(email);
    const endsWithValidChar = /[a-zA-Z0-9]$/.test(email);
    const noConsecutiveDots = !email.includes("..");
    const noConsecutiveAtSymbols = (email.match(/@/g) || []).length === 1;

    return (
      emailRegex.test(email) &&
      hasAtSymbol &&
      hasDomain &&
      hasValidLength &&
      startsWithValidChar &&
      endsWithValidChar &&
      noConsecutiveDots &&
      noConsecutiveAtSymbols
    );
  },

  // Handle newsletter submission
  handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector(".newsletter-form__submit");
    const email = emailInput.value.trim();

    if (!this.isValidEmailFormat(email)) {
      this.showValidationError(
        emailInput,
        "Please enter a valid email address"
      );
      return;
    }

    // Show loading state
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = `
            <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"></path>
            </svg>
            <span>Subscribing...</span>
        `;
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.showSuccessMessage(email);
      emailInput.value = "";
      emailInput.classList.remove("valid", "invalid");

      // Reset button
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;

      // Remove validation indicator
      const indicator = emailInput.parentElement.querySelector(
        ".validation-indicator"
      );
      if (indicator) {
        indicator.remove();
      }
    }, 2000);
  },

  // Show validation error
  showValidationError(input, message) {
    input.classList.add("invalid");
    input.style.animation = "shake 0.5s ease-in-out";

    // Create error message
    const errorMessage = document.createElement("div");
    errorMessage.className = "validation-error";
    errorMessage.textContent = message;
    errorMessage.style.cssText = `
            color: var(--accent-coral);
            font-size: 0.875rem;
            margin-top: var(--spacing-xs);
            animation: fadeIn 0.3s ease;
        `;

    input.parentElement.appendChild(errorMessage);

    // Remove error message after 3 seconds
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    }, 3000);

    // Remove animation after it completes
    setTimeout(() => {
      input.style.animation = "";
    }, 500);
  },

  // Show success message
  showSuccessMessage(email) {
    // Create success modal
    const successModal = document.createElement("div");
    successModal.className = "newsletter-success";
    successModal.innerHTML = `
            <div class="newsletter-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3>Successfully Subscribed!</h3>
            <p>Thank you for subscribing to our newsletter. We'll keep you updated with the latest gaming news and exclusive offers.</p>
            <button class="newsletter-success__close">Continue</button>
        `;

    document.body.appendChild(successModal);

    // Show modal
    setTimeout(() => {
      successModal.classList.add("show");
    }, 100);

    // Handle close button
    const closeButton = successModal.querySelector(
      ".newsletter-success__close"
    );
    closeButton.addEventListener("click", () => {
      successModal.classList.remove("show");
      setTimeout(() => {
        if (successModal.parentNode) {
          successModal.parentNode.removeChild(successModal);
        }
      }, 300);
    });

    // Close on background click
    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        closeButton.click();
      }
    });

    // Close on escape key
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeButton.click();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);

    // Store subscription in localStorage
    this.storeNewsletterSubscription(email);
  },

  // Store newsletter subscription
  storeNewsletterSubscription(email) {
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem("pixelVaultNewsletter") || "[]"
      );
      const subscription = {
        email: email,
        date: new Date().toISOString(),
        status: "active",
      };

      // Check if email already exists
      const existingIndex = subscriptions.findIndex(
        (sub) => sub.email === email
      );
      if (existingIndex !== -1) {
        subscriptions[existingIndex] = subscription;
      } else {
        subscriptions.push(subscription);
      }

      localStorage.setItem(
        "pixelVaultNewsletter",
        JSON.stringify(subscriptions)
      );
    } catch (error) {
      console.error("Error storing newsletter subscription:", error);
    }
  },

  // Animate input focus
  animateInputFocus(input, action) {
    const inputGroup = input.parentElement;

    if (action === "focus") {
      inputGroup.style.transform = "scale(1.02)";
    } else {
      inputGroup.style.transform = "scale(1)";
    }
  },

  // Get subscription statistics
  getSubscriptionStats() {
    try {
      const subscriptions = JSON.parse(
        localStorage.getItem("pixelVaultNewsletter") || "[]"
      );
      return {
        total: subscriptions.length,
        active: subscriptions.filter((sub) => sub.status === "active").length,
        recent: subscriptions.filter((sub) => {
          const subDate = new Date(sub.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return subDate > weekAgo;
        }).length,
      };
    } catch (error) {
      console.error("Error getting subscription stats:", error);
      return { total: 0, active: 0, recent: 0 };
    }
  },
};

// Add loading spinner styles
const addLoadingSpinnerStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
        .loading-spinner {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
  document.head.appendChild(style);
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  newsletterSubscriptionHandler.initializeNewsletterHandler();
  addLoadingSpinnerStyles();
});

// Export for use in other scripts
window.newsletterSubscriptionHandler = newsletterSubscriptionHandler;
