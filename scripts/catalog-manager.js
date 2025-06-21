// Game Catalog Management System
const catalogManagementSystem = {
  // Initialize catalog manager
  initializeCatalogManager() {
    this.loadGamesData();
    this.setupEventListeners();
    this.updateStats();
  },

  // Current state
  currentState: {
    games: [],
    filteredGames: [],
    searchQuery: "",
    sortBy: "featured",
    currentPage: 1,
    gamesPerPage: 6,
    totalPages: 1,
  },

  // Load games data from JSON
  async loadGamesData() {
    try {
      this.showLoadingState();

      const response = await fetch(
        "data/digital-entertainment-collection.json"
      );
      const data = await response.json();

      this.currentState.games =
        data.digitalEntertainmentCollection.entertainmentItems;
      this.currentState.filteredGames = [...this.currentState.games];
      this.currentState.totalPages = Math.ceil(
        this.currentState.games.length / this.currentState.gamesPerPage
      );

      this.renderGames();
      this.renderPagination();
      this.hideLoadingState();
      this.updateStats();
    } catch (error) {
      console.error("Error loading games data:", error);
      this.showErrorState();
    }
  },

  // Setup event listeners
  setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentState.searchQuery = e.target.value;
        this.currentState.currentPage = 1; // Reset to first page on search
        this.applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentState.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    if (prevPageBtn) {
      prevPageBtn.addEventListener("click", () => {
        this.goToPage(this.currentState.currentPage - 1);
      });
    }

    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", () => {
        this.goToPage(this.currentState.currentPage + 1);
      });
    }
  },

  // Apply filters and sorting
  applyFilters() {
    let filtered = [...this.currentState.games];

    // Apply search filter
    if (this.currentState.searchQuery.trim() !== "") {
      const query = this.currentState.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.subtitle.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = this.sortGames(filtered, this.currentState.sortBy);

    this.currentState.filteredGames = filtered;
    this.currentState.totalPages = Math.ceil(
      filtered.length / this.currentState.gamesPerPage
    );

    // Ensure current page is valid
    if (this.currentState.currentPage > this.currentState.totalPages) {
      this.currentState.currentPage = this.currentState.totalPages || 1;
    }

    this.renderGames();
    this.renderPagination();
    this.updateStats();
  },

  // Sort games
  sortGames(games, sortBy) {
    const sorted = [...games];

    switch (sortBy) {
      case "alphabetical":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.userScore - a.userScore);
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
      case "featured":
      default:
        return sorted;
    }
  },

  // Get current page games
  getCurrentPageGames() {
    const startIndex =
      (this.currentState.currentPage - 1) * this.currentState.gamesPerPage;
    const endIndex = startIndex + this.currentState.gamesPerPage;
    return this.currentState.filteredGames.slice(startIndex, endIndex);
  },

  // Render games
  renderGames() {
    const container = document.getElementById("games-container");
    if (!container) return;

    const currentPageGames = this.getCurrentPageGames();

    if (currentPageGames.length === 0) {
      this.showNoResults();
      return;
    }

    const gamesHTML = currentPageGames
      .map((game) => this.createGameCardHTML(game))
      .join("");

    container.innerHTML = gamesHTML;
    this.setupGameCardInteractions();
  },

  // Create game card HTML
  createGameCardHTML(game) {
    const discountBadge =
      game.discountPercentage > 0
        ? `<div class="game-card__discount">-${game.discountPercentage}%</div>`
        : "";

    const priceDisplay =
      game.discountPercentage > 0
        ? `<span class="game-card__price-original">$${game.originalPrice}</span>
           <span class="game-card__price-current">$${game.price}</span>`
        : `<span class="game-card__price-current">$${game.price}</span>`;

    const platformsHTML = game.platforms
      .map(
        (platform) =>
          `<span class="platform-badge platform-badge--${platform.toLowerCase()}">${platform}</span>`
      )
      .join("");

    const tagsHTML = game.tags
      .slice(0, 3)
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    return `
      <div class="game-card" data-game-id="${game.uniqueIdentifier}">
        <div class="game-card__visual">
          <img src="${game.image}" alt="${
      game.title
    }" class="game-card__image" />
          ${discountBadge}
        </div>
        
        <div class="game-card__content">
          <div class="game-card__header">
            <h3 class="game-card__title">${game.title}</h3>
            <div class="game-card__score" style="color: ${this.getScoreColor(
              game.userScore
            )}">
              ★ ${game.userScore}
            </div>
          </div>
          
          <p class="game-card__subtitle">${game.subtitle}</p>
          
          <div class="game-card__meta">
            <div class="game-card__platforms">
              ${platformsHTML}
            </div>
            <div class="game-card__rating">
              <span class="rating-badge">${game.rating}</span>
            </div>
          </div>
          
          <div class="game-card__footer">
            <div class="game-card__pricing">
              ${priceDisplay}
            </div>
            <button class="game-card__add-to-cart" onclick="event.stopPropagation(); catalogManagementSystem.addGameToCart('${
              game.uniqueIdentifier
            }')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // Get score color
  getScoreColor(score) {
    if (score >= 8.5) return "#10b981";
    if (score >= 7.5) return "#f59e0b";
    if (score >= 6.5) return "#ef4444";
    return "#6b7280";
  },

  // Setup game card interactions
  setupGameCardInteractions() {
    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach((card) => {
      // Hover animations
      card.addEventListener("mouseenter", () => {
        this.animateGameCard(card, "enter");
      });

      card.addEventListener("mouseleave", () => {
        this.animateGameCard(card, "leave");
      });

      // Click handler for entire card
      card.addEventListener("click", (event) => {
        // Don't trigger if clicking on add to cart button
        if (event.target.closest(".game-card__add-to-cart")) {
          return;
        }

        const gameId = card.getAttribute("data-game-id");
        if (gameId) {
          window.location.href = `game-details.html?id=${gameId}`;
        }
      });

      // Add cursor pointer to indicate clickable
      card.style.cursor = "pointer";
    });
  },

  // Animate game card
  animateGameCard(card, action) {
    if (action === "enter") {
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    } else {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }
  },

  // Add game to cart
  addGameToCart(gameId) {
    const game = this.currentState.games.find(
      (g) => g.uniqueIdentifier === gameId
    );
    if (!game) return;

    // Get existing cart
    let cart = [];
    try {
      const cartData = localStorage.getItem("pixelVaultCart");
      cart = cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart:", error);
      cart = [];
    }

    // Check if game already in cart
    const existingItem = cart.find((item) => item.uniqueIdentifier === gameId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        uniqueIdentifier: game.uniqueIdentifier,
        title: game.title,
        price: game.price,
        image: game.image,
        quantity: 1,
      });
    }

    // Save cart
    try {
      localStorage.setItem("pixelVaultCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }

    // Update cart indicator
    if (window.navigationInjectionSystem) {
      window.navigationInjectionSystem.updateCartIndicator();
    }

    // Show notification
    this.showAddToCartNotification(game.title);
  },

  // Show add to cart notification
  showAddToCartNotification(gameTitle) {
    const notification = document.createElement("div");
    notification.className = "add-to-cart-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"></path>
        </svg>
        <span>${gameTitle} added to cart!</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  // Render pagination
  renderPagination() {
    const paginationPages = document.getElementById("pagination-pages");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (!paginationPages || !prevBtn || !nextBtn) return;

    // Update prev/next buttons
    prevBtn.disabled = this.currentState.currentPage <= 1;
    nextBtn.disabled =
      this.currentState.currentPage >= this.currentState.totalPages;

    // Generate page numbers
    let pagesHTML = "";
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentState.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      this.currentState.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentState.currentPage;
      pagesHTML += `
        <button class="pagination__page ${
          isActive ? "pagination__page--active" : ""
        }" 
                onclick="catalogManagementSystem.goToPage(${i})">
          ${i}
        </button>
      `;
    }

    paginationPages.innerHTML = pagesHTML;
  },

  // Go to specific page
  goToPage(page) {
    if (page < 1 || page > this.currentState.totalPages) return;

    this.currentState.currentPage = page;
    this.renderGames();
    this.renderPagination();
    this.updateStats();

    // Scroll to top of games section
    const gamesSection = document.querySelector(".games-showcase");
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: "smooth" });
    }
  },

  // Update stats
  updateStats() {
    const totalGames = document.getElementById("total-games");
    const totalPages = document.getElementById("total-pages");
    const currentPage = document.getElementById("current-page");
    const gamesRange = document.getElementById("games-range");
    const totalGamesDisplay = document.getElementById("total-games-display");

    if (totalGames) totalGames.textContent = this.currentState.games.length;
    if (totalPages) totalPages.textContent = this.currentState.totalPages;
    if (currentPage) currentPage.textContent = this.currentState.currentPage;

    const startGame =
      (this.currentState.currentPage - 1) * this.currentState.gamesPerPage + 1;
    const endGame = Math.min(
      startGame + this.currentState.gamesPerPage - 1,
      this.currentState.filteredGames.length
    );

    if (gamesRange) gamesRange.textContent = `${startGame}-${endGame}`;
    if (totalGamesDisplay)
      totalGamesDisplay.textContent = this.currentState.filteredGames.length;
  },

  // Show loading state
  showLoadingState() {
    const container = document.getElementById("games-container");
    if (container) {
      container.innerHTML = `
        <div class="loading-indicator">
          <div class="loading-spinner"></div>
          <p>Loading games...</p>
        </div>
      `;
    }
  },

  // Hide loading state
  hideLoadingState() {
    // Loading state is cleared when games are rendered
  },

  // Show no results
  showNoResults() {
    const container = document.getElementById("games-container");
    if (container) {
      container.innerHTML = `
        <div class="no-results">
          <div class="no-results__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <h3>No games found</h3>
          <p>Try adjusting your search terms or browse all games</p>
        </div>
      `;
    }
  },

  // Show error state
  showErrorState() {
    const container = document.getElementById("games-container");
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <div class="error-state__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Error loading games</h3>
          <p>Something went wrong while loading the game catalog</p>
          <button class="retry-button" onclick="catalogManagementSystem.loadGamesData()">
            Try Again
          </button>
        </div>
      `;
    }
  },
};

// Add notification styles
const addNotificationStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .add-to-cart-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-emerald);
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .add-to-cart-notification.show {
      transform: translateX(0);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .notification-content svg {
      width: 20px;
      height: 20px;
    }
  `;
  document.head.appendChild(style);
};

// Initialize notification styles
addNotificationStyles();
