document.addEventListener("DOMContentLoaded", async () => {
  const newReleasesShowcase = document.querySelector(".new-releases__showcase");
  if (!newReleasesShowcase) return;

  try {
    const response = await fetch("data/digital-entertainment-collection.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const allGames = data.digitalEntertainmentCollection.entertainmentItems;

    const sortedGames = allGames.sort(
      (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
    );

    const latestGames = sortedGames.slice(0, 3);

    if (latestGames.length > 0) {
      updateNewReleases(latestGames);
    }
  } catch (error) {
    console.error("Could not load new releases:", error);
    newReleasesShowcase.innerHTML =
      "<p>Could not load new releases at the moment. Please try again later.</p>";
  }

  function updateNewReleases(games) {
    const [mainGame, sideGame1, sideGame2] = games;

    const mainReleaseHTML = `
      <div class="main-release">
        <a href="game-details.html?id=${
          mainGame.uniqueIdentifier
        }" class="main-release release-card">
          <div class="main-release__visual">
            <img src="${mainGame.image}" alt="${mainGame.title}" />
            <div class="release-overlay">
              <div class="release-badge-wrapper">
                <div class="release-badge">Just Released</div>
              </div>
              <div class="release-content-wrapper">
                <div class="release-info">
                  <h3>${mainGame.title}</h3>
                  <p>${mainGame.subtitle}</p>
                  <div class="release-meta">
                    <span class="release-date">Released: ${new Date(
                      mainGame.releaseDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</span>
                    <span class="release-rating">⭐ ${
                      mainGame.userScore
                    }/10</span>
                  </div>
                </div>
                <div class="release-actions">
                  <span class="release-price">$${mainGame.price}</span>
                  <span class="release-btn">View Details</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;

    const sideReleasesHTML = `
      <div class="side-releases">
        <a href="game-details.html?id=${sideGame1.uniqueIdentifier}" class="side-release release-card">
            <img src="${sideGame1.image}" alt="${sideGame1.title}" />
            <div class="side-release__content">
              <h4>${sideGame1.title}</h4>
              <span class="side-price">$${sideGame1.price}</span>
            </div>
        </a>
        <a href="game-details.html?id=${sideGame2.uniqueIdentifier}" class="side-release release-card">
            <img src="${sideGame2.image}" alt="${sideGame2.title}" />
            <div class="side-release__content">
              <h4>${sideGame2.title}</h4>
              <span class="side-price">$${sideGame2.price}</span>
            </div>
        </a>
      </div>
    `;

    newReleasesShowcase.innerHTML = mainReleaseHTML + sideReleasesHTML;
  }
});
