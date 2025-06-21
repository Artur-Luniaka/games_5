// Trending Games Data Loader
const trendingGamesLoader = {
  // Initialize trending games loader
  initializeTrendingLoader() {
    this.loadTrendingGames();
    this.setupGameCardInteractions();
  },

  // Load trending games from JSON
  async loadTrendingGames() {
    try {
      const response = await fetch(
        "data/digital-entertainment-collection.json"
      );
      const data = await response.json();

      const trendingGames = this.selectTrendingGames(
        data.digitalEntertainmentCollection.entertainmentItems
      );
      this.renderTrendingGames(trendingGames);
    } catch (error) {
      console.error("Error loading trending games:", error);
      this.showErrorState();
    }
  },

  // Select trending games based on criteria
  selectTrendingGames(allGames) {
    // Sort by user score and critic score, then take top 6
    const sortedGames = allGames.sort((a, b) => {
      const aScore = (a.userScore + a.criticScore / 10) / 2;
      const bScore = (b.userScore + b.criticScore / 10) / 2;
      return bScore - aScore;
    });

    return sortedGames.slice(0, 6);
  },

  // Render trending games in the container
  renderTrendingGames(games) {
    const container = document.getElementById("trending-games-container");
    if (!container) return;

    const gamesHTML = games
      .map((game) => this.createGameCardHTML(game))
      .join("");
    container.innerHTML = gamesHTML;

    // Add animation delay to each card
    const gameCards = container.querySelectorAll(".trending-game-card");
    gameCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("fade-in");
    });
  },

  // Create HTML for a game card
  createGameCardHTML(game) {
    const discountBadge =
      game.discountPercentage > 0
        ? `<div class="trending-game-card__discount">-${game.discountPercentage}%</div>`
        : "";

    const priceDisplay =
      game.discountPercentage > 0
        ? `<span class="trending-game-card__price-original">$${game.originalPrice}</span>
               <span class="trending-game-card__price-current">$${game.price}</span>`
        : `<span class="trending-game-card__price-current">$${game.price}</span>`;

    const scoreColor = this.getScoreColor(game.userScore);
    const scoreClass = this.getScoreClass(game.userScore);

    return `
            <article class="trending-game-card" data-game-id="${
              game.uniqueIdentifier
            }">
                <div class="trending-game-card__visual">
                    <img src="${game.visualAssets.primaryImage}" alt="${
      game.title
    }" loading="lazy">
                    ${discountBadge}
                    <div class="trending-game-card__overlay">
                        <button class="trending-game-card__add-to-cart" onclick="trendingGamesLoader.addGameToCart('${
                          game.uniqueIdentifier
                        }')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
                
                <div class="trending-game-card__content">
                    <div class="trending-game-card__header">
                        <h3 class="trending-game-card__title">${game.title}</h3>
                        <div class="trending-game-card__score ${scoreClass}" style="color: ${scoreColor}">
                            ${game.userScore}
                        </div>
                    </div>
                    
                    <p class="trending-game-card__subtitle">${game.subtitle}</p>
                    
                    <div class="trending-game-card__meta">
                        <div class="trending-game-card__platforms">
                            ${game.platforms
                              .map(
                                (platform) =>
                                  `<span class="platform-badge platform-badge--${platform.toLowerCase()}">${platform}</span>`
                              )
                              .join("")}
                        </div>
                        
                        <div class="trending-game-card__rating">
                            <span class="rating-badge">${game.rating}</span>
                        </div>
                    </div>
                    
                    <div class="trending-game-card__pricing">
                        ${priceDisplay}
                    </div>
                    
                    <div class="trending-game-card__tags">
                        ${game.tags
                          .slice(0, 3)
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
            </article>
        `;
  },

  // Get score color based on rating
  getScoreColor(score) {
    if (score >= 9.0) return "#10b981"; // Emerald
    if (score >= 8.0) return "#f59e0b"; // Amber
    if (score >= 7.0) return "#f97316"; // Coral
    return "#64748b"; // Slate
  },

  // Get score class based on rating
  getScoreClass(score) {
    if (score >= 9.0) return "score-excellent";
    if (score >= 8.0) return "score-great";
    if (score >= 7.0) return "score-good";
    return "score-average";
  },

  // Add game to cart
  addGameToCart(gameId) {
    // Find game data
    fetch("data/digital-entertainment-collection.json")
      .then((response) => response.json())
      .then((data) => {
        const game =
          data.digitalEntertainmentCollection.entertainmentItems.find(
            (item) => item.uniqueIdentifier === gameId
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
      })
      .catch((error) => {
        console.error("Error adding game to cart:", error);
      });
  },

  // Setup game card interactions
  setupGameCardInteractions() {
    document.addEventListener("click", (event) => {
      const gameCard = event.target.closest(".trending-game-card");
      if (!gameCard) return;

      const addToCartButton = event.target.closest(
        ".trending-game-card__add-to-cart"
      );
      if (addToCartButton) {
        // Add to cart functionality is handled by onclick
        return;
      }

      // Navigate to game details page
      const gameId = gameCard.dataset.gameId;
      window.location.href = `game-details.html?id=${gameId}`;
    });

    // Add hover effects
    const gameCards = document.querySelectorAll(".trending-game-card");
    gameCards.forEach((card) => {
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
    const visual = card.querySelector(".trending-game-card__visual");
    const overlay = card.querySelector(".trending-game-card__overlay");
    const content = card.querySelector(".trending-game-card__content");

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

  // Show error state
  showErrorState() {
    const container = document.getElementById("trending-games-container");
    if (!container) return;

    container.innerHTML = `
            <div class="trending-error">
                <div class="trending-error__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                </div>
                <h3>Unable to Load Trending Games</h3>
                <p>We're experiencing some technical difficulties. Please try again later.</p>
                <button onclick="trendingGamesLoader.loadTrendingGames()" class="retry-button">
                    Try Again
                </button>
            </div>
        `;
  },
};

// Add custom styles for trending games
const addTrendingGameStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
        .trending-game-card {
            background: var(--background-white);
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-soft);
            transition: var(--transition-normal);
            cursor: pointer;
            position: relative;
        }

        .trending-game-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-large);
        }

        .trending-game-card__visual {
            position: relative;
            height: 200px;
            overflow: hidden;
        }

        .trending-game-card__visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: var(--transition-normal);
        }

        .trending-game-card__discount {
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--accent-coral);
            color: white;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            z-index: 2;
        }

        .trending-game-card__overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: var(--transition-normal);
        }

        .trending-game-card__add-to-cart {
            background: var(--primary-emerald);
            color: white;
            border: none;
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-lg);
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            transition: var(--transition-fast);
        }

        .trending-game-card__add-to-cart:hover {
            background: var(--primary-emerald-dark);
            transform: scale(1.05);
        }

        .trending-game-card__add-to-cart svg {
            width: 16px;
            height: 16px;
        }

        .trending-game-card__content {
            padding: var(--spacing-lg);
        }

        .trending-game-card__header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-sm);
        }

        .trending-game-card__title {
            font-family: var(--font-display);
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            flex: 1;
        }

        .trending-game-card__score {
            font-weight: 700;
            font-size: 1.125rem;
            padding: 4px 8px;
            border-radius: var(--radius-sm);
            background: rgba(16, 185, 129, 0.1);
            min-width: 40px;
            text-align: center;
        }

        .trending-game-card__subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: var(--spacing-md);
        }

        .trending-game-card__meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-md);
        }

        .trending-game-card__platforms {
            display: flex;
            gap: var(--spacing-xs);
        }

        .platform-badge {
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 500;
            background: var(--background-light);
            color: var(--text-secondary);
        }

        .platform-badge--pc {
            background: rgba(16, 185, 129, 0.1);
            color: var(--primary-emerald);
        }

        .platform-badge--xbox {
            background: rgba(249, 115, 22, 0.1);
            color: var(--accent-coral);
        }

        .rating-badge {
            background: var(--text-primary);
            color: white;
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
        }

        .trending-game-card__pricing {
            margin-bottom: var(--spacing-md);
        }

        .trending-game-card__price-original {
            color: var(--text-secondary);
            text-decoration: line-through;
            font-size: 0.875rem;
            margin-right: var(--spacing-xs);
        }

        .trending-game-card__price-current {
            color: var(--primary-emerald);
            font-weight: 600;
            font-size: 1.125rem;
        }

        .trending-game-card__tags {
            display: flex;
            gap: var(--spacing-xs);
            flex-wrap: wrap;
        }

        .tag {
            background: var(--background-light);
            color: var(--text-secondary);
            padding: 2px 6px;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 500;
        }

        .trending-error {
            text-align: center;
            padding: var(--spacing-xl);
            color: var(--text-secondary);
        }

        .trending-error__icon {
            width: 64px;
            height: 64px;
            margin: 0 auto var(--spacing-lg);
            color: var(--neutral-slate);
        }

        .trending-error__icon svg {
            width: 100%;
            height: 100%;
        }

        .retry-button {
            background: var(--primary-emerald);
            color: white;
            border: none;
            padding: var(--spacing-sm) var(--spacing-lg);
            border-radius: var(--radius-lg);
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition-fast);
            margin-top: var(--spacing-md);
        }

        .retry-button:hover {
            background: var(--primary-emerald-dark);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .trending-game-card__header {
                flex-direction: column;
                gap: var(--spacing-xs);
            }

            .trending-game-card__score {
                align-self: flex-end;
            }

            .trending-game-card__meta {
                flex-direction: column;
                align-items: flex-start;
                gap: var(--spacing-sm);
            }
        }
    `;
  document.head.appendChild(style);
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  trendingGamesLoader.initializeTrendingLoader();
  addTrendingGameStyles();
});

// Export for use in other scripts
window.trendingGamesLoader = trendingGamesLoader;
