/**
 * Newsletter Subscription Handler
 * Manages the "Stay in the Loop" newsletter form.
 */
const newsletterHandler = {
  form: null,
  emailInput: null,
  submitButton: null,

  /**
   * Initializes the newsletter form functionality.
   */
  initialize() {
    this.form = document.getElementById("newsletter-form");
    if (!this.form) return;

    this.emailInput = this.form.querySelector('input[type="email"]');
    this.submitButton = this.form.querySelector(".newsletter-form__submit");

    if (!this.emailInput || !this.submitButton) return;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit();
    });
  },

  /**
   * Handles the form submission.
   */
  handleSubmit() {
    const email = this.emailInput.value.trim();

    // 1. Silently exit if email is invalid or empty
    if (!this.isValidEmail(email)) {
      return;
    }

    // 2. Process subscription and update UI
    this.saveEmail(email);
    this.setSubscribedState();
  },

  /**
   * Checks if the provided email has a valid format.
   * @param {string} email - The email to validate.
   * @returns {boolean} - True if the email is valid, false otherwise.
   */
  isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Saves the subscribed email to localStorage.
   * @param {string} email - The email to save.
   */
  saveEmail(email) {
    try {
      const subscriptions =
        JSON.parse(localStorage.getItem("newsletterSubscriptions")) || [];
      if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem(
          "newsletterSubscriptions",
          JSON.stringify(subscriptions)
        );
      }
    } catch (error) {
      console.error("Error saving email to localStorage:", error);
    }
  },

  /**
   * Updates the form's UI to a "subscribed" state.
   */
  setSubscribedState() {
    this.emailInput.readOnly = true;
    this.submitButton.disabled = true;
    this.submitButton.innerHTML = `
      <span>Subscribed</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7"></path>
      </svg>
    `;
    this.form.classList.add("subscribed");
  },
};

// Initialize the handler
document.addEventListener("DOMContentLoaded", () => {
  newsletterHandler.initialize();
});
