// Hero Animation Orchestrator
const heroAnimationOrchestrator = {
  // Initialize hero animations
  initializeHeroAnimations() {
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupInteractiveElements();
    this.setupRealmCardAnimations();
  },

  // Setup scroll-based animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((element) => {
      observer.observe(element);
    });

    // Add fade-in class to elements that should animate
    const elementsToAnimate = document.querySelectorAll(
      ".realm-card, .platform-card, .stat-item"
    );
    elementsToAnimate.forEach((element, index) => {
      element.classList.add("fade-in");
      element.style.animationDelay = `${index * 0.1}s`;
    });
  },

  // Setup parallax effects for hero section
  setupParallaxEffects() {
    const heroSection = document.querySelector(".hero-nexus");
    const floatingOrbs = document.querySelectorAll(".floating-orb");

    if (!heroSection || floatingOrbs.length === 0) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      floatingOrbs.forEach((orb, index) => {
        const speed = 0.3 + index * 0.1;
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px) rotate(${
          scrolled * 0.1
        }deg)`;
      });
    });
  },

  // Setup interactive elements
  setupInteractiveElements() {
    this.setupRealmCardInteractions();
    this.setupPlatformCardInteractions();
    this.setupNewsletterForm();
  },

  // Setup realm card interactions
  setupRealmCardInteractions() {
    const realmCards = document.querySelectorAll(".realm-card");

    realmCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.animateRealmCard(card, "enter");
      });

      card.addEventListener("mouseleave", () => {
        this.animateRealmCard(card, "leave");
      });

      card.addEventListener("click", () => {
        this.handleRealmCardClick(card);
      });
    });
  },

  // Animate realm card
  animateRealmCard(card, action) {
    const visual = card.querySelector(".realm-card__visual");
    const content = card.querySelector(".realm-card__content");

    if (action === "enter") {
      visual.style.transform = "scale(1.05)";
      content.style.transform = "translateY(-5px)";
      card.style.transform = "translateY(-10px) scale(1.02)";
    } else {
      visual.style.transform = "scale(1)";
      content.style.transform = "translateY(0)";
      card.style.transform = "translateY(0) scale(1)";
    }
  },

  // Handle realm card click
  handleRealmCardClick(card) {
    const cardType = this.getCardType(card);

    // Add click animation
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "scale(1)";
    }, 150);

    // Navigate to appropriate page based on card type
    setTimeout(() => {
      window.location.href = `game-catalog.html?category=${cardType}`;
    }, 200);
  },

  // Get card type from class
  getCardType(card) {
    const classes = card.className.split(" ");
    const typeClass = classes.find((cls) => cls.startsWith("realm-card--"));
    return typeClass ? typeClass.replace("realm-card--", "") : "all";
  },

  // Setup platform card interactions
  setupPlatformCardInteractions() {
    const platformCards = document.querySelectorAll(".platform-card");

    platformCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.animatePlatformCard(card, "enter");
      });

      card.addEventListener("mouseleave", () => {
        this.animatePlatformCard(card, "leave");
      });
    });
  },

  // Animate platform card
  animatePlatformCard(card, action) {
    const icon = card.querySelector(".platform-card__icon");
    const features = card.querySelectorAll(".platform-features li");

    if (action === "enter") {
      icon.style.transform = "scale(1.1) rotate(5deg)";
      features.forEach((feature, index) => {
        feature.style.transform = `translateX(${10 + index * 5}px)`;
        feature.style.opacity = "1";
      });
    } else {
      icon.style.transform = "scale(1) rotate(0deg)";
      features.forEach((feature, index) => {
        feature.style.transform = "translateX(0)";
        feature.style.opacity = "0.8";
      });
    }
  },

  // Setup newsletter form
  setupNewsletterForm() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleNewsletterSubmission(newsletterForm);
    });
  },

  // Handle newsletter submission
  handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector(".newsletter-form__submit");
    const email = emailInput.value.trim();

    if (!this.validateEmail(email)) {
      this.showFormError(emailInput, "Please enter a valid email address");
      return;
    }

    // Show success state
    submitButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Subscribed!</span>
        `;
    submitButton.style.background = "var(--primary-emerald)";
    emailInput.value = "";

    // Reset after 3 seconds
    setTimeout(() => {
      submitButton.innerHTML = `
                <span>Subscribe</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                </svg>
            `;
      submitButton.style.background = "";
    }, 3000);
  },

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Show form error
  showFormError(input, message) {
    input.style.borderColor = "var(--accent-coral)";
    input.style.animation = "shake 0.5s ease-in-out";

    // Remove error state after animation
    setTimeout(() => {
      input.style.borderColor = "";
      input.style.animation = "";
    }, 500);
  },

  // Setup realm card animations
  setupRealmCardAnimations() {
    const realmCards = document.querySelectorAll(".realm-card");

    realmCards.forEach((card, index) => {
      // Add staggered entrance animation
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";

      setTimeout(() => {
        card.style.transition = "all 0.6s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 200);
    });
  },

  // Add custom CSS animations
  addCustomAnimations() {
    const style = document.createElement("style");
    style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
                50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
            }

            .realm-card:hover {
                animation: pulse-glow 2s ease-in-out infinite;
            }

            .platform-card__icon {
                transition: all 0.3s ease;
            }

            .platform-features li {
                transition: all 0.3s ease;
                opacity: 0.8;
            }

            .newsletter-form__submit {
                transition: all 0.3s ease;
            }

            .newsletter-form__submit:hover {
                transform: translateY(-2px) scale(1.05);
            }
        `;
    document.head.appendChild(style);
  },
};

// Initialize hero animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  heroAnimationOrchestrator.initializeHeroAnimations();
  heroAnimationOrchestrator.addCustomAnimations();
});

// Export for use in other scripts
window.heroAnimationOrchestrator = heroAnimationOrchestrator;
