/**
 * Contact Form Handler
 * Manages contact form validation, submission, and user interactions
 */

const contactFormHandler = {
  form: null,
  submitButton: null,
  isSubmitting: false,
  notificationTimer: null,

  /**
   * Initialize the contact form
   */
  initializeContactForm() {
    this.form = document.getElementById("contact-form");
    this.submitButton = this.form?.querySelector(".contact-submit");

    if (!this.form || !this.submitButton) {
      console.warn("Contact form elements not found");
      return;
    }

    this.setupEventListeners();
    this.initializeFormValidation();
  },

  /**
   * Setup form event listeners
   */
  setupEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });

    // Email validation on input
    const emailInput = this.form.querySelector("#email");
    if (emailInput) {
      emailInput.addEventListener("input", () =>
        this.validateEmailFormat(emailInput)
      );
    }
  },

  /**
   * Initialize form validation
   */
  initializeFormValidation() {
    // Add required field indicators
    const requiredFields = this.form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      const label = this.form.querySelector(`label[for="${field.id}"]`);
      if (label) {
        label.innerHTML += ' <span class="required-indicator">*</span>';
      }
    });
  },

  /**
   * Handle form submission
   */
  async handleFormSubmission() {
    if (this.isSubmitting) return;

    // Validate all fields
    const isValid = this.validateAllFields();
    if (!isValid) {
      this.showFormMessage("Please correct the errors below.", "error");
      return;
    }

    this.setSubmittingState(true);

    // Scroll to top on successful validation before submitting
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      // Simulate form submission
      await this.simulateSubmission();

      this.showFormMessage(
        "Thank you! Your message has been sent successfully. We'll get back to you soon.",
        "success"
      );
      this.resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showFormMessage(
        "Sorry, there was an error sending your message. Please try again.",
        "error"
      );
    } finally {
      this.setSubmittingState(false);
    }
  },

  /**
   * Validate all form fields
   */
  validateAllFields() {
    const fields = this.form.querySelectorAll("input, select, textarea");
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required.";
    }

    // Email validation
    if (field.type === "email" && value) {
      if (!this.isValidEmail(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address.";
      }
    }

    // Name validation
    if (field.id === "first-name" || field.id === "last-name") {
      if (value && value.length < 2) {
        isValid = false;
        errorMessage = "Name must be at least 2 characters long.";
      }
    }

    // Message validation
    if (field.id === "message" && value) {
      if (value.length < 10) {
        isValid = false;
        errorMessage = "Message must be at least 10 characters long.";
      }
    }

    // Subject validation
    if (field.id === "subject" && value === "") {
      isValid = false;
      errorMessage = "Please select a subject.";
    }

    this.displayFieldValidation(field, isValid, errorMessage);
    return isValid;
  },

  /**
   * Validate email format
   */
  validateEmailFormat(emailInput) {
    const email = emailInput.value.trim();
    const errorElement = this.getErrorElement(emailInput);

    if (email && !this.isValidEmail(email)) {
      errorElement.textContent = "Please enter a valid email address.";
      emailInput.classList.add("error");
      emailInput.classList.remove("success");
    } else if (email && this.isValidEmail(email)) {
      errorElement.textContent = "";
      emailInput.classList.remove("error");
      emailInput.classList.add("success");
    } else {
      errorElement.textContent = "";
      emailInput.classList.remove("error", "success");
    }
  },

  /**
   * Check if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Display field validation result
   */
  displayFieldValidation(field, isValid, errorMessage) {
    const errorElement = this.getErrorElement(field);

    if (!isValid) {
      errorElement.textContent = errorMessage;
      field.classList.add("error");
      field.classList.remove("success");
    } else {
      errorElement.textContent = "";
      field.classList.remove("error");
      if (field.value.trim()) {
        field.classList.add("success");
      }
    }
  },

  /**
   * Clear field error
   */
  clearFieldError(field) {
    const errorElement = this.getErrorElement(field);
    if (errorElement.textContent) {
      errorElement.textContent = "";
      field.classList.remove("error");
    }
  },

  /**
   * Get error element for field
   */
  getErrorElement(field) {
    let errorElement = field.parentNode.querySelector(".form-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "form-error";
      field.parentNode.appendChild(errorElement);
    }
    return errorElement;
  },

  /**
   * Set submitting state
   */
  setSubmittingState(submitting) {
    this.isSubmitting = submitting;

    if (submitting) {
      this.submitButton.classList.add("loading");
      this.submitButton.disabled = true;
      this.submitButton.querySelector("span").textContent = "Sending...";
    } else {
      this.submitButton.classList.remove("loading");
      this.submitButton.disabled = false;
      this.submitButton.querySelector("span").textContent = "Send Message";
    }
  },

  /**
   * Simulate form submission
   */
  simulateSubmission() {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error("Network error"));
        }
      }, 1500);
    });
  },

  /**
   * Show a message to the user
   */
  showFormMessage(message, type) {
    const notification = document.getElementById("form-notification");
    if (!notification) {
      console.warn("Form notification element not found");
      return;
    }

    // Clear any existing timer to avoid premature hiding
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    // Set message and type
    notification.textContent = message;
    notification.className = "form-notification"; // Reset classes
    notification.classList.add(type); // 'success' or 'error'

    // Show the notification
    notification.classList.add("show");

    // Hide the notification after 5 seconds
    this.notificationTimer = setTimeout(() => {
      notification.classList.remove("show");
    }, 5000);
  },

  /**
   * Reset form
   */
  resetForm() {
    this.form.reset();

    // Clear all validation states
    const fields = this.form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.classList.remove("error", "success");
      const errorElement = this.getErrorElement(field);
      errorElement.textContent = "";
    });

    // Remove any existing messages
    const messages = this.form.querySelectorAll(
      ".success-message, .error-message"
    );
    messages.forEach((msg) => msg.remove());
  },

  /**
   * Get form data
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  },

  /**
   * Validate form data
   */
  validateFormData(data) {
    const errors = [];

    if (!data.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!data.lastName?.trim()) {
      errors.push("Last name is required");
    }

    if (!data.email?.trim()) {
      errors.push("Email is required");
    } else if (!this.isValidEmail(data.email)) {
      errors.push("Please enter a valid email address");
    }

    if (!data.subject) {
      errors.push("Please select a subject");
    }

    if (!data.message?.trim()) {
      errors.push("Message is required");
    } else if (data.message.length < 10) {
      errors.push("Message must be at least 10 characters long");
    }

    return errors;
  },

  /**
   * Format form data for display
   */
  formatFormData(data) {
    return {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      subject: data.subject,
      message: data.message,
      newsletter: data.newsletter === "on",
    };
  },

  /**
   * Log form submission (for debugging)
   */
  logFormSubmission(data) {
    console.log("Form submitted:", this.formatFormData(data));
  },

  /**
   * Handle form errors
   */
  handleFormErrors(errors) {
    errors.forEach((error) => {
      console.error("Form validation error:", error);
    });

    this.showFormMessage(errors.join(". "), "error");
  },

  /**
   * Initialize form animations
   */
  initializeAnimations() {
    // Add entrance animations to form elements
    const formElements = this.form.querySelectorAll(".form-group");
    formElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      setTimeout(() => {
        element.style.transition = "all 0.5s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 100);
    });
  },

  /**
   * Add form field animations
   */
  addFieldAnimations() {
    const fields = this.form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      field.addEventListener("focus", () => {
        field.parentNode.style.transform = "scale(1.02)";
      });

      field.addEventListener("blur", () => {
        field.parentNode.style.transform = "scale(1)";
      });
    });
  },

  /**
   * Initialize character counter for message field
   */
  initializeCharacterCounter() {
    const messageField = this.form.querySelector("#message");
    if (!messageField) return;

    const counter = document.createElement("div");
    counter.className = "character-counter";
    counter.style.cssText =
      "font-size: 0.8rem; color: #6c757d; text-align: right; margin-top: 0.25rem;";
    messageField.parentNode.appendChild(counter);

    const updateCounter = () => {
      const length = messageField.value.length;
      const minLength = 10;
      const color = length >= minLength ? "#27ae60" : "#6c757d";
      counter.style.color = color;
      counter.textContent = `${length}/${minLength} characters minimum`;
    };

    messageField.addEventListener("input", updateCounter);
    updateCounter();
  },

  /**
   * Add form accessibility features
   */
  addAccessibilityFeatures() {
    // Add ARIA labels
    const fields = this.form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      if (!field.getAttribute("aria-describedby")) {
        const errorId = `${field.id}-error`;
        field.setAttribute("aria-describedby", errorId);

        const errorElement = this.getErrorElement(field);
        errorElement.id = errorId;
      }
    });

    // Add keyboard navigation
    this.form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        this.handleFormSubmission();
      }
    });
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = contactFormHandler;
}
