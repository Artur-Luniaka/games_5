// Game Catalog Management System
const gameCatalogManager = {
  // Initialize catalog manager
  initializeCatalogManager() {
    this.loadGamesData();
    this.setupEventListeners();
    this.setupViewToggle();
    this.updateResultsCount();
  },

  // Current state
  currentState: {
    games: [],
    filteredGames: [],
    filters: {
      category: "all",
      platform: "all",
      priceRange: "all",
      searchQuery: "",
    },
    sortBy: "name",
    viewMode: "grid",
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

      this.renderGames();
      this.hideLoadingState();
      this.updateResultsCount();
    } catch (error) {
      console.error("Error loading games data:", error);
      this.showErrorState();
    }
  },

  // Setup event listeners
  setupEventListeners() {
    // Filter controls
    const categoryFilter = document.getElementById("category-filter");
    const platformFilter = document.getElementById("platform-filter");
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchInput = document.getElementById("search-input");
    const clearFiltersBtn = document.getElementById("clear-filters");

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.currentState.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    if (platformFilter) {
      platformFilter.addEventListener("change", (e) => {
        this.currentState.filters.platform = e.target.value;
        this.applyFilters();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener("change", (e) => {
        this.currentState.filters.priceRange = e.target.value;
        this.applyFilters();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener("change", (e) => {
        this.currentState.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentState.filters.searchQuery = e.target.value;
        this.applyFilters();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    // Handle URL parameters
    this.handleUrlParameters();
  },

  // Setup view toggle
  setupViewToggle() {
    const viewToggles = document.querySelectorAll(".view-toggle");
    const gamesContainer = document.getElementById("games-container");

    viewToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const viewMode = toggle.dataset.view;
        this.setViewMode(viewMode);

        // Update active state
        viewToggles.forEach((t) => t.classList.remove("active"));
        toggle.classList.add("active");
      });
    });
  },

  // Set view mode
  setViewMode(viewMode) {
    this.currentState.viewMode = viewMode;
    const gamesContainer = document.getElementById("games-container");

    if (gamesContainer) {
      gamesContainer.className = `games-container ${viewMode}-view`;
    }
  },

  // Apply filters and sorting
  applyFilters() {
    let filtered = [...this.currentState.games];

    // Apply category filter
    if (this.currentState.filters.category !== "all") {
      filtered = filtered.filter(
        (game) => game.category === this.currentState.filters.category
      );
    }

    // Apply platform filter
    if (this.currentState.filters.platform !== "all") {
      filtered = filtered.filter((game) =>
        game.platforms.includes(this.currentState.filters.platform)
      );
    }

    // Apply price range filter
    if (this.currentState.filters.priceRange !== "all") {
      const [min, max] = this.parsePriceRange(
        this.currentState.filters.priceRange
      );
      filtered = filtered.filter((game) => {
        const price = game.price;
        if (max === null) {
          return price >= min;
        }
        return price >= min && price <= max;
      });
    }

    // Apply search filter
    if (this.currentState.filters.searchQuery.trim() !== "") {
      const query = this.currentState.filters.searchQuery.toLowerCase();
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
    this.renderGames();
    this.updateResultsCount();
    this.updateActiveFilters();
  },

  // Parse price range
  parsePriceRange(range) {
    switch (range) {
      case "0-30":
        return [0, 30];
      case "30-50":
        return [30, 50];
      case "50-70":
        return [50, 70];
      case "70+":
        return [70, null];
      default:
        return [0, null];
    }
  },

  // Sort games
  sortGames(games, sortBy) {
    const sorted = [...games];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.userScore - a.userScore);
      case "release":
        return sorted.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
      default:
        return sorted;
    }
  },

  // Render games
  renderGames() {
    const container = document.getElementById("games-container");
    if (!container) return;

    if (this.currentState.filteredGames.length === 0) {
      this.showNoResults();
      return;
    }

    const gamesHTML = this.currentState.filteredGames
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

    const scoreColor = this.getScoreColor(game.userScore);

    return `
            <article class="game-card" data-game-id="${game.uniqueIdentifier}">
                <div class="game-card__visual">
                    <img src="${game.visualAssets.primaryImage}" alt="${
      game.title
    }" loading="lazy">
                    ${discountBadge}
                    <div class="game-card__overlay">
                        <button class="game-card__add-to-cart" onclick="gameCatalogManager.addGameToCart('${
                          game.uniqueIdentifier
                        }')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
                
                <div class="game-card__content">
                    <div class="game-card__header">
                        <h3 class="game-card__title">${game.title}</h3>
                        <div class="game-card__score" style="color: ${scoreColor}">
                            ${game.userScore}
                        </div>
                    </div>
                    
                    <p class="game-card__subtitle">${game.subtitle}</p>
                    
                    <div class="game-card__meta">
                        <div class="game-card__platforms">
                            ${game.platforms
                              .map(
                                (platform) =>
                                  `<span class="platform-badge platform-badge--${platform.toLowerCase()}">${platform}</span>`
                              )
                              .join("")}
                        </div>
                        
                        <div class="game-card__rating">
                            <span class="rating-badge">${game.rating}</span>
                        </div>
                    </div>
                    
                    <div class="game-card__pricing">
                        ${priceDisplay}
                    </div>
                    
                    <div class="game-card__tags">
                        ${game.tags
                          .slice(0, 3)
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
            </article>
        `;
  },

  // Get score color
  getScoreColor(score) {
    if (score >= 9.0) return "#10b981";
    if (score >= 8.0) return "#f59e0b";
    if (score >= 7.0) return "#f97316";
    return "#64748b";
  },

  // Setup game card interactions
  setupGameCardInteractions() {
    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        const addToCartButton = event.target.closest(".game-card__add-to-cart");
        if (addToCartButton) {
          return; // Let the onclick handle it
        }

        const gameId = card.dataset.gameId;
        window.location.href = `game-details.html?id=${gameId}`;
      });

      card.addEventListener("mouseenter", () => {
        this.animateGameCard(card, "enter");
      });

      card.addEventListener("mouseleave", () => {
        this.animateGameCard(card, "leave");
      });
    });
  },

  // Animate game card
  animateGameCard(card, action) {
    const visual = card.querySelector(".game-card__visual");
    const overlay = card.querySelector(".game-card__overlay");
    const content = card.querySelector(".game-card__content");

    if (action === "enter") {
      visual.style.transform = "scale(1.05)";
      overlay.style.opacity = "1";
      content.style.transform = "translateY(-5px)";
    } else {
      visual.style.transform = "scale(1)";
      overlay.style.opacity = "0";
      content.style.transform = "translateY(0)";
    }
  },

  // Add game to cart
  addGameToCart(gameId) {
    const game = this.currentState.games.find(
      (g) => g.uniqueIdentifier === gameId
    );

    if (game) {
      const gameData = {
        id: game.uniqueIdentifier,
        title: game.title,
        price: game.price,
        image: game.visualAssets.primaryImage,
      };

      cartManagementSystem.addItemToCart(gameData);
    }
  },

  // Clear all filters
  clearAllFilters() {
    this.currentState.filters = {
      category: "all",
      platform: "all",
      priceRange: "all",
      searchQuery: "",
    };
    this.currentState.sortBy = "name";

    // Reset form elements
    const categoryFilter = document.getElementById("category-filter");
    const platformFilter = document.getElementById("platform-filter");
    const priceFilter = document.getElementById("price-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchInput = document.getElementById("search-input");

    if (categoryFilter) categoryFilter.value = "all";
    if (platformFilter) platformFilter.value = "all";
    if (priceFilter) priceFilter.value = "all";
    if (sortFilter) sortFilter.value = "name";
    if (searchInput) searchInput.value = "";

    this.applyFilters();
  },

  // Filter by category (for collection cards)
  filterByCategory(category) {
    this.currentState.filters.category = category;

    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
      categoryFilter.value = category;
    }

    this.applyFilters();

    // Scroll to results
    const resultsSection = document.querySelector(".catalog-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  },

  // Update results count
  updateResultsCount() {
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      const count = this.currentState.filteredGames.length;
      const total = this.currentState.games.length;
      resultsCount.textContent = `${count} of ${total} games found`;
    }
  },

  // Update active filters display
  updateActiveFilters() {
    const activeFilters = document.getElementById("active-filters");
    if (!activeFilters) return;

    const activeFiltersList = [];

    if (this.currentState.filters.category !== "all") {
      activeFiltersList.push(`Category: ${this.currentState.filters.category}`);
    }
    if (this.currentState.filters.platform !== "all") {
      activeFiltersList.push(`Platform: ${this.currentState.filters.platform}`);
    }
    if (this.currentState.filters.priceRange !== "all") {
      activeFiltersList.push(`Price: ${this.currentState.filters.priceRange}`);
    }
    if (this.currentState.filters.searchQuery.trim() !== "") {
      activeFiltersList.push(
        `Search: "${this.currentState.filters.searchQuery}"`
      );
    }

    activeFilters.textContent =
      activeFiltersList.length > 0
        ? `Active filters: ${activeFiltersList.join(", ")}`
        : "";
  },

  // Handle URL parameters
  handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category && category !== "all") {
      this.currentState.filters.category = category;
      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        categoryFilter.value = category;
      }
      this.applyFilters();
    }
  },

  // Show loading state
  showLoadingState() {
    const loadingIndicator = document.getElementById("loading-indicator");
    const gamesContainer = document.getElementById("games-container");
    const noResults = document.getElementById("no-results");

    if (loadingIndicator) loadingIndicator.style.display = "block";
    if (gamesContainer) gamesContainer.style.display = "none";
    if (noResults) noResults.style.display = "none";
  },

  // Hide loading state
  hideLoadingState() {
    const loadingIndicator = document.getElementById("loading-indicator");
    const gamesContainer = document.getElementById("games-container");

    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (gamesContainer) gamesContainer.style.display = "grid";
  },

  // Show no results
  showNoResults() {
    const gamesContainer = document.getElementById("games-container");
    const noResults = document.getElementById("no-results");

    if (gamesContainer) gamesContainer.style.display = "none";
    if (noResults) noResults.style.display = "block";
  },

  // Show error state
  showErrorState() {
    const gamesContainer = document.getElementById("games-container");
    const loadingIndicator = document.getElementById("loading-indicator");

    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (gamesContainer) {
      gamesContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-state__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    </div>
                    <h3>Unable to Load Games</h3>
                    <p>We're experiencing some technical difficulties. Please try again later.</p>
                    <button onclick="gameCatalogManager.loadGamesData()" class="retry-button">
                        Try Again
                    </button>
                </div>
            `;
    }
  },
};

// Add error state styles
const addErrorStateStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
        .error-state {
            text-align: center;
            padding: var(--spacing-2xl);
            color: var(--text-secondary);
            grid-column: 1 / -1;
        }

        .error-state__icon {
            width: 64px;
            height: 64px;
            margin: 0 auto var(--spacing-lg);
            color: var(--neutral-slate);
        }

        .error-state__icon svg {
            width: 100%;
            height: 100%;
        }

        .error-state h3 {
            color: var(--text-primary);
            margin-bottom: var(--spacing-sm);
        }

        .error-state p {
            margin-bottom: var(--spacing-lg);
        }
    `;
  document.head.appendChild(style);
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  gameCatalogManager.initializeCatalogManager();
  addErrorStateStyles();
});

// Export for use in other scripts
window.gameCatalogManager = gameCatalogManager;
