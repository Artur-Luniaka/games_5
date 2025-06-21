/**
 * Cookie Consent Manager
 * Handles the logic for the cookie consent bar, including showing/hiding it
 * and saving the user's consent in localStorage.
 */
const cookieConsentManager = {
  consentBar: null,
  acceptButton: null,
  consentKey: "onlineGameFusionLabCookieConsent",

  /**
   * Initializes the cookie consent functionality.
   */
  initialize() {
    this.consentBar = document.getElementById("cookie-consent-bar");
    this.acceptButton = document.getElementById("cookie-consent-accept");

    if (!this.consentBar || !this.acceptButton) {
      return; // Elements not present on the page
    }

    this.attachEventListeners();

    // Check if consent has already been given
    if (localStorage.getItem(this.consentKey) !== "true") {
      this.showConsentBar();
    }
  },

  /**
   * Attaches the necessary event listeners.
   */
  attachEventListeners() {
    this.acceptButton.addEventListener("click", () => this.acceptConsent());
  },

  /**
   * Shows the cookie consent bar with a smooth animation.
   */
  showConsentBar() {
    // Use a timeout to ensure the transform transition is applied
    setTimeout(() => {
      this.consentBar.classList.add("show");
    }, 100);
  },

  /**
   * Hides the cookie consent bar and stores the consent state.
   */
  acceptConsent() {
    localStorage.setItem(this.consentKey, "true");
    this.consentBar.classList.remove("show");
  },
};

// Initialize the manager once the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  cookieConsentManager.initialize();
});
