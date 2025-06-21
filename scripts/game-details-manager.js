// Game Details Management System
const gameDetailsManager = {
  // Current game data
  currentGameData: null,

  // Initialize the game details manager
  async initializeGameDetails() {
    const gameId = this.getGameIdFromUrl();
    if (!gameId) {
      this.renderError("Game not found.");
      return;
    }

    const gameData = await this.fetchGameData(gameId);
    if (!gameData) {
      this.renderError("Could not load game data.");
      return;
    }

    this.renderGameDetails(gameData);
  },

  getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  },

  async fetchGameData(gameId) {
    try {
      const response = await fetch(
        "data/digital-entertainment-collection.json"
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.digitalEntertainmentCollection.entertainmentItems.find(
        (item) => item.uniqueIdentifier === gameId
      );
    } catch (error) {
      console.error("Error fetching game data:", error);
      return null;
    }
  },

  // Render game details on the page
  renderGameDetails(game) {
    const container = document.getElementById("game-details-container");
    if (!container) return;

    document.title = `${game.title} - OnlineGameFusionLab`;

    const detailsHTML = `
      <div class="game-details-page">
        <div class="game-hero">
          <img src="${game.image}" alt="${
      game.title
    }" class="hero-background-image"/>
          <div class="hero-content">
            <div class="game-cover">
              <img src="${game.image}" alt="${game.title} Cover Art"/>
            </div>
            <div class="game-info">
              <h1>${game.title}</h1>
              <p>${game.subtitle}</p>
              <div class="meta-info">
                <span>${game.developer}</span> | <span>${new Date(
      game.releaseDate
    ).getFullYear()}</span> | <span>Rating: ${game.rating}</span>
              </div>
              <div class="price-section">
                <span class="price">${game.price}</span>
                <button class="add-to-cart-btn" data-game-id="${
                  game.uniqueIdentifier
                }">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
        <div class="game-content">
          <h2>About the Game</h2>
          <p>${game.description}</p>
          <h2>Features</h2>
          <ul>
            ${game.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          <h2>System Requirements</h2>
          <div class="system-reqs">
             <p><strong>OS:</strong> ${game.systemRequirements.minimum.os}</p>
             <p><strong>Processor:</strong> ${
               game.systemRequirements.minimum.processor
             }</p>
             <p><strong>Memory:</strong> ${
               game.systemRequirements.minimum.memory
             }</p>
             <p><strong>Graphics:</strong> ${
               game.systemRequirements.minimum.graphics
             }</p>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = detailsHTML;
  },

  // Render error message
  renderError(message) {
    const container = document.getElementById("game-details-container");
    if (!container) return;
    container.innerHTML = `<p class="error-message">${message}</p>`;
  },

  // Update page title
  updatePageTitle(title) {
    document.title = `${title} - PixelVault`;
  },

  // Render hero section
  renderHeroSection(game) {
    // Update breadcrumb
    const categoryElement = document.getElementById("game-category");
    if (categoryElement) {
      categoryElement.textContent = game.category;
    }

    // Update title
    const titleElement = document.getElementById("game-title");
    if (titleElement) {
      titleElement.textContent = game.title;
    }

    // Update rating
    this.renderRating(game.rating);

    // Update platforms
    this.renderPlatforms(game.platforms);

    // Update release date
    const releaseElement = document.getElementById("release-date");
    if (releaseElement) {
      releaseElement.textContent = this.formatDate(game.releaseDate);
    }

    // Update description
    const descriptionElement = document.getElementById("game-description");
    if (descriptionElement) {
      descriptionElement.textContent = game.description;
    }

    // Update features
    this.renderFeatures(game.features);

    // Update price
    const priceElement = document.getElementById("price-value");
    if (priceElement) {
      priceElement.textContent = game.price.toFixed(2);
    }

    // Update hero image
    const heroImage = document.getElementById("game-hero-image");
    if (heroImage) {
      heroImage.src = game.image;
      heroImage.alt = game.title;
    }
  },

  // Render rating stars
  renderRating(rating) {
    const starsContainer = document.getElementById("rating-stars");
    const ratingValue = document.getElementById("rating-value");

    if (starsContainer) {
      starsContainer.innerHTML = "";

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("svg");
        star.className = `star ${i <= rating ? "" : "empty"}`;
        star.innerHTML =
          '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
        starsContainer.appendChild(star);
      }
    }

    if (ratingValue) {
      ratingValue.textContent = rating.toFixed(1);
    }
  },

  // Render platforms
  renderPlatforms(platforms) {
    const platformsContainer = document.getElementById("game-platforms");

    if (platformsContainer) {
      platformsContainer.innerHTML = "";

      platforms.forEach((platform) => {
        const badge = document.createElement("span");
        badge.className = "platform-badge";
        badge.textContent = platform;
        platformsContainer.appendChild(badge);
      });
    }
  },

  // Render features list
  renderFeatures(features) {
    const featuresList = document.getElementById("features-list");

    if (featuresList) {
      featuresList.innerHTML = "";

      features.forEach((feature) => {
        const li = document.createElement("li");
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    }
  },

  // Render game info
  renderGameInfo(game) {
    // Update developer
    const developerElement = document.getElementById("developer-name");
    if (developerElement) {
      developerElement.textContent = game.developer;
    }

    // Update release info
    const releaseInfoElement = document.getElementById("release-info");
    if (releaseInfoElement) {
      releaseInfoElement.textContent = this.formatDate(game.releaseDate);
    }

    // Update genre info
    const genreElement = document.getElementById("genre-info");
    if (genreElement) {
      genreElement.textContent = game.category;
    }

    // Update about content
    const aboutElement = document.getElementById("about-content");
    if (aboutElement) {
      aboutElement.innerHTML = `
        <p>${game.description}</p>
        <p>Experience the ultimate gaming adventure with ${game.title}, a masterpiece from ${game.developer}. 
        This game combines stunning visuals, immersive gameplay, and an unforgettable story that will keep you 
        engaged for hours on end.</p>
        <p>Whether you're playing on PC or Xbox, you'll enjoy the same high-quality experience with optimized 
        performance and stunning graphics that push the boundaries of what's possible in modern gaming.</p>
      `;
    }
  },

  // Render system requirements
  renderSystemRequirements(game) {
    if (game.systemRequirements) {
      // Minimum requirements
      if (game.systemRequirements.minimum) {
        const min = game.systemRequirements.minimum;
        document.getElementById("min-os").textContent = min.os || "Windows 10";
        document.getElementById("min-processor").textContent =
          min.processor || "Intel Core i5";
        document.getElementById("min-memory").textContent =
          min.memory || "8 GB RAM";
        document.getElementById("min-graphics").textContent =
          min.graphics || "GTX 1060";
        document.getElementById("min-storage").textContent =
          min.storage || "50 GB";
      }

      // Recommended requirements
      if (game.systemRequirements.recommended) {
        const rec = game.systemRequirements.recommended;
        document.getElementById("rec-os").textContent = rec.os || "Windows 11";
        document.getElementById("rec-processor").textContent =
          rec.processor || "Intel Core i7";
        document.getElementById("rec-memory").textContent =
          rec.memory || "16 GB RAM";
        document.getElementById("rec-graphics").textContent =
          rec.graphics || "RTX 3070";
        document.getElementById("rec-storage").textContent =
          rec.storage || "100 GB SSD";
      }
    }
  },

  // Render game tags
  renderGameTags(game) {
    const tagsContainer = document.getElementById("game-tags");

    if (tagsContainer && game.tags) {
      tagsContainer.innerHTML = "";

      game.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "game-tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }
  },

  // Render similar games
  async renderSimilarGames(currentGame) {
    const similarContainer = document.getElementById("similar-games");

    if (similarContainer) {
      try {
        const response = await fetch(
          "data/digital-entertainment-collection.json"
        );
        const data = await response.json();

        // Find games in the same category, excluding current game
        const similarGames =
          data.digitalEntertainmentCollection.entertainmentItems
            .filter(
              (game) =>
                game.category === currentGame.category &&
                game.uniqueIdentifier !== currentGame.uniqueIdentifier
            )
            .slice(0, 3);

        similarContainer.innerHTML = "";

        similarGames.forEach((game) => {
          const gameElement = document.createElement("a");
          gameElement.className = "similar-game";
          gameElement.href = `game-details.html?id=${game.uniqueIdentifier}`;

          gameElement.innerHTML = `
            <img src="${game.image}" alt="${
            game.title
          }" class="similar-game__image">
            <div class="similar-game__info">
              <h4 class="similar-game__title">${game.title}</h4>
              <span class="similar-game__price">$${game.price.toFixed(2)}</span>
            </div>
          `;

          similarContainer.appendChild(gameElement);
        });
      } catch (error) {
        console.error("Error loading similar games:", error);
      }
    }
  },

  // Setup screenshot gallery
  setupScreenshotGallery(game) {
    const screenshotsContainer = document.getElementById(
      "screenshots-container"
    );
    const heroImage = document.getElementById("game-hero-image");

    if (screenshotsContainer && game.screenshots) {
      screenshotsContainer.innerHTML = "";

      // Add main image as first screenshot
      const mainThumb = document.createElement("img");
      mainThumb.src = game.image;
      mainThumb.alt = game.title;
      mainThumb.className = "screenshot-thumb active";
      mainThumb.onclick = () => this.updateHeroImage(game.image, mainThumb);
      screenshotsContainer.appendChild(mainThumb);

      // Add additional screenshots
      game.screenshots.forEach((screenshot, index) => {
        const thumb = document.createElement("img");
        thumb.src = screenshot;
        thumb.alt = `${game.title} Screenshot ${index + 1}`;
        thumb.className = "screenshot-thumb";
        thumb.onclick = () => this.updateHeroImage(screenshot, thumb);
        screenshotsContainer.appendChild(thumb);
      });
    }
  },

  // Update hero image when screenshot is clicked
  updateHeroImage(imageSrc, clickedThumb) {
    const heroImage = document.getElementById("game-hero-image");
    if (heroImage) {
      heroImage.src = imageSrc;
    }

    // Update active state
    const allThumbs = document.querySelectorAll(".screenshot-thumb");
    allThumbs.forEach((thumb) => thumb.classList.remove("active"));
    clickedThumb.classList.add("active");
  },

  // Initialize requirements tabs
  initializeRequirementsTabs() {
    const tabs = document.querySelectorAll(".requirements-tab");
    const panels = document.querySelectorAll(".requirements-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.requirement;

        // Update active tab
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Update active panel
        panels.forEach((panel) => {
          panel.classList.remove("active");
          if (panel.id === `${target}-requirements`) {
            panel.classList.add("active");
          }
        });
      });
    });
  },

  // Setup event listeners
  setupEventListeners() {
    // Add to cart button
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addGameToCart();
      });
    }

    // Wishlist button
    const wishlistBtn = document.getElementById("wishlist-btn");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        this.addGameToWishlist();
      });
    }
  },

  // Add game to cart
  addGameToCart() {
    if (this.currentGameData) {
      // Use the navigation system's cart functionality
      if (typeof navigationInjectionSystem !== "undefined") {
        navigationInjectionSystem.addItemToCart(this.currentGameData);
        this.showNotification("Game added to cart!", "success");
      }
    }
  },

  // Add game to wishlist
  addGameToWishlist() {
    if (this.currentGameData) {
      // Get existing wishlist from localStorage
      const wishlist = JSON.parse(
        localStorage.getItem("pixelvault_wishlist") || "[]"
      );

      // Check if game is already in wishlist
      const existingIndex = wishlist.findIndex(
        (item) =>
          item.uniqueIdentifier === this.currentGameData.uniqueIdentifier
      );

      if (existingIndex === -1) {
        // Add to wishlist
        wishlist.push(this.currentGameData);
        localStorage.setItem("pixelvault_wishlist", JSON.stringify(wishlist));
        this.showNotification("Game added to wishlist!", "success");
      } else {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        localStorage.setItem("pixelvault_wishlist", JSON.stringify(wishlist));
        this.showNotification("Game removed from wishlist!", "info");
      }
    }
  },

  // Show notification
  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `game-notification game-notification--${type}`;
    notification.innerHTML = `
      <div class="game-notification__content">
        <span class="game-notification__message">${message}</span>
        <button class="game-notification__close">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === "success" ? "#27ae60" : "#3498db"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Setup close button
    const closeBtn = notification.querySelector(".game-notification__close");
    closeBtn.addEventListener("click", () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
  },

  // Show error state
  showErrorState(message) {
    const main = document.querySelector(".game-details-realm");
    if (main) {
      main.innerHTML = `
        <div class="error-state">
          <div class="container">
            <div class="error-state__content">
              <h1>Game Not Found</h1>
              <p>${message}</p>
              <a href="game-catalog.html" class="error-state__link">Back to Catalog</a>
            </div>
          </div>
        </div>
      `;
    }
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  gameDetailsManager.initializeGameDetails();
});
