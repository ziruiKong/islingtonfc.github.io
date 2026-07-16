const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const previews = Array.from(document.querySelectorAll(".hero-preview"));
const heroProgress = document.querySelector(".hero-progress");
const mainProductImage = document.querySelector(".product-main-image");
const galleryThumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
const printToggle = document.querySelector(".print-toggle");
const printFields = document.querySelector(".print-fields");
const qtyMinus = document.querySelector(".qty-minus");
const qtyPlus = document.querySelector(".qty-plus");
const qtyValue = document.querySelector(".qty-value");
const addCart = document.querySelector(".add-cart-btn");
const cartDrawer = document.querySelector(".cart-drawer");
const cartClose = document.querySelector(".cart-close");
const cartSize = document.querySelector(".cart-size");
const wishlist = document.querySelector(".wishlist-btn");
const productModal = document.querySelector(".product-modal");
const productOpeners = Array.from(document.querySelectorAll(".product-open, .shop-now-btn"));
const productModalClose = document.querySelector(".product-modal-close");
const productModalBackdrop = document.querySelector(".product-modal-backdrop");
const teamTabs = Array.from(document.querySelectorAll("[data-team-panel]"));
const teamPanels = Array.from(document.querySelectorAll("[data-team-panel-content]"));
const monthSelect = document.querySelector("[data-month-select]");
const competitionSelect = document.querySelector("[data-competition-select]");
const seasonSelect = document.querySelector("[data-season-select]");
const fixtureFilterSelects = Array.from(document.querySelectorAll(".fixture-filter select"));
const monthPanels = Array.from(document.querySelectorAll("[data-month-panel]"));
const rankingTabs = Array.from(document.querySelectorAll("[data-ranking-tab]"));
const rankingPanels = Array.from(document.querySelectorAll("[data-ranking-panel]"));
const rankingSort = document.querySelector("[data-ranking-sort]");
const compactStatsTable = document.querySelector("[data-compact-stats-table]");
const teamStatsPreview = document.querySelector("[data-team-stats-preview]");
const statisticsTable = document.querySelector("[data-statistics-table]");
const statisticsSummary = document.querySelector("[data-statistics-summary]");
const statisticsSeason = document.querySelector("[data-statistics-season]");
const statisticsCompetition = document.querySelector("[data-statistics-competition]");
const statisticsExport = document.querySelector("[data-statistics-export]");
const historyRankingPage = document.querySelector("[data-history-ranking-page]");
const historyRankingSeason = document.querySelector("[data-history-ranking-season]");
const historyRankingCompetition = document.querySelector("[data-history-ranking-competition]");
const playerTemplate = document.querySelector("[data-player-template]");
const matchTemplate = document.querySelector("[data-match-template]");
const lineupTemplate = document.querySelector("[data-lineup-template]");
const newsList = document.querySelector("[data-news-list]");
const newsTable = document.querySelector("[data-news-table]");
const newsForm = document.querySelector("[data-news-form]");
const newsCategory = document.querySelector("[data-news-category]");
const newsReset = document.querySelector("[data-news-reset]");
const newsExport = document.querySelector("[data-news-export]");
const newsImport = document.querySelector("[data-news-import]");
const homeNewsCarousel = document.querySelector("[data-home-news-carousel]");
const homeNewsSlides = Array.from(document.querySelectorAll("[data-home-news-slide]"));
const homeNewsProgress = document.querySelector("[data-home-news-progress]");
const homeNewsDots = Array.from(document.querySelectorAll("[data-home-news-dot]"));
const homeFeaturedResult = document.querySelector("[data-home-featured-result]");
const homeResultList = document.querySelector("[data-home-result-list]");
const historySearch = document.querySelector("[data-history-search]");
const historyFilter = document.querySelector("[data-history-filter]");
const historyCards = Array.from(document.querySelectorAll("[data-history-card]"));
const historyEmpty = document.querySelector("[data-history-empty]");
const historyCount = document.querySelector("[data-history-count]");
const matchDatabase = window.ISLINGTON_MATCH_DATA || { players: [], fixtures: [] };
const rankingFallbackMarkup = new Map(
  rankingPanels.map((panel) => [panel.dataset.rankingPanel || "", panel.querySelector(".ranking-table-body")?.innerHTML || ""])
);

let activeSlide = 0;
let activeHomeNewsSlide = 0;
let ticking = false;
let heroTimer;
let homeNewsTimer;
let statisticsSortKey = "number";
let statisticsSortDirection = "asc";

function updateHeaderState() {
  if (!siteHeader) return;
  const isScrolled = siteHeader.classList.contains("is-scrolled");

  if (!isScrolled && window.scrollY > 96) {
    siteHeader.classList.add("is-scrolled");
  }

  if (isScrolled && window.scrollY < 12) {
    siteHeader.classList.remove("is-scrolled");
  }
}

function requestHeaderUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateHeaderState();
    ticking = false;
  });
}

updateHeaderState();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

if (toggle && links) {
  toggle.addEventListener("click", () => {
    links.classList.toggle("is-open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
    });
  });
}

function showSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  previews.forEach((preview, previewIndex) => {
    preview.classList.toggle("is-active", previewIndex === activeSlide);
  });

  if (heroProgress) {
    heroProgress.classList.add("is-reset");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroProgress.classList.remove("is-reset");
      });
    });
  }
}

if (slides.length > 1) {
  heroTimer = window.setInterval(() => {
    showSlide(activeSlide + 1);
  }, 5000);
}

function restartHomeNewsProgress() {
  if (!homeNewsProgress) return;
  homeNewsProgress.classList.remove("is-running");
  void homeNewsProgress.offsetWidth;
  homeNewsProgress.classList.add("is-running");
}

function showHomeNewsSlide(index) {
  if (!homeNewsSlides.length) return;
  activeHomeNewsSlide = (index + homeNewsSlides.length) % homeNewsSlides.length;
  homeNewsSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeHomeNewsSlide);
  });
  homeNewsDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeHomeNewsSlide);
  });
  restartHomeNewsProgress();
}

function startHomeNewsCarousel() {
  if (homeNewsSlides.length <= 1) return;
  window.clearInterval(homeNewsTimer);
  homeNewsTimer = window.setInterval(() => {
    showHomeNewsSlide(activeHomeNewsSlide + 1);
  }, 6000);
  restartHomeNewsProgress();
}

startHomeNewsCarousel();

homeNewsCarousel?.addEventListener("mouseenter", () => {
  window.clearInterval(homeNewsTimer);
  homeNewsProgress?.classList.remove("is-running");
});

homeNewsCarousel?.addEventListener("mouseleave", startHomeNewsCarousel);

homeNewsDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHomeNewsSlide(Number(dot.dataset.homeNewsDot));
    startHomeNewsCarousel();
  });
});

galleryThumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    galleryThumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
    if (mainProductImage) {
      mainProductImage.src = thumb.dataset.image;
    }
  });
});

if (printToggle && printFields) {
  printToggle.addEventListener("change", () => {
    printFields.classList.toggle("is-open", printToggle.checked);
  });
}

function setQuantity(nextQuantity) {
  if (!qtyValue) return;
  const quantity = Math.max(1, Math.min(9, nextQuantity));
  qtyValue.textContent = String(quantity);
}

if (qtyMinus && qtyPlus && qtyValue) {
  qtyMinus.addEventListener("click", () => setQuantity(Number(qtyValue.textContent) - 1));
  qtyPlus.addEventListener("click", () => setQuantity(Number(qtyValue.textContent) + 1));
}

if (wishlist) {
  wishlist.addEventListener("click", () => {
    wishlist.classList.toggle("is-active");
    wishlist.innerHTML = wishlist.classList.contains("is-active") ? "&#9829;" : "&#9825;";
  });
}

if (addCart && cartDrawer) {
  addCart.addEventListener("click", () => {
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || "M";
    const quantity = qtyValue?.textContent || "1";
    if (cartSize) {
      cartSize.textContent = `Size ${selectedSize} &middot; Qty ${quantity}`;
    }
    productModal?.classList.remove("is-open");
    productModal?.setAttribute("aria-hidden", "true");
    cartDrawer.classList.add("is-open");
  });
}

if (cartClose && cartDrawer) {
  cartClose.addEventListener("click", () => {
    cartDrawer.classList.remove("is-open");
  });
}

function openProductModal() {
  if (!productModal) return;
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
}

productOpeners.forEach((opener) => {
  opener.addEventListener("click", openProductModal);
});

productModalClose?.addEventListener("click", closeProductModal);
productModalBackdrop?.addEventListener("click", closeProductModal);

teamTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.teamPanel;

    teamTabs.forEach((item) => {
      item.classList.toggle("is-active", item === tab);
    });

    teamPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.teamPanelContent === target);
    });
  });
});

function applyHistoryFilters() {
  if (!historyCards.length) return;
  const query = (historySearch?.value || "").trim().toLowerCase();
  const position = historyFilter?.value || "all";
  let visibleCount = 0;

  historyCards.forEach((card) => {
    const name = (card.dataset.playerName || "").toLowerCase();
    const cardPosition = card.dataset.playerPosition || "";
    const matchesQuery = !query || name.includes(query);
    const matchesPosition = position === "all" || cardPosition === position;
    const visible = matchesQuery && matchesPosition;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  if (historyCount) {
    historyCount.textContent = `${visibleCount} ${visibleCount === 1 ? "Player" : "Players"}`;
  }

  if (historyEmpty) {
    historyEmpty.hidden = visibleCount !== 0;
  }
}

historySearch?.addEventListener("input", applyHistoryFilters);
historyFilter?.addEventListener("change", applyHistoryFilters);
applyHistoryFilters();

function applyFixtureFilters() {
  if (!monthSelect || !monthPanels.length) return;
  const activeSeason = seasonSelect?.value || "2025-26";
  const activeMonth = monthSelect.value;
  const activeCompetition = competitionSelect?.value || "all";

  monthPanels.forEach((panel) => {
    const isActivePanel = panel.dataset.monthPanel === activeMonth;
    panel.classList.toggle("is-active", isActivePanel);

    const cards = Array.from(panel.querySelectorAll(".fixture-card"));
    const staticEmpty = panel.querySelector(".fixture-empty:not([data-filter-empty])");
    let visibleCardCount = 0;

    cards.forEach((card) => {
      const matchesSeason = !card.dataset.season || card.dataset.season === activeSeason;
      const matchesCompetition = activeCompetition === "all" || card.dataset.competition === activeCompetition;
      const visible = matchesSeason && matchesCompetition;
      card.hidden = !visible;
      if (visible) visibleCardCount += 1;
    });

    const existingFilterEmpty = panel.querySelector("[data-filter-empty]");
    existingFilterEmpty?.remove();

    if (staticEmpty && cards.length > 0) {
      staticEmpty.remove();
    }

    if (isActivePanel && cards.length && visibleCardCount === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "fixture-empty";
      emptyState.dataset.filterEmpty = "true";
      emptyState.textContent = "No fixtures match this filter.";
      panel.append(emptyState);
    }
  });
}

function isCupCompetition(value) {
  return value !== "premier-league";
}

function getStatsCompetitionBucket(value) {
  if (value === "premier-league") return "league";
  if (value === "champions-league") return "champions";
  return "cup";
}

function createEmptyPlayerStats(player) {
  return {
    player,
    goals: { league: 0, champions: 0, cup: 0, total: 0 },
    assists: { league: 0, champions: 0, cup: 0, total: 0 },
    appearances: 0,
    ratingTotal: 0,
    averageRating: null,
    contributionTotal: 0
  };
}

function getSeasonStartYear(season) {
  const match = String(season || "").match(/^(\d{4})/);
  return match ? Number(match[1]) : 0;
}

function sortSeasonsDescending(seasons) {
  return [...new Set(seasons)].sort((a, b) => getSeasonStartYear(b) - getSeasonStartYear(a));
}

function getPlayerSlugFromEntry(entry) {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  return entry.slug || "";
}

function fixtureIncludesPlayer(fixture, slug) {
  if (!fixture || !slug) return false;
  const starters = fixture.lineup?.starters || [];
  const substitutes = fixture.lineup?.substitutes || [];
  const ratings = fixture.lineup?.ratings || {};
  const scorers = fixture.scorers || [];

  return (
    starters.some((entry) => getPlayerSlugFromEntry(entry) === slug) ||
    substitutes.some((entry) => getPlayerSlugFromEntry(entry) === slug) ||
    Object.prototype.hasOwnProperty.call(ratings, slug) ||
    scorers.some((event) => event.slug === slug || event.assistSlug === slug)
  );
}

function resolvePlayerProfileSeason(slug) {
  const fixtureSeasons = sortSeasonsDescending(
    (matchDatabase.fixtures || [])
      .filter((fixture) => fixtureIncludesPlayer(fixture, slug))
      .map((fixture) => fixture.season)
  );
  if (fixtureSeasons.length) return fixtureSeasons[0];

  const historicalSeasons = sortSeasonsDescending(
    (matchDatabase.historicalStats || [])
      .filter((entry) => (entry.slug || slugify(entry.name)) === slug)
      .map((entry) => entry.season)
  );
  if (historicalSeasons.length) return historicalSeasons[0];

  return sortSeasonsDescending([
    ...(matchDatabase.fixtures || []).map((fixture) => fixture.season),
    ...(matchDatabase.historicalStats || []).map((entry) => entry.season)
  ])[0] || "2026-27";
}

function createPlayerProfileCompetitionStats() {
  return {
    matches: 0,
    starts: 0,
    goals: 0,
    assists: 0
  };
}

function buildPlayerProfileStatistics(slug, season) {
  const rows = {
    league: createPlayerProfileCompetitionStats(),
    champions: createPlayerProfileCompetitionStats(),
    cup: createPlayerProfileCompetitionStats(),
    total: createPlayerProfileCompetitionStats()
  };
  let hasFixtureStats = false;

  (matchDatabase.fixtures || [])
    .filter((fixture) => fixture.season === season)
    .forEach((fixture) => {
      const bucket = getStatsCompetitionBucket(fixture.competition);
      const starters = fixture.lineup?.starters || [];
      const substitutes = fixture.lineup?.substitutes || [];
      const ratings = fixture.lineup?.ratings || {};
      const appeared =
        starters.some((entry) => getPlayerSlugFromEntry(entry) === slug) ||
        substitutes.some((entry) => getPlayerSlugFromEntry(entry) === slug) ||
        Object.prototype.hasOwnProperty.call(ratings, slug);
      const started = starters.some((entry) => getPlayerSlugFromEntry(entry) === slug);

      if (appeared) {
        rows[bucket].matches += 1;
        rows.total.matches += 1;
        hasFixtureStats = true;
      }

      if (started) {
        rows[bucket].starts += 1;
        rows.total.starts += 1;
        hasFixtureStats = true;
      }

      (fixture.scorers || []).forEach((event) => {
        if (event.slug === slug) {
          rows[bucket].goals += 1;
          rows.total.goals += 1;
          hasFixtureStats = true;
        }
        if (event.assistSlug === slug) {
          rows[bucket].assists += 1;
          rows.total.assists += 1;
          hasFixtureStats = true;
        }
      });
    });

  if (!hasFixtureStats) {
    const historicalEntry = (matchDatabase.historicalStats || []).find(
      (entry) => (entry.slug || slugify(entry.name)) === slug && entry.season === season
    );
    if (historicalEntry) {
      ["league", "champions", "cup"].forEach((bucket) => {
        rows[bucket].goals = Number(historicalEntry.goals?.[bucket] || 0);
        rows[bucket].assists = Number(historicalEntry.assists?.[bucket] || 0);
      });
      rows.total.matches = Number(historicalEntry.appearances || 0);
      rows.total.goals = rows.league.goals + rows.champions.goals + rows.cup.goals;
      rows.total.assists = rows.league.assists + rows.champions.assists + rows.cup.assists;
      rows.total.starts = null;
      rows.league.matches = null;
      rows.champions.matches = null;
      rows.cup.matches = null;
      rows.league.starts = null;
      rows.champions.starts = null;
      rows.cup.starts = null;
    }
  }

  return rows;
}

function formatPlayerProfileStat(value) {
  if (value === null || value === undefined) return "—";
  return String(value);
}

function formatSeasonLabel(season) {
  if (!season) return "";
  return String(season).replace("-", "/");
}

function mergeHistoricalPlayerStats(statsByPlayer, season = "2026-27", competition = "all") {
  const historicalRows = matchDatabase.historicalStats || [];
  historicalRows.forEach((entry) => {
    const seasonMatch = season === "all" || entry.season === season;
    if (!seasonMatch) return;

    const slug = entry.slug || slugify(entry.name);
    if (!slug) return;
    const player = {
      slug,
      name: entry.name || slug,
      nationalityCode: entry.nationalityCode || "",
      number: entry.number || ""
    };
    if (!statsByPlayer.has(slug)) {
      statsByPlayer.set(slug, createEmptyPlayerStats(player));
    }

    const stats = statsByPlayer.get(slug);
    stats.player = { ...stats.player, ...player };

    ["league", "champions", "cup"].forEach((bucket) => {
      const competitionMatch =
        competition === "all" ||
        (competition === "premier-league" && bucket === "league") ||
        (competition === "champions-league" && bucket === "champions") ||
        (competition !== "premier-league" && competition !== "champions-league" && bucket === "cup");
      if (!competitionMatch) return;
      const goalValue = Number(entry.goals?.[bucket] || 0);
      const assistValue = Number(entry.assists?.[bucket] || 0);
      stats.goals[bucket] += goalValue;
      stats.goals.total += goalValue;
      stats.assists[bucket] += assistValue;
      stats.assists.total += assistValue;
    });

    if (competition === "all" && Number(entry.appearances || 0) > 0) {
      const apps = Number(entry.appearances || 0);
      stats.appearances += apps;
      if (typeof entry.averageRating === "number") {
        stats.ratingTotal += entry.averageRating * apps;
      }
    }
  });
}

function buildPlayerStatistics(players, fixtures, season = "2026-27", competition = "all") {
  const filteredFixtures = fixtures.filter((fixture) => {
    const seasonMatch = season === "all" || fixture.season === season;
    const competitionMatch = competition === "all" || fixture.competition === competition;
    return seasonMatch && competitionMatch;
  });
  const statsByPlayer = new Map(players.map((player) => [player.slug, createEmptyPlayerStats(player)]));

  filteredFixtures.forEach((fixture) => {
    const bucket = getStatsCompetitionBucket(fixture.competition);

    fixture.scorers?.forEach((event) => {
      if (event.slug && statsByPlayer.has(event.slug)) {
        const playerStats = statsByPlayer.get(event.slug);
        playerStats.goals[bucket] += 1;
        playerStats.goals.total += 1;
      }
      if (event.assistSlug && statsByPlayer.has(event.assistSlug)) {
        const playerStats = statsByPlayer.get(event.assistSlug);
        playerStats.assists[bucket] += 1;
        playerStats.assists.total += 1;
      }
    });

    Object.entries(fixture.lineup?.ratings || {}).forEach(([slug, rating]) => {
      if (!statsByPlayer.has(slug) || typeof rating.value !== "number") return;
      const playerStats = statsByPlayer.get(slug);
      playerStats.appearances += 1;
      playerStats.ratingTotal += rating.value;
    });
  });

  mergeHistoricalPlayerStats(statsByPlayer, season, competition);

  statsByPlayer.forEach((stats) => {
    stats.contributionTotal = stats.goals.total + stats.assists.total;
    stats.averageRating = stats.appearances ? Number((stats.ratingTotal / stats.appearances).toFixed(2)) : null;
  });

  return Array.from(statsByPlayer.values());
}

function getFixtureScoreText(fixture) {
  return `${fixture.score.home} - ${fixture.score.away}`;
}

const fixtureTeamShortNames = {
  ISL: "Islington",
  LEI: "Leicester",
  BOU: "Bournemouth",
  SHU: "Sheffield Utd",
  BHA: "Brighton",
  OM: "Marseille",
  TOT: "Spurs",
  MUN: "Man Utd",
  MCI: "Man City",
  NEW: "Newcastle",
  NFO: "Nott'm Forest",
  CRY: "Crystal Palace",
  WHU: "West Ham",
  AVL: "Aston Villa",
  LEE: "Leeds",
  WOL: "Wolves",
  BRE: "Brentford",
  ARS: "Arsenal",
  CHE: "Chelsea",
  LIV: "Liverpool",
  SUN: "Sunderland",
};

const fixtureTeamNameShortNames = {
  "Islington FC": "Islington",
  "Leicester City": "Leicester",
  "AFC Bournemouth": "Bournemouth",
  "Sheffield United": "Sheffield Utd",
  "Brighton & Hove Albion": "Brighton",
  "Brighton &amp; Hove Albion": "Brighton",
  "Olympique de Marseille": "Marseille",
  "Tottenham Hotspur": "Spurs",
  "Manchester United": "Man Utd",
  "Manchester City": "Man City",
  "Newcastle United": "Newcastle",
  "Nottingham Forest": "Nott'm Forest",
  "Crystal Palace": "Crystal Palace",
  "West Ham United": "West Ham",
  "Aston Villa": "Aston Villa",
  "Leeds United": "Leeds",
  "Wolverhampton Wanderers": "Wolves",
  Wolves: "Wolves",
  Brentford: "Brentford",
  Arsenal: "Arsenal",
  Chelsea: "Chelsea",
  Liverpool: "Liverpool",
  Sunderland: "Sunderland",
};

function getFixtureTeamDisplayName(teamOrName) {
  if (!teamOrName) return "";
  if (typeof teamOrName === "string") {
    return fixtureTeamShortNames[teamOrName] || fixtureTeamNameShortNames[teamOrName] || teamOrName;
  }
  return fixtureTeamShortNames[teamOrName.code] || fixtureTeamNameShortNames[teamOrName.name] || teamOrName.name || teamOrName.code || "";
}

function buildFixtureQueryParams(fixture) {
  return new URLSearchParams({
    date: fixture.displayDate || "",
    competition: fixture.competitionLabel || "",
    home: fixture.home?.code || "",
    away: fixture.away?.code || "",
    score: getFixtureScoreText(fixture),
    stadium: fixture.stadium || "",
    homeLogo: fixture.home?.logo || "",
    awayLogo: fixture.away?.logo || "",
  });
}

function buildFixturePageHref(page, fixture) {
  return `${page}?${buildFixtureQueryParams(fixture).toString()}`;
}

function getCompletedFixtures() {
  return [...(matchDatabase.fixtures || [])]
    .filter((fixture) => fixture.date && fixture.score && Number.isFinite(Number(fixture.score.home)) && Number.isFinite(Number(fixture.score.away)))
    .sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`));
}

function getFixtureResultLetter(fixture) {
  const result = getIslingtonResultClass(fixture);
  if (result === "is-win") return "W";
  if (result === "is-loss") return "L";
  return "D";
}

function renderHomeRecentResults() {
  if (!homeFeaturedResult || !homeResultList) return;
  const recentFixtures = getCompletedFixtures().slice(0, 5);
  const [featured, ...compactFixtures] = recentFixtures;
  if (!featured) return;

  const featuredHref = buildFixturePageHref("match-detail.html", featured);
  homeFeaturedResult.dataset.competition = featured.competition || "";
  homeFeaturedResult.innerHTML = `
    <p>${escapeHtml(featured.competitionLabel || "")}</p>
    <time datetime="${escapeHtml(featured.date)}">${escapeHtml(featured.displayDate || "")}</time>
    <div class="home-matchup">
      <div>
        <img src="${escapeHtml(featured.home.logo)}" alt="" />
        <strong>${escapeHtml(featured.home.code)}</strong>
      </div>
      <span class="home-result-score">${escapeHtml(getFixtureScoreText(featured))}</span>
      <div>
        <img src="${escapeHtml(featured.away.logo)}" alt="" />
        <strong>${escapeHtml(featured.away.code)}</strong>
      </div>
    </div>
    <small>${escapeHtml(featured.stadium || "")}</small>
    <a href="${escapeHtml(featuredHref)}">Match Centre <span aria-hidden="true">&#8594;</span></a>
  `;

  homeResultList.innerHTML = compactFixtures
    .map((fixture) => {
      const href = buildFixturePageHref("match-detail.html", fixture);
      return `
        <a href="${escapeHtml(href)}" data-competition="${escapeHtml(fixture.competition || "")}">
          <time datetime="${escapeHtml(fixture.date)}">${escapeHtml(fixture.displayDate || "")} <em>${escapeHtml(getFixtureResultLetter(fixture))}</em></time>
          <strong class="home-fixture-scorebar">
            <span class="home-fixture-team">
              <img src="${escapeHtml(fixture.home.logo)}" alt="" />
              <i>${escapeHtml(fixture.home.code)}</i>
            </span>
            <b>${escapeHtml(String(fixture.score?.home ?? "-"))}</b>
            <span class="home-fixture-dash">-</span>
            <b>${escapeHtml(String(fixture.score?.away ?? "-"))}</b>
            <span class="home-fixture-team">
              <i>${escapeHtml(fixture.away.code)}</i>
              <img src="${escapeHtml(fixture.away.logo)}" alt="" />
            </span>
          </strong>
        </a>
      `;
    })
    .join("");
}

function findFixtureFromParams(params) {
  const date = params.get("date") || "";
  const home = params.get("home") || "";
  const away = params.get("away") || "";
  const score = params.get("score") || "";
  return matchDatabase.fixtures.find(
    (fixture) =>
      fixture.displayDate === date &&
      fixture.home.code === home &&
      fixture.away.code === away &&
      getFixtureScoreText(fixture) === score
  );
}

function getIslingtonResultClass(fixture) {
  const isHome = fixture.home.code === "ISL";
  const islingtonGoals = isHome ? fixture.score.home : fixture.score.away;
  const opponentGoals = isHome ? fixture.score.away : fixture.score.home;
  if (islingtonGoals > opponentGoals) return "is-win";
  if (islingtonGoals < opponentGoals) return "is-loss";
  return "is-draw";
}

function createFixtureCard(fixture) {
  const article = document.createElement("article");
  article.className = "fixture-card";
  article.dataset.competition = fixture.competition;
  article.dataset.season = fixture.season;
  article.dataset.homeCode = fixture.home?.code || "";
  article.dataset.awayCode = fixture.away?.code || "";
  article.innerHTML = `
    <div class="fixture-card-top">
      <time datetime="${escapeHtml(fixture.date)}">${escapeHtml(fixture.displayDate)}</time>
      <div class="fixture-card-meta">
        <span>${escapeHtml(fixture.competitionLabel)}</span>
      </div>
    </div>
    <div class="fixture-card-match">
      <div class="fixture-club">
        <img src="${escapeHtml(fixture.home.logo)}" alt="" />
        <strong>${escapeHtml(getFixtureTeamDisplayName(fixture.home))}</strong>
      </div>
      <div class="fixture-score-box ${getIslingtonResultClass(fixture)}">${escapeHtml(getFixtureScoreText(fixture))}</div>
      <div class="fixture-club">
        <img src="${escapeHtml(fixture.away.logo)}" alt="" />
        <strong>${escapeHtml(getFixtureTeamDisplayName(fixture.away))}</strong>
      </div>
    </div>
    <p class="fixture-stadium">${escapeHtml(fixture.stadium)}</p>
  `;
  return article;
}

function renderDatabaseFixtures() {
  if (!monthPanels.length || !Array.isArray(matchDatabase.fixtures) || !matchDatabase.fixtures.length) return;
  monthPanels.forEach((panel) => {
    panel.querySelectorAll('.fixture-card[data-season="2026-27"]').forEach((card) => card.remove());
    const panelMonth = panel.dataset.monthPanel;
    const fixtures = matchDatabase.fixtures
      .filter((fixture) => fixture.month === panelMonth)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (!fixtures.length) return;
    fixtures.forEach((fixture) => {
      panel.append(createFixtureCard(fixture));
    });
  });
}

function getLatestFixtureForMatchesPage() {
  return [...(matchDatabase.fixtures || [])]
    .filter((fixture) => fixture.date && fixture.month && fixture.season)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
}

function setFixtureSelectValue(select, value) {
  if (!select || !value || !Array.from(select.options).some((option) => option.value === value || option.textContent === value)) return;
  select.value = value;

  const filter = select.closest(".fixture-filter");
  const triggerLabel = filter?.querySelector(".fixture-filter-label");
  const selectedOption = Array.from(select.options).find((option) => option.value === value || option.textContent === value);

  if (triggerLabel && selectedOption) {
    triggerLabel.textContent = selectedOption.textContent || value;
  }

  filter?.querySelectorAll("[data-filter-value]").forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.filterValue === select.value);
  });
}

function setDefaultFixtureFiltersToLatestMonth() {
  if (!monthSelect) return;
  const latestFixture = getLatestFixtureForMatchesPage();
  if (!latestFixture) return;

  setFixtureSelectValue(seasonSelect, latestFixture.season);
  setFixtureSelectValue(monthSelect, latestFixture.month);
  setFixtureSelectValue(competitionSelect, "all");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function addFixtureDetailLinks() {
  document.querySelectorAll(".fixture-card").forEach((card) => {
    if (card.querySelector(".fixture-detail-link")) return;
    const time = card.querySelector("time");
    const clubs = Array.from(card.querySelectorAll(".fixture-club"));
    const score = card.querySelector(".fixture-score-box");
    const stadium = card.querySelector(".fixture-stadium");
    const competition = card.querySelector(".fixture-card-meta span")?.textContent || "";
    const home = card.dataset.homeCode || clubs[0]?.querySelector("strong")?.textContent || "";
    const away = card.dataset.awayCode || clubs[1]?.querySelector("strong")?.textContent || "";
    const homeLogo = clubs[0]?.querySelector("img")?.getAttribute("src") || "";
    const awayLogo = clubs[1]?.querySelector("img")?.getAttribute("src") || "";
    const params = new URLSearchParams({
      date: time?.textContent || "",
      competition,
      home,
      away,
      score: score?.childNodes[0]?.textContent?.trim() || score?.textContent?.trim() || "",
      stadium: stadium?.textContent || "",
      homeLogo,
      awayLogo,
    });
    const link = document.createElement("a");
    link.className = "fixture-detail-link";
    link.href = `match-detail.html?${params.toString()}`;
    link.textContent = "View details";
    card.append(link);
  });
}

seasonSelect?.addEventListener("change", applyFixtureFilters);
monthSelect?.addEventListener("change", applyFixtureFilters);
competitionSelect?.addEventListener("change", applyFixtureFilters);
renderDatabaseFixtures();
renderHomeRecentResults();
setDefaultFixtureFiltersToLatestMonth();
applyFixtureFilters();
addFixtureDetailLinks();

fixtureFilterSelects.forEach((select) => {
  const filter = select.closest(".fixture-filter");
  const trigger = filter?.querySelector(".fixture-filter-trigger");
  const triggerLabel = trigger?.querySelector(".fixture-filter-label");
  const items = Array.from(filter?.querySelectorAll("[data-filter-value]") || []);
  const updateSelectedItem = () => {
    items.forEach((item) => {
      item.classList.toggle("is-selected", item.dataset.filterValue === select.value);
    });
  };

  updateSelectedItem();

  trigger?.addEventListener("click", () => {
    document.querySelectorAll(".fixture-filter.is-open").forEach((item) => {
      if (item !== filter) item.classList.remove("is-open");
    });
    filter?.classList.toggle("is-open");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      select.value = item.dataset.filterValue || "";
      if (triggerLabel) triggerLabel.textContent = item.textContent || "";
      updateSelectedItem();
      filter?.classList.remove("is-open");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest(".fixture-filter")) return;
  document.querySelectorAll(".fixture-filter.is-open").forEach((filter) => {
    filter.classList.remove("is-open");
  });
});

function cloneRankingRows() {
  const sourceRows = Array.from(document.querySelectorAll('[data-ranking-panel="goals"] .ranking-row'));
  rankingPanels
    .filter((panel) => panel.dataset.rankingPanel !== "goals")
    .forEach((panel) => {
      const body = panel.querySelector(".ranking-table-body");
      if (!body || body.children.length) return;
      body.innerHTML = sourceRows.map((row) => row.outerHTML).join("");
    });
}

function buildSeasonRanking(players, fixtures, season, competition) {
  return buildPlayerStatistics(players, fixtures, season, competition).map((stats) => ({
    ...stats,
    goals: { league: stats.goals.league, cup: stats.goals.champions + stats.goals.cup, total: stats.goals.total },
    assists: { league: stats.assists.league, cup: stats.assists.champions + stats.assists.cup, total: stats.assists.total },
    minutes: { league: 0, cup: 0, total: 0 }
  }));
}

function getStatRowsForDisplay(season = "2026-27", competition = "all") {
  return buildPlayerStatistics(matchDatabase.players || [], matchDatabase.fixtures || [], season, competition)
    .filter((stats) => stats.contributionTotal > 0 || stats.averageRating !== null)
    .sort((a, b) => {
      if (b.contributionTotal !== a.contributionTotal) return b.contributionTotal - a.contributionTotal;
      return Number(b.averageRating || 0) - Number(a.averageRating || 0);
    });
}

function renderCompactStatsTable() {
  if (!compactStatsTable) return;
  const season = seasonSelect?.value || "2026-27";
  const competition = competitionSelect?.value || "all";
  const rows = getStatRowsForDisplay(season, competition).filter((stats) => stats.contributionTotal > 0).slice(0, 12);
  compactStatsTable.innerHTML = rows.length
    ? rows.map((stats, index) => `
      <div class="compact-stat-row" data-player="${escapeHtml(stats.player.slug)}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(stats.player.name)}</strong>
        <i>${stats.goals.total}</i>
        <i>${stats.assists.total}</i>
        <b>${stats.averageRating ? stats.averageRating.toFixed(2) : "-"}</b>
      </div>
    `).join("")
    : `<p class="stats-empty">No player data yet.</p>`;
}

compactStatsTable?.addEventListener("click", (event) => {
  const row = event.target instanceof Element ? event.target.closest(".compact-stat-row") : null;
  if (!row?.dataset.player) return;
  window.location.href = `${encodeURIComponent(row.dataset.player)}.html`;
});

function renderTeamStatsPreview() {
  if (!teamStatsPreview) return;
  const rows = getStatRowsForDisplay("2026-27", "all");
  const fixtures = (matchDatabase.fixtures || []).filter((fixture) => fixture.season === "2026-27");
  const goals = rows.reduce((sum, row) => sum + row.goals.total, 0);
  const assists = rows.reduce((sum, row) => sum + row.assists.total, 0);
  const avgRatingRows = rows.filter((row) => row.averageRating !== null);
  const average = avgRatingRows.length
    ? (avgRatingRows.reduce((sum, row) => sum + row.averageRating, 0) / avgRatingRows.length).toFixed(2)
    : "-";
  teamStatsPreview.innerHTML = `
    <article><strong>${fixtures.length}</strong><span>Matches</span></article>
    <article><strong>${goals}</strong><span>Goals</span></article>
    <article><strong>${assists}</strong><span>Assists</span></article>
    <article><strong>${average}</strong><span>Avg Rating</span></article>
  `;
}

function getStatisticsMatchCount(season, competition) {
  const fixtureCount = (matchDatabase.fixtures || []).filter((fixture) => {
    return fixture.season === season && (competition === "all" || fixture.competition === competition);
  }).length;

  if (fixtureCount) return fixtureCount;

  const historicalTotal = (matchDatabase.historicalSeasonTotals || []).find((item) => {
    return item.season === season && item.competition === competition;
  });

  if (historicalTotal) return historicalTotal.matches;

  if (competition !== "all") {
    const allCompetitionTotal = (matchDatabase.historicalSeasonTotals || []).find((item) => {
      return item.season === season && item.competition === "all";
    });
    return allCompetitionTotal?.matches || 0;
  }

  return 0;
}

function renderStatisticsPage() {
  if (!statisticsTable) return;
  const season = statisticsSeason?.value || "2026-27";
  const competition = statisticsCompetition?.value || "all";
  const rows = getStatRowsForDisplay(season, competition);
  const matchCount = getStatisticsMatchCount(season, competition);

  if (statisticsSummary) {
    const totalGoals = rows.reduce((sum, row) => sum + row.goals.total, 0);
    const totalAssists = rows.reduce((sum, row) => sum + row.assists.total, 0);
    const ratedRows = rows.filter((row) => row.averageRating !== null);
    const avg = ratedRows.length ? (ratedRows.reduce((sum, row) => sum + row.averageRating, 0) / ratedRows.length).toFixed(2) : "-";
    statisticsSummary.innerHTML = `
      <article><span>Matches</span><strong>${matchCount}</strong></article>
      <article><span>Goals</span><strong>${totalGoals}</strong></article>
      <article><span>Assists</span><strong>${totalAssists}</strong></article>
      <article><span>Avg Rating</span><strong>${avg}</strong></article>
    `;
  }

  const sortedRows = getSortedStatisticsRows(rows);

  document.querySelectorAll("[data-stat-sort]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.statSort === statisticsSortKey);
    button.dataset.direction = button.dataset.statSort === statisticsSortKey ? statisticsSortDirection : "";
  });

  statisticsTable.innerHTML = sortedRows.length
    ? sortedRows.map((stats) => `
      <tr>
        <td>${escapeHtml(stats.player.number)}</td>
        <td><a href="${escapeHtml(stats.player.slug)}.html">${escapeHtml(stats.player.name)}</a></td>
        <td>${stats.goals.league}</td>
        <td>${stats.goals.champions}</td>
        <td>${stats.goals.cup}</td>
        <td>${stats.goals.total}</td>
        <td>${stats.assists.league}</td>
        <td>${stats.assists.champions}</td>
        <td>${stats.assists.cup}</td>
        <td>${stats.assists.total}</td>
        <td>${stats.contributionTotal}</td>
        <td>${stats.averageRating ? stats.averageRating.toFixed(2) : "-"}</td>
        <td>${stats.appearances}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="13">No player data available.</td></tr>`;
}

function getStatisticsSortValue(stats, key) {
  if (key === "name") return stats.player.name;
  if (key === "number") return Number(stats.player.number) || 999;
  return key.split(".").reduce((value, part) => value?.[part], stats);
}

function getSortedStatisticsRows(rows) {
  return [...rows].sort((a, b) => {
    const aValue = getStatisticsSortValue(a, statisticsSortKey);
    const bValue = getStatisticsSortValue(b, statisticsSortKey);
    if (statisticsSortKey === "name") {
      return statisticsSortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
    return statisticsSortDirection === "asc"
      ? Number(aValue || 0) - Number(bValue || 0)
      : Number(bValue || 0) - Number(aValue || 0);
  });
}

function exportStatisticsTable() {
  const season = statisticsSeason?.value || "2026-27";
  const competition = statisticsCompetition?.value || "all";
  const rows = getSortedStatisticsRows(getStatRowsForDisplay(season, competition));
  const headers = [
    "No.",
    "Player",
    "PL G",
    "UCL G",
    "Cup G",
    "Total G",
    "PL A",
    "UCL A",
    "Cup A",
    "Total A",
    "Total G+A",
    "Avg Rating",
    "Rated Apps"
  ];
  const csvRows = [
    headers,
    ...rows.map((stats) => [
      stats.player.number,
      stats.player.name,
      stats.goals.league,
      stats.goals.champions,
      stats.goals.cup,
      stats.goals.total,
      stats.assists.league,
      stats.assists.champions,
      stats.assists.cup,
      stats.assists.total,
      stats.contributionTotal,
      stats.averageRating ? stats.averageRating.toFixed(2) : "",
      stats.appearances
    ])
  ];
  const csv = csvRows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const filenameCompetition = competition === "all" ? "all-competitions" : competition;
  link.href = URL.createObjectURL(blob);
  link.download = `islington-statistics-${season}-${filenameCompetition}.csv`;
  document.body.append(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function getHistoricalRankingRows(metric, season = "all", competition = "all") {
  return buildPlayerStatistics(matchDatabase.players || [], matchDatabase.fixtures || [], season, competition)
    .filter((stats) => {
      if (metric === "goals") return stats.goals.total > 0;
      if (metric === "assists") return stats.assists.total > 0;
      if (metric === "appearances") return stats.appearances > 0;
      return false;
    })
    .sort((a, b) => {
      const aValue = metric === "appearances" ? a.appearances : a[metric].total;
      const bValue = metric === "appearances" ? b.appearances : b[metric].total;
      if (bValue !== aValue) return bValue - aValue;
      if (Number(b.averageRating || 0) !== Number(a.averageRating || 0)) {
        return Number(b.averageRating || 0) - Number(a.averageRating || 0);
      }
      return Number(a.player.number || 999) - Number(b.player.number || 999);
    });
}

function renderHistoricalRankingPanel(panel, metric, rows) {
  const titleMap = {
    goals: "All-Time Goals",
    assists: "All-Time Assists",
    appearances: "All-Time Appearances"
  };
  const labelMap = {
    goals: "Goals",
    assists: "Assists",
    appearances: "Apps"
  };
  const leader = rows[0];
  const getValue = (stats) => metric === "appearances" ? stats.appearances : stats[metric].total;

  panel.innerHTML = `
    <div class="history-ranking-leader">
      <span>${escapeHtml(titleMap[metric])}</span>
      ${leader ? `
        <strong>${escapeHtml(leader.player.name)}</strong>
        <b>${escapeHtml(getValue(leader))}</b>
      ` : `
        <strong>No data</strong>
        <b>-</b>
      `}
    </div>
    <div class="history-ranking-list">
      ${rows.length ? rows.slice(0, 12).map((stats, index) => `
        <a class="history-ranking-row" href="${escapeHtml(stats.player.slug)}.html">
          <i>${index + 1}</i>
          <strong>${escapeHtml(stats.player.name)}</strong>
          <span>${escapeHtml(stats.player.nationalityCode || "")}</span>
          <b>${escapeHtml(getValue(stats))}</b>
          <small>${escapeHtml(labelMap[metric])}</small>
        </a>
      `).join("") : `<p class="history-ranking-empty">No ranking data available.</p>`}
    </div>
  `;
}

function renderHistoricalRankings() {
  if (!historyRankingPage) return;
  const season = historyRankingSeason?.value || "all";
  const competition = historyRankingCompetition?.value || "all";
  const panels = historyRankingPage.querySelectorAll("[data-history-ranking-panel]");
  panels.forEach((panel) => {
    const metric = panel.dataset.historyRankingPanel;
    if (!metric) return;
    renderHistoricalRankingPanel(panel, metric, getHistoricalRankingRows(metric, season, competition));
  });
}

function renderRankingTablesFromDatabase() {
  if (!rankingPanels.length) return;
  const activeSeason = seasonSelect?.value || "2025-26";
  const activeCompetition = competitionSelect?.value || "all";
  const hasSeasonFixtures = matchDatabase.fixtures.some((fixture) => fixture.season === activeSeason);

  if (!matchDatabase.players.length || !hasSeasonFixtures) {
    rankingPanels.forEach((panel) => {
      const body = panel.querySelector(".ranking-table-body");
      if (!body) return;
      body.innerHTML = rankingFallbackMarkup.get(panel.dataset.rankingPanel || "") || "";
    });
    sortRankingRows();
    return;
  }

  const seasonRanking = buildSeasonRanking(matchDatabase.players, matchDatabase.fixtures, activeSeason, activeCompetition);

  rankingPanels.forEach((panel) => {
    const body = panel.querySelector(".ranking-table-body");
    const statLabel = panel.dataset.rankingPanel;
    if (!body || !statLabel) return;
    body.innerHTML = seasonRanking
      .filter(({ [statLabel]: stat }) => Number(stat?.total || 0) > 0)
      .sort((a, b) => Number(b[statLabel]?.total || 0) - Number(a[statLabel]?.total || 0))
      .map(({ player, [statLabel]: stat }) => {
        const totalValue = stat.total;
        return `<div class="ranking-row" data-number="${escapeHtml(player.number)}" data-name="${escapeHtml(player.name)}" data-player="${escapeHtml(player.slug)}" data-value="${escapeHtml(totalValue)}"><span></span><strong>${escapeHtml(player.name)} <em>${escapeHtml(player.nationalityCode)}</em></strong><i>${escapeHtml(stat.league)}</i><i>${escapeHtml(stat.cup)}</i><b>${escapeHtml(totalValue)}</b></div>`;
      })
      .join("");
  });

  sortRankingRows("value");
}

function sortRankingRows(forceMode) {
  const sortMode = forceMode || rankingSort?.value || "value";
  rankingPanels.forEach((panel) => {
    const body = panel.querySelector(".ranking-table-body");
    if (!body) return;
    const rows = Array.from(body.querySelectorAll(".ranking-row"));
    rows
      .sort((a, b) => {
        if (sortMode === "name") return (a.dataset.name || "").localeCompare(b.dataset.name || "");
        if (sortMode === "value") return Number(b.dataset.value || 0) - Number(a.dataset.value || 0);
        return Number(a.dataset.number || 0) - Number(b.dataset.number || 0);
      })
      .forEach((row, index) => {
        const rank = row.querySelector("span");
        if (rank) rank.textContent = String(index + 1);
        body.append(row);
      });
  });
}

rankingTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.rankingTab;
    rankingTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    rankingPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.rankingPanel === target);
    });
  });
});

rankingPanels.forEach((panel) => {
  panel.addEventListener("click", (event) => {
    const row = event.target instanceof Element ? event.target.closest(".ranking-row") : null;
    if (!row) return;
    const player = row.dataset.player || slugify(row.dataset.name);
    window.location.href = `${encodeURIComponent(player)}.html`;
  });
});

cloneRankingRows();
renderRankingTablesFromDatabase();
renderCompactStatsTable();
renderTeamStatsPreview();
renderStatisticsPage();
rankingSort?.addEventListener("change", () => sortRankingRows());
seasonSelect?.addEventListener("change", () => {
  renderRankingTablesFromDatabase();
  renderCompactStatsTable();
});
competitionSelect?.addEventListener("change", () => {
  renderRankingTablesFromDatabase();
  renderCompactStatsTable();
});
statisticsSeason?.addEventListener("change", renderStatisticsPage);
statisticsCompetition?.addEventListener("change", renderStatisticsPage);
statisticsExport?.addEventListener("click", exportStatisticsTable);
historyRankingSeason?.addEventListener("change", renderHistoricalRankings);
historyRankingCompetition?.addEventListener("change", renderHistoricalRankings);
document.querySelectorAll("[data-stat-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextSort = button.dataset.statSort;
    if (!nextSort) return;
    if (statisticsSortKey === nextSort) {
      statisticsSortDirection = statisticsSortDirection === "desc" ? "asc" : "desc";
    } else {
      statisticsSortKey = nextSort;
      statisticsSortDirection = nextSort === "name" || nextSort === "number" ? "asc" : "desc";
    }
    renderStatisticsPage();
  });
});
renderHistoricalRankings();

const playerRecords = {
  "luis-malagon": { first: "Luis", last: "Malagon", number: 1, position: "Goalkeeper", nationality: "Mexico", age: 29, image: "assets/luis-malagon.png" },
  "berke-ozer": { first: "Berke", last: "Ozer", number: 1, position: "Goalkeeper", nationality: "Turkey", age: "—", image: "assets/berke-ozer.png" },
  "guglielmo-vicario": { first: "Guglielmo", last: "Vicario", number: 31, position: "Goalkeeper", nationality: "Italy", age: 29, image: "assets/guglielmo-vicario.png" },
  "marcos-senesi": { first: "Marcos", last: "Senesi", number: 2, position: "Defender", nationality: "Argentina", age: 29, image: "assets/marcos-senesi.png" },
  "micky-van-de-ven": { first: "Micky", last: "Van de Ven", number: 2, position: "Defender", nationality: "Netherlands", age: 24, image: "assets/micky-van-de-ven.png" },
  "alex-valle": { first: "Alex", last: "Valle", number: 15, position: "Defender", nationality: "Spain", age: "—", image: "assets/alex-valle.png" },
  "riccardo-calafiori": { first: "Riccardo", last: "Calafiori", number: 33, position: "Defender", nationality: "Italy", age: "—", image: "assets/riccardo-calafiori.png" },
  "ben-white": { first: "Ben", last: "White", number: 3, position: "Defender", nationality: "England", age: 28, image: "assets/ben-white.png" },
  "tino-livramento": { first: "Tino", last: "Livramento", number: 4, position: "Defender", nationality: "England", age: 23, image: "assets/tino-livramento.png" },
  "david-affengruber": { first: "David", last: "Affengruber", number: 5, position: "Defender", nationality: "Austria", age: 25, image: "assets/david-affengruber.png" },
  "dara-oshea": { first: "Dara", last: "O'Shea", number: 6, position: "Defender", nationality: "Ireland", age: 27, image: "assets/dara-oshea.png" },
  costinha: { first: "", last: "Costinha", number: 26, position: "Defender", nationality: "Portugal", age: 25, image: "assets/costinha.png" },
  "jacob-greaves": { first: "Jacob", last: "Greaves", number: 13, position: "Defender", nationality: "England", age: 25, image: "assets/jacob-greaves.png" },
  "leif-davis": { first: "Leif", last: "Davis", number: 15, position: "Defender", nationality: "England", age: 26, image: "assets/leif-davis.png" },
  "cesar-montes": { first: "Cesar", last: "Montes", number: 18, position: "Defender", nationality: "Mexico", age: 29, image: "assets/islington-logo.png" },
  "alex-baena": { first: "Alex", last: "Baena", number: 8, position: "Midfielder", nationality: "Spain", age: 25, image: "assets/alex-baena.png" },
  "nico-paz": { first: "Nico", last: "Paz", number: 10, position: "Midfielder", nationality: "Argentina", age: 21, image: "assets/nico-paz.png" },
  "marcel-ruiz": { first: "Marcel", last: "Ruiz", number: 6, position: "Midfielder", nationality: "Mexico", age: 25, image: "assets/marcel-ruiz.png" },
  "lucas-bergvall": { first: "Lucas", last: "Bergvall", number: 17, position: "Midfielder", nationality: "Sweden", age: 20, image: "assets/lucas-bergvall.png" },
  "jacopo-fazzini": { first: "Jacopo", last: "Fazzini", number: 22, position: "Midfielder", nationality: "Italy", age: "-", image: "assets/jacopo-fazzini.png" },
  "diego-lainez": { first: "Diego", last: "Lainez", number: 19, position: "Forward", nationality: "Mexico", age: 26, image: "assets/diego-lainez.png" },
  "gilberto-mora": { first: "Gilberto", last: "Mora", number: "—", position: "Midfielder", nationality: "Mexico", age: 17, image: "assets/gilberto-mora.png", loan: true },
  "maximo-perrone": { first: "Maximo", last: "Perrone", number: 23, position: "Midfielder", nationality: "Argentina", age: 23, image: "assets/maximo-perrone.png" },
  "omar-marmoush": { first: "Omar", last: "Marmoush", number: 7, position: "Forward", nationality: "Egypt", age: "—", image: "assets/omar-marmoush.png" },
  "jack-clarke": { first: "Jack", last: "Clarke", number: 7, position: "Forward", nationality: "England", age: 25, image: "assets/jack-clarke.png" },
  "toni-fruk": { first: "Toni", last: "Fruk", number: 9, position: "Forward", nationality: "Croatia", age: 25, image: "assets/toni-fruk.png" },
  "harry-wilson": { first: "Harry", last: "Wilson", number: 11, position: "Forward", nationality: "Wales", age: 29, image: "assets/harry-wilson.png" },
  "jesus-rodriguez": { first: "Jesus", last: "Rodriguez", number: 11, position: "Forward", nationality: "Spain", age: "—", image: "assets/jesus-rodriguez.png" },
  "mika-biereth": { first: "Mika", last: "Biereth", number: 14, position: "Forward", nationality: "Denmark", age: 23, image: "assets/mika-biereth.png" },
  "antonio-cordero": { first: "Antonio", last: "Cordero", number: 24, position: "Forward", nationality: "Spain", age: 19, image: "assets/antonio-cordero.jpeg" },
};

function renderPlayerTemplate() {
  if (!playerTemplate) return;
  const params = new URLSearchParams(window.location.search);
  const pageSlug = slugify(window.location.pathname.split("/").pop()?.replace(".html", ""));
  const defaultPlayer = playerTemplate.dataset.defaultPlayer || pageSlug || "harry-wilson";
  const activeSlug = params.get("player") || defaultPlayer;
  const record = playerRecords[activeSlug] || playerRecords["harry-wilson"];
  const setText = (selector, value) => {
    const element = playerTemplate.querySelector(selector);
    if (element) element.textContent = value;
  };
  const hero = playerTemplate.querySelector("[data-player-hero]");
  if (hero) hero.dataset.number = record.number;
  const fullName = [record.first, record.last].filter(Boolean).join(" ");
  document.title = `${fullName} | Islington FC`;
  const heading = playerTemplate.querySelector("[data-player-heading]");
  if (heading) {
    heading.innerHTML = `${record.first ? `<span>${escapeHtml(record.first)}</span>` : ""}<strong>${escapeHtml(record.last)}</strong><small>${escapeHtml(record.position)}</small>`;
    heading.setAttribute("aria-label", `${record.number} ${fullName} ${record.position}`.trim());
  }
  const image = playerTemplate.querySelector("[data-player-image]");
  if (image) {
    image.src = record.image;
    image.alt = fullName;
  }
  const activeSeason = resolvePlayerProfileSeason(activeSlug);
  const playerSeasonStats = buildPlayerProfileStatistics(activeSlug, activeSeason);
  const statRows = Array.from(playerTemplate.querySelectorAll(".stats-table .stats-row:not(.stats-head)"));
  const seasonHeading = playerTemplate.querySelector(".stats-row.stats-head span");
  if (seasonHeading) {
    seasonHeading.textContent = formatSeasonLabel(activeSeason);
  }
  const statRowConfig = [
    ["Premier League", playerSeasonStats.league],
    ["UEFA Champions League", playerSeasonStats.champions],
    ["Domestic Cups", playerSeasonStats.cup],
    ["All Competitions", playerSeasonStats.total]
  ];
  statRows.forEach((row, index) => {
    const config = statRowConfig[index];
    if (!config) return;
    const [label, stats] = config;
    const cells = row.querySelectorAll("span, strong");
    if (cells[0]) cells[0].textContent = label;
    if (cells[1]) cells[1].textContent = formatPlayerProfileStat(stats.matches);
    if (cells[2]) cells[2].textContent = formatPlayerProfileStat(stats.starts);
    if (cells[3]) cells[3].textContent = formatPlayerProfileStat(stats.goals);
    if (cells[4]) cells[4].textContent = formatPlayerProfileStat(stats.assists);
  });
  setText("[data-player-matches]", formatPlayerProfileStat(playerSeasonStats.total.matches));
  setText("[data-player-started]", formatPlayerProfileStat(playerSeasonStats.total.starts));
  setText("[data-player-goals]", formatPlayerProfileStat(playerSeasonStats.total.goals));
  setText("[data-player-assists]", formatPlayerProfileStat(playerSeasonStats.total.assists));
  setText("[data-player-nationality]", record.nationality);
  setText("[data-player-position]", record.position);
  setText("[data-player-number]", record.number);
  setText("[data-player-age]", record.age);
  setText("[data-player-bio]", record.loan
    ? `${fullName} is part of Islington FC's ${formatSeasonLabel(activeSeason)} midfield group and is currently out on loan. This unified player card uses the same profile style as Harry Wilson's page, with statistics, biography and latest content presented consistently for every player.`
    : `${fullName} is part of Islington FC's ${formatSeasonLabel(activeSeason)} squad. This unified player card uses the same profile style as Harry Wilson's page, with statistics, biography and latest content presented consistently for every player.`);
}

function renderMatchTemplate() {
  if (!matchTemplate) return;
  const params = new URLSearchParams(window.location.search);
  const get = (key, fallback = "") => params.get(key) || fallback;
  const home = getFixtureTeamDisplayName(get("home", "TOT"));
  const away = getFixtureTeamDisplayName(get("away", "ISL"));
  const score = get("score", "0 - 0");
  const title = `${home} ${score} ${away}`;
  const matchKey = [get("date"), get("home", "TOT"), get("away", "ISL"), score].join("|");
  const setText = (selector, value) => {
    const element = matchTemplate.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setHtml = (selector, value) => {
    const element = matchTemplate.querySelector(selector);
    if (element) element.innerHTML = value;
  };
  const setLink = (selector, href, label) => {
    const element = matchTemplate.querySelector(selector);
    if (!element) return;
    if (href) {
      element.href = href;
      if (label) element.innerHTML = label;
      element.hidden = false;
    } else {
      element.hidden = true;
    }
  };
  document.title = `${title} | Islington FC`;
  setText("[data-match-competition]", get("competition", "Premier League"));
  setText("[data-match-date]", get("date", "Sat 16 Aug 2025"));
  setText("[data-match-home]", home);
  setText("[data-match-away]", away);
  setText("[data-match-score]", score);
  setText("[data-match-stadium]", get("stadium", "Tottenham Hotspur Stadium"));
  const homeLogo = matchTemplate.querySelector("[data-match-home-logo]");
  const awayLogo = matchTemplate.querySelector("[data-match-away-logo]");
  if (homeLogo) homeLogo.src = get("homeLogo", "assets/club-tottenham.webp");
  if (awayLogo) awayLogo.src = get("awayLogo", "assets/islington-logo.png");
  setHtml("[data-match-summary]", `<strong>${escapeHtml(home)}</strong><span>${escapeHtml(score)}</span><strong>${escapeHtml(away)}</strong>`);
  setLink("[data-match-report-link]", "", "");
  setLink("[data-match-report-link-inline]", "", "");
  setLink("[data-match-lineup-link]", "", "");
  const databaseFixture = findFixtureFromParams(params);
  if (databaseFixture?.detail) {
    const homeScorers = (databaseFixture.scorers || []).filter((event) => event.side === "home");
    const awayScorers = (databaseFixture.scorers || []).filter((event) => event.side === "away");
    const renderScorerList = (items) =>
      items
        .map(
          (event) => `
            <div class="match-scorers-item">
              <span class="match-scorers-minute">${escapeHtml(event.minute)}</span>
              <div class="match-scorers-player">
                <span>${escapeHtml(event.player)}</span>
                ${event.assist ? `<span class="match-scorer-assist">${escapeHtml(event.assist)}</span>` : ""}
              </div>
            </div>`
        )
        .join("");
    setHtml(
      "[data-match-scorers]",
      `
      <div class="match-scorers-board">
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="${escapeHtml(databaseFixture.home.logo)}" alt="" />
            <strong>${escapeHtml(getFixtureTeamDisplayName(databaseFixture.home))}</strong>
          </div>
          <div class="match-scorers-list">${renderScorerList(homeScorers)}</div>
        </div>
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="${escapeHtml(databaseFixture.away.logo)}" alt="" />
            <strong>${escapeHtml(getFixtureTeamDisplayName(databaseFixture.away))}</strong>
          </div>
          <div class="match-scorers-list">${renderScorerList(awayScorers)}</div>
        </div>
      </div>`
    );
    setHtml("[data-match-report]", databaseFixture.detail.reportHtml);
    setHtml(
      "[data-match-stats]",
      (databaseFixture.detail.stats || [])
        .map(([label, a, b]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(getFixtureTeamDisplayName(a))}</strong><strong>${escapeHtml(getFixtureTeamDisplayName(b))}</strong></article>`)
        .join("")
    );
    if (databaseFixture.detail.reportUrl) {
      setLink(
        "[data-match-report-link]",
        databaseFixture.detail.reportUrl,
        `Read match report <span aria-hidden="true">&#8594;</span>`
      );
      setLink(
        "[data-match-report-link-inline]",
        databaseFixture.detail.reportUrl,
        `Open full report in News <span aria-hidden="true">&#8594;</span>`
      );
    }
    if (databaseFixture.lineup) {
      setLink(
        "[data-match-lineup-link]",
        buildFixturePageHref("match-lineups.html", databaseFixture),
        `View lineups <span aria-hidden="true">&#8594;</span>`
      );
    }
    return;
  }
  if (matchKey === "Sat 15 Aug 2026|LEI|ISL|1 - 2") {
    setHtml(
      "[data-match-scorers]",
      `
      <div class="match-scorers-board">
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="assets/club-leicester-city.png" alt="" />
            <strong>Leicester</strong>
          </div>
          <div class="match-scorers-list">
            <div class="match-scorers-item">
              <span class="match-scorers-minute">65'</span>
              <div class="match-scorers-player">
                <span>Joseph</span>
              </div>
            </div>
          </div>
        </div>
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="assets/islington-logo.png" alt="" />
            <strong>Islington</strong>
          </div>
          <div class="match-scorers-list">
            <div class="match-scorers-item">
              <span class="match-scorers-minute">51'</span>
              <div class="match-scorers-player">
                <span>Marcel Ruiz</span>
                <span class="match-scorer-assist">Nico Paz</span>
              </div>
            </div>
            <div class="match-scorers-item">
              <span class="match-scorers-minute">82'</span>
              <div class="match-scorers-player">
                <span>Maximo Perrone</span>
                <span class="match-scorer-assist">Toni Fruk</span>
              </div>
            </div>
          </div>
        </div>
      </div>`
    );
    setHtml(
      "[data-match-report]",
      `Islington FC began the 2026-27 Premier League season with a hard-fought 2-1 victory away at Leicester.<br /><br />
      After a balanced opening period, the visitors broke the deadlock in the 51st minute through <strong>Marcel Ruiz</strong>. The move started with substitute summer signing <strong>Omar Marmoush</strong>, who drove into the penalty area before finding Nico Paz. Paz's low delivery located Mika Biereth inside the box, whose initial effort was saved by the goalkeeper, but Ruiz reacted quickest to convert the rebound and hand Islington the lead.<br /><br />
      Leicester responded midway through the second half and restored parity in the 65th minute through <strong>Joseph</strong>, setting up a tense finale.<br /><br />
      Conner Welsh turned to his bench, introducing <strong>Toni Fruk</strong> and <strong>Maximo Perrone</strong>, a decision that ultimately proved decisive.<br /><br />
      With the match entering its closing stages, Perrone carried the ball forward from midfield before exchanging passes with Fruk around the edge of the area. Fruk returned the ball into the box and Perrone calmly finished the move to restore Islington's advantage and secure all three points.`
    );
    setHtml(
      "[data-match-stats]",
      [
        ["Result", "Leicester", "Islington"],
        ["Goals", "1", "2"],
        ["Assists", "0", "2"],
        ["Player of the Match", "—", "Maximo Perrone"],
      ].map(([label, a, b]) => `<article><span>${label}</span><strong>${a}</strong><strong>${b}</strong></article>`).join("")
    );
    setLink(
      "[data-match-report-link]",
      "leicester-city-1-2-islington-match-report.html",
      `Read match report <span aria-hidden="true">&#8594;</span>`
    );
    setLink(
      "[data-match-report-link-inline]",
      "leicester-city-1-2-islington-match-report.html",
      `Open full report in News <span aria-hidden="true">&#8594;</span>`
    );
    return;
  }
  if (matchKey === "Sat 23 Aug 2026|ISL|BOU|4 - 1") {
    setHtml(
      "[data-match-scorers]",
      `
      <div class="match-scorers-board">
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="assets/islington-logo.png" alt="" />
            <strong>Islington</strong>
          </div>
          <div class="match-scorers-list">
            <div class="match-scorers-item">
              <span class="match-scorers-minute">14'</span>
              <div class="match-scorers-player">
                <span>Omar Marmoush</span>
                <span class="match-scorer-assist">Mika Biereth</span>
              </div>
            </div>
            <div class="match-scorers-item">
              <span class="match-scorers-minute">26'</span>
              <div class="match-scorers-player">
                <span>Alex Baena</span>
                <span class="match-scorer-assist">Marcel Ruiz</span>
              </div>
            </div>
            <div class="match-scorers-item">
              <span class="match-scorers-minute">76'</span>
              <div class="match-scorers-player">
                <span>Mika Biereth</span>
                <span class="match-scorer-assist">Tino Livramento</span>
              </div>
            </div>
            <div class="match-scorers-item">
              <span class="match-scorers-minute">81'</span>
              <div class="match-scorers-player">
                <span>Omar Marmoush</span>
                <span class="match-scorer-assist">Alex Baena</span>
              </div>
            </div>
          </div>
        </div>
        <div class="match-scorers-team">
          <div class="match-scorers-team-header">
            <img src="assets/club-bournemouth.webp" alt="" />
            <strong>Bournemouth</strong>
          </div>
          <div class="match-scorers-list">
            <div class="match-scorers-item">
              <span class="match-scorers-minute">63'</span>
              <div class="match-scorers-player">
                <span>Faivre</span>
              </div>
            </div>
          </div>
        </div>
      </div>`
    );
    setHtml(
      "[data-match-report]",
      `Islington FC delivered a commanding home performance at Nag's Head Stadium on 23 August 2026, sweeping aside Bournemouth 4-1 in a dominant display that underlined their attacking structure, positional fluidity and early-season momentum.<br /><br />
      The hosts began aggressively, immediately pinning Bournemouth into a low defensive block through sustained possession and aggressive half-space occupation.<br /><br />
      In the 14th minute, <strong>Omar Marmoush</strong> opened the scoring after a sharp right-sided combination involving <strong>Mika Biereth</strong>. Biereth dropped between the lines to receive under pressure and instantly bounced the ball into Marmoush's run, with the Egyptian finishing low across goal from inside the box.<br /><br />
      Islington doubled the lead in the 26th minute when <strong>Marcel Ruiz</strong> threaded a disguised vertical pass between Bournemouth's midfield and defensive lines into the path of <strong>Alex Baena</strong>, who timed his run perfectly before slotting into the far corner.<br /><br />
      Bournemouth pulled one back through <strong>Faivre</strong> in the 63rd minute after a transitional moment, but Islington quickly restored control.<br /><br />
      A structured set-piece variation made it 3-1 in the 76th minute as <strong>Alex Baena</strong> found <strong>Tino Livramento</strong> short from a corner, Livramento slipped a disguised pass into the area, and <strong>Mika Biereth</strong> reacted first between the centre-backs to finish from close range.<br /><br />
      The fourth goal was the standout attacking move of the match. Baena switched play to Livramento, Livramento combined with <strong>Toni Fruk</strong> down the flank, and Fruk's cut-back was recycled by Baena under pressure before <strong>Omar Marmoush</strong> arrived in stride to drive a first-time finish into the bottom corner in the 81st minute.<br /><br />
      Marmoush was deservedly named Player of the Match after scoring twice and repeatedly destabilising Bournemouth's defensive structure with his movement and finishing.`
    );
    setHtml(
      "[data-match-stats]",
      [
        ["Result", "Islington", "Bournemouth"],
        ["Goals", "4", "1"],
        ["Assists", "4", "0"],
        ["Player of the Match", "Omar Marmoush", "—"],
      ].map(([label, a, b]) => `<article><span>${label}</span><strong>${a}</strong><strong>${b}</strong></article>`).join("")
    );
    setLink(
      "[data-match-report-link]",
      "islington-4-1-bournemouth-match-report.html",
      `Read match report <span aria-hidden="true">&#8594;</span>`
    );
    setLink(
      "[data-match-report-link-inline]",
      "islington-4-1-bournemouth-match-report.html",
      `Open full report in News <span aria-hidden="true">&#8594;</span>`
    );
    return;
  }
  const scorerText = score === "0 - 0" ? "No goalscorers" : "Goalscorer details to be confirmed";
  setHtml("[data-match-scorers]", `<article><span>${escapeHtml(home)}</span><strong>${scorerText}</strong></article><article><span>${escapeHtml(away)}</span><strong>${scorerText}</strong></article>`);
  setText("[data-match-report]", `${title} at ${get("stadium", "Tottenham Hotspur Stadium")} is recorded in the club match centre. This page uses a shared fixture template for the scoreline, goalscorers, report and core match statistics.`);
  setHtml("[data-match-stats]", [
    ["Possession", "50%", "50%"],
    ["Shots", "8", "8"],
    ["On target", "3", "3"],
    ["Pass accuracy", "82%", "82%"],
  ].map(([label, a, b]) => `<article><span>${label}</span><strong>${a}</strong><strong>${b}</strong></article>`).join(""));
}

function getPlayerRecord(slug) {
  const databasePlayer = matchDatabase.players.find((player) => player.slug === slug);
  const record = playerRecords[slug] || {};
  const first = record.first ?? "";
  const last = record.last ?? databasePlayer?.name ?? slug.replaceAll("-", " ");
  return {
    slug,
    first,
    last,
    fullName: [first, last].filter(Boolean).join(" ") || databasePlayer?.name || slug,
    image: record.image || "assets/islington-logo.png",
    number: record.number ?? databasePlayer?.number ?? "",
    position: record.position || "",
  };
}

function getRatingClass(value) {
  const score = Number(value);
  if (score >= 10) return "is-perfect";
  if (score >= 9) return "is-elite";
  if (score >= 8) return "is-excellent";
  if (score >= 7) return "is-good";
  if (score >= 6) return "is-ok";
  return "is-low";
}

function getLineupPlayerEvents(fixture, slug) {
  const events = { goals: 0, assists: 0, yellows: 0 };
  fixture.scorers?.forEach((event) => {
    if (event.slug === slug) events.goals += 1;
    if (event.assistSlug === slug) events.assists += 1;
  });
  fixture.yellowCards?.forEach((event) => {
    if (event.slug === slug) events.yellows += 1;
  });
  return events;
}

function renderLineupMeta(fixture, slug, player) {
  const rating = fixture.lineup?.ratings?.[slug];
  const events = getLineupPlayerEvents(fixture, slug);
  const eventIcons = [
    events.goals ? `<span class="lineup-event-icon" title="${escapeHtml(events.goals)} goal${events.goals > 1 ? "s" : ""}">⚽${events.goals > 1 ? escapeHtml(events.goals) : ""}</span>` : "",
    events.assists ? `<span class="lineup-event-icon" title="${escapeHtml(events.assists)} assist${events.assists > 1 ? "s" : ""}">🅰${events.assists > 1 ? escapeHtml(events.assists) : ""}</span>` : "",
  ].join("");
  return `
    <div class="lineup-player-meta" title="${rating?.note ? escapeHtml(rating.note) : ""}">
      <span class="lineup-shirt-number">${escapeHtml(player.number)}</span>
      <strong>${escapeHtml(player.last)}</strong>
      ${rating?.captain ? `<span class="lineup-captain-mark" title="Captain">C</span>` : ""}
      ${eventIcons}
      ${rating?.substituted ? `<span class="lineup-sub-icon" title="Substitution">↻</span>` : ""}
      ${rating?.minute ? `<span class="lineup-sub-minute">${escapeHtml(rating.minute)}</span>` : ""}
      ${rating ? `<b class="lineup-rating ${getRatingClass(rating.value)}">${escapeHtml(rating.display || rating.value)}</b>` : ""}
    </div>
  `;
}

function renderLineupBadges(fixture, slug) {
  return "";
}

function renderLineupMeta(fixture, slug, player) {
  const rating = fixture.lineup?.ratings?.[slug];
  const events = getLineupPlayerEvents(fixture, slug);
  const eventIcons = [
    events.goals ? `<span class="lineup-event-icon" title="${escapeHtml(events.goals)} goal${events.goals > 1 ? "s" : ""}">${Array.from({ length: events.goals }, () => "&#9917;").join("")}</span>` : "",
    events.assists ? `<span class="lineup-event-icon lineup-assist-icon" title="${escapeHtml(events.assists)} assist${events.assists > 1 ? "s" : ""}">${Array.from({ length: events.assists }, () => `<img src="assets/assist-boot-white.png" alt="" />`).join("")}</span>` : "",
  ].join("");
  const yellowCards = events.yellows
    ? `<span class="lineup-inline-yellow-card" title="${escapeHtml(events.yellows)} yellow card${events.yellows > 1 ? "s" : ""}">${Array.from({ length: events.yellows }, () => "<i></i>").join("")}</span>`
    : "";
  return `
    <div class="lineup-player-meta" title="${rating?.note ? escapeHtml(rating.note) : ""}">
      <span class="lineup-shirt-number">${escapeHtml(player.number)}</span>
      <strong>${escapeHtml(player.last)}</strong>
      ${rating?.captain ? `<span class="lineup-captain-mark" title="Captain">C</span>` : ""}
      ${yellowCards}
      ${eventIcons}
    </div>
  `;
}

function renderLineupStatus(fixture, slug, role = "starter") {
  const rating = fixture.lineup?.ratings?.[slug];
  if (!rating) return "";
  const isSubstitute = role === "substitute";
  return `
    <div class="lineup-player-status${isSubstitute ? " is-substitute" : ""}" title="${rating.note ? escapeHtml(rating.note) : ""}">
      ${rating.playerOfMatch ? `<span class="lineup-status-star" title="Player of the Match">&#9733;</span>` : ""}
      ${rating ? `<b class="lineup-status-rating lineup-rating ${getRatingClass(rating.value)}">${escapeHtml(rating.display || rating.value)}</b>` : ""}
      ${rating.injured ? `<span class="lineup-injury-icon" title="Injured">&#10010;</span>` : ""}
      ${rating.substituted ? `
        <span class="lineup-sub-state ${isSubstitute ? "is-on" : "is-off"}" title="${isSubstitute ? "Subbed on" : "Subbed off"}">
          <img class="lineup-status-sub" src="assets/${isSubstitute ? "sub-on.png" : "sub-off.png"}" alt="" />
          ${rating.minute ? `<span class="lineup-status-minute">${escapeHtml(rating.minute)}</span>` : ""}
        </span>
      ` : ""}
    </div>
  `;
}

function getCompactFixtureTeamName(team) {
  return getFixtureTeamDisplayName(team);
}

function getLatestLineupFixture() {
  return [...(matchDatabase.fixtures || [])]
    .filter((fixture) => fixture.lineup)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
}

function renderLineupTemplate() {
  if (!lineupTemplate) return;
  const params = new URLSearchParams(window.location.search);
  const fixture = findFixtureFromParams(params) || getLatestLineupFixture();
  if (!fixture?.lineup) return;

  const setText = (selector, value) => {
    const element = lineupTemplate.querySelector(selector);
    if (element) element.textContent = value;
  };

  const positionMap = {
    gk: { top: 87, left: 50 },
    rb: { top: 68, left: 84 },
    rcb: { top: 70, left: 61 },
    lcb: { top: 70, left: 39 },
    lb: { top: 68, left: 16 },
    rdm: { top: 51, left: 62 },
    ldm: { top: 51, left: 38 },
    cam: { top: 34, left: 50 },
    rw: { top: 32, left: 82 },
    cf: { top: 15, left: 50 },
    st: { top: 15, left: 50 },
    lw: { top: 32, left: 18 },
    rcm: { top: 49, left: 66 },
    cm: { top: 49, left: 50 },
    lcm: { top: 49, left: 34 },
  };

  const startersHost = lineupTemplate.querySelector("[data-lineup-starters]");
  const subsHost = lineupTemplate.querySelector("[data-lineup-subs]");
  const relatedHost = lineupTemplate.querySelector("[data-lineup-related]");
  const relatedPrev = lineupTemplate.querySelector("[data-lineup-related-prev]");
  const relatedNext = lineupTemplate.querySelector("[data-lineup-related-next]");
  const scoreText = `${getFixtureTeamDisplayName(fixture.home)} ${getFixtureScoreText(fixture)} ${getFixtureTeamDisplayName(fixture.away)}`;

  document.title = `${scoreText} Lineups | Islington FC`;
  setText("[data-lineup-team]", fixture.lineup.team || "Islington FC");
  setText("[data-lineup-competition]", fixture.competitionLabel || "Premier League");
  setText("[data-lineup-date]", fixture.displayDate || "");
  setText("[data-lineup-formation]", `Formation ${fixture.lineup.formation || "4-3-3"}`);
  setText("[data-lineup-coach]", fixture.lineup.coach || "Conner Welsh");

  if (startersHost) {
    startersHost.innerHTML = (fixture.lineup.starters || [])
      .map((starter) => {
        const player = getPlayerRecord(starter.slug);
        const position = positionMap[starter.zone] || { top: 50, left: 50 };
        return `
          <article class="lineup-player" style="--player-top:${escapeHtml(position.top)}%; --player-left:${escapeHtml(position.left)}%;">
            ${renderLineupBadges(fixture, starter.slug)}
            <div class="lineup-player-photo">
              <img src="${escapeHtml(player.image)}" alt="${escapeHtml(player.fullName)}" />
            </div>
            ${renderLineupMeta(fixture, starter.slug, player)}
            ${renderLineupStatus(fixture, starter.slug, "starter")}
          </article>
        `;
      })
      .join("");
  }

  if (subsHost) {
    subsHost.innerHTML = (fixture.lineup.substitutes || [])
      .map((slug) => {
        const player = getPlayerRecord(slug);
        return `
          <article class="lineup-sub-card">
            ${renderLineupBadges(fixture, slug)}
            <div class="lineup-sub-avatar">
              <img src="${escapeHtml(player.image)}" alt="${escapeHtml(player.fullName)}" />
            </div>
            ${renderLineupMeta(fixture, slug, player)}
            ${renderLineupStatus(fixture, slug, "substitute")}
          </article>
        `;
      })
      .join("");
  }

  if (relatedHost) {
    const seasonFixtures = matchDatabase.fixtures
      .filter((item) => item.season === fixture.season)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    relatedHost.innerHTML = seasonFixtures
      .map((item) => {
        const isCurrent = item.id === fixture.id;
        return `
          <a class="lineup-related-card${isCurrent ? " is-current" : ""}" data-competition="${escapeHtml(item.competition || "")}" href="${escapeHtml(buildFixturePageHref("match-lineups.html", item))}">
            <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.displayDate)}</time>
            <div class="lineup-related-scorecard">
              <div class="lineup-related-team-row">
                <span><img src="${escapeHtml(item.home.logo)}" alt="" />${escapeHtml(getCompactFixtureTeamName(item.home))}</span>
                <b>${escapeHtml(item.score?.home ?? "-")}</b>
              </div>
              <div class="lineup-related-team-row">
                <span><img src="${escapeHtml(item.away.logo)}" alt="" />${escapeHtml(getCompactFixtureTeamName(item.away))}</span>
                <b>${escapeHtml(item.score?.away ?? "-")}</b>
              </div>
              <em>FT</em>
            </div>
          </a>
        `;
      })
      .join("");
  }

  if (relatedHost && relatedPrev && relatedNext) {
    const updateRelatedNavState = () => {
      const maxScrollLeft = Math.max(0, relatedHost.scrollWidth - relatedHost.clientWidth);
      relatedPrev.disabled = relatedHost.scrollLeft <= 8;
      relatedNext.disabled = relatedHost.scrollLeft >= maxScrollLeft - 8;
    };

    const scrollRelatedCards = (direction) => {
      const firstCard = relatedHost.querySelector(".lineup-related-card");
      const styles = window.getComputedStyle(relatedHost);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : relatedHost.clientWidth * 0.9;
      relatedHost.scrollBy({
        left: direction * (cardWidth + gap),
        behavior: "smooth",
      });
    };

    relatedPrev.onclick = () => scrollRelatedCards(-1);
    relatedNext.onclick = () => scrollRelatedCards(1);
    relatedHost.onscroll = updateRelatedNavState;
    window.addEventListener("resize", updateRelatedNavState, { passive: true });
    window.setTimeout(() => {
      const currentCard = relatedHost.querySelector(".lineup-related-card.is-current");
      if (currentCard) {
        const hostRect = relatedHost.getBoundingClientRect();
        const cardRect = currentCard.getBoundingClientRect();
        const offsetLeft = currentCard.offsetLeft;
        const targetLeft = Math.max(0, offsetLeft - Math.max(0, (hostRect.width - cardRect.width) / 2));
        relatedHost.scrollLeft = targetLeft;
      }
      updateRelatedNavState();
    }, 40);
    updateRelatedNavState();
  }
}

const defaultNewsRecords = Array.isArray(window.ISLINGTON_NEWS) ? window.ISLINGTON_NEWS : [];

const newsStorageKey = "islington-news-records-v2";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderPlayerTemplate();
renderMatchTemplate();
renderLineupTemplate();

function formatNewsDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatCompactNewsDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function loadNewsRecords() {
  try {
    const saved = window.localStorage.getItem(newsStorageKey);
    if (!saved) return defaultNewsRecords;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaultNewsRecords;
    const savedIds = new Set(parsed.map((record) => record.id));
    return [...defaultNewsRecords.filter((record) => !savedIds.has(record.id)), ...parsed];
  } catch {
    return defaultNewsRecords;
  }
}

let newsRecords = loadNewsRecords();

function saveNewsRecords() {
  window.localStorage.setItem(newsStorageKey, JSON.stringify(newsRecords));
}

function renderNewsCards() {
  if (!newsList) return;
  const selectedCategory = newsCategory?.value || new URLSearchParams(window.location.search).get("category") || "all";
  const records = newsRecords
    .filter((record) => selectedCategory === "all" || record.category === selectedCategory || record.tag === selectedCategory)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  newsList.innerHTML = records
    .map(
      (record) => {
        const fixture = findFixtureForNewsRecord(record);
        return `
        <a class="library-card" href="${escapeHtml(record.url)}">
          <div class="library-card-media">
            ${buildMatchReportCardMedia(record, fixture)}
          </div>
          <div class="library-card-content">
            <h2>${escapeHtml(record.title)}</h2>
          </div>
        </a>
      `;
      }
    )
    .join("");
}

function populateNewsCategories() {
  if (!newsCategory) return;
  const categories = Array.from(
    new Set(newsRecords.flatMap((record) => [record.category, record.tag]).filter(Boolean))
  ).sort();
  const queryCategory = new URLSearchParams(window.location.search).get("category");
  const activeValue = queryCategory || newsCategory.value || "all";
  newsCategory.innerHTML = [
    '<option value="all">All Categories</option>',
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
  newsCategory.value = categories.includes(activeValue) ? activeValue : "all";
}

function renderNewsTable() {
  if (!newsTable) return;
  newsTable.innerHTML = newsRecords
    .map(
      (record) => `
        <div class="db-row" data-news-id="${escapeHtml(record.id)}">
          <img src="${escapeHtml(record.image)}" alt="" />
          <div>
            <strong>${escapeHtml(record.title)}</strong>
            <span>${escapeHtml(record.category)} / ${escapeHtml(formatNewsDate(record.date))}</span>
          </div>
          <div class="db-actions">
            <button class="db-action" type="button" data-news-edit="${escapeHtml(record.id)}">Edit</button>
            <button class="db-action" type="button" data-news-delete="${escapeHtml(record.id)}">Delete</button>
          </div>
        </div>
      `
    )
    .join("");
}

function resetNewsForm() {
  if (!newsForm) return;
  newsForm.reset();
  newsForm.elements.id.value = "";
}

function syncNewsUi() {
  populateNewsCategories();
  renderNewsCards();
  renderNewsTable();
}

newsCategory?.addEventListener("change", renderNewsCards);

newsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(newsForm);
  const record = {
    id: formData.get("id") || `news-${Date.now()}`,
    title: formData.get("title"),
    category: formData.get("category"),
    date: formData.get("date"),
    image: formData.get("image"),
    url: formData.get("url"),
    summary: formData.get("summary")
  };
  const existingIndex = newsRecords.findIndex((item) => item.id === record.id);
  if (existingIndex >= 0) {
    newsRecords[existingIndex] = record;
  } else {
    newsRecords.unshift(record);
  }
  saveNewsRecords();
  resetNewsForm();
  syncNewsUi();
});

newsReset?.addEventListener("click", resetNewsForm);

newsTable?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-news-edit]");
  const deleteButton = event.target.closest("[data-news-delete]");

  if (editButton && newsForm) {
    const record = newsRecords.find((item) => item.id === editButton.dataset.newsEdit);
    if (!record) return;
    Object.entries(record).forEach(([key, value]) => {
      if (newsForm.elements[key]) {
        newsForm.elements[key].value = value;
      }
    });
    newsForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (deleteButton) {
    newsRecords = newsRecords.filter((item) => item.id !== deleteButton.dataset.newsDelete);
    saveNewsRecords();
    syncNewsUi();
  }
});

newsExport?.addEventListener("click", async () => {
  const json = JSON.stringify(newsRecords, null, 2);
  try {
    await navigator.clipboard.writeText(json);
    newsExport.textContent = "Copied JSON";
    window.setTimeout(() => {
      newsExport.textContent = "Export JSON";
    }, 1400);
  } catch {
    window.prompt("Copy news JSON", json);
  }
});

newsImport?.addEventListener("click", () => {
  const input = window.prompt("Paste news JSON");
  if (!input) return;
  try {
    const imported = JSON.parse(input);
    if (!Array.isArray(imported)) return;
    newsRecords = imported;
    saveNewsRecords();
    syncNewsUi();
  } catch {
    window.alert("The imported JSON could not be parsed.");
  }
});

function renderArticleBlock(block) {
  if (block.type === "h2") return `<h2>${escapeHtml(block.text)}</h2>`;
  if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
  if (block.type === "table") {
    const headers = Array.isArray(block.headers) ? block.headers : [];
    const rows = Array.isArray(block.rows) ? block.rows : [];
    return `
      <div class="article-table-wrap">
        <table class="article-table">
          <thead>
            <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }
  if (block.type === "list") {
    const items = Array.isArray(block.items) ? block.items : [];
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }
  if (block.type === "signoff") {
    const lines = Array.isArray(block.lines) ? block.lines : [];
    return `
      <section class="article-signoff">
        <h2>${escapeHtml(block.title || "")}</h2>
        ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      </section>
    `;
  }
  return `<p>${escapeHtml(block.text || "")}</p>`;
}

function renderNewsListItems(container, records, currentId) {
  if (!container) return;
  const items = records.filter((record) => record.id !== currentId).slice(0, 5);
  container.innerHTML = items
    .map(
      (record) => `
        <a href="${escapeHtml(record.url)}">
          <time datetime="${escapeHtml(record.date)}">${escapeHtml(formatCompactNewsDate(record.date))}</time>
          <strong>${escapeHtml(record.title)}</strong>
        </a>
      `
    )
    .join("");
}

function renderRelatedNews(container, records, currentId) {
  if (!container) return;
  const items = records.filter((record) => record.id !== currentId).slice(0, 4);
  container.innerHTML = items
    .map(
      (record) => `
        <a class="article-related-card" href="${escapeHtml(record.url)}">
          <img src="${escapeHtml(record.image)}" alt="" />
          <time datetime="${escapeHtml(record.date)}">${escapeHtml(formatCompactNewsDate(record.date))}</time>
          <strong>${escapeHtml(record.title)}</strong>
          <span aria-hidden="true">&#8594;</span>
        </a>
      `
    )
    .join("");
}

function normalizeLookupText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/fc/g, "")
    .replace(/utd/g, "united")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isMatchReportRecord(record) {
  return record?.category === "Match Report" || /^match report:/i.test(String(record?.title || ""));
}

function findFixtureForNewsRecord(record) {
  if (!record || !isMatchReportRecord(record)) return null;

  if (record.url) {
    const byUrl = matchDatabase.fixtures.find((fixture) => fixture.detail?.reportUrl === record.url);
    if (byUrl) return byUrl;
  }

  const sameDate = matchDatabase.fixtures.filter((fixture) => fixture.date === record.date);
  if (sameDate.length === 1) return sameDate[0];
  if (!sameDate.length) return null;

  const titleNeedle = normalizeLookupText(record.title);
  const scored = sameDate
    .map((fixture) => {
      let score = 0;
      const homeName = normalizeLookupText(fixture.home.name);
      const awayName = normalizeLookupText(fixture.away.name);
      const homeCode = normalizeLookupText(fixture.home.code);
      const awayCode = normalizeLookupText(fixture.away.code);
      const competition = normalizeLookupText(fixture.competitionLabel);
      if (homeName && titleNeedle.includes(homeName)) score += 2;
      if (awayName && titleNeedle.includes(awayName)) score += 2;
      if (homeCode && titleNeedle.includes(homeCode)) score += 1;
      if (awayCode && titleNeedle.includes(awayCode)) score += 1;
      if (competition && titleNeedle.includes(competition)) score += 1;
      return { fixture, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.fixture || sameDate[0];
}

function getCompetitionCoverClass(competition) {
  const key = normalizeLookupText(competition);
  if (key.includes("champions")) return "is-ucl";
  if (key.includes("carabao") || key.includes("league cup")) return "is-carabao";
  if (key.includes("fa cup") || key.includes("emirates")) return "is-fa-cup";
  return "is-premier";
}

function buildMatchReportCardMedia(record, fixture) {
  if (!fixture) {
    return `
      <img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)}" />
      <span>${escapeHtml(record.category)}</span>
      <time datetime="${escapeHtml(record.date)}">${escapeHtml(formatCompactNewsDate(record.date))}</time>
    `;
  }

  const competitionClass = getCompetitionCoverClass(fixture.competition || fixture.competitionLabel);

  return `
    <div class="library-match-cover ${competitionClass}">
      <div class="library-match-cover-top">
        <span>${escapeHtml(fixture.competitionLabel || record.category)}</span>
        <strong>${escapeHtml(formatCompactNewsDate(record.date))}</strong>
      </div>
      <div class="library-match-cover-middle">
        <div class="library-match-cover-team">
          <img src="${escapeHtml(fixture.home.logo)}" alt="${escapeHtml(fixture.home.name)} crest" />
          <em>${escapeHtml(fixture.home.code)}</em>
        </div>
        <div class="library-match-cover-score">
          <b>${escapeHtml(String(fixture.score?.home ?? 0))}</b>
          <i>-</i>
          <b>${escapeHtml(String(fixture.score?.away ?? 0))}</b>
        </div>
        <div class="library-match-cover-team">
          <img src="${escapeHtml(fixture.away.logo)}" alt="${escapeHtml(fixture.away.name)} crest" />
          <em>${escapeHtml(fixture.away.code)}</em>
        </div>
      </div>
      <div class="library-match-cover-bottom">${escapeHtml(fixture.stadium || "")}</div>
    </div>
  `;
}

function renderMatchReportHero(figure, record, fixture) {
  if (!figure || !fixture) return false;
  const isHome = fixture.home.code === "ISL";
  const homeName = fixture.home.name || fixture.home.code;
  const awayName = fixture.away.name || fixture.away.code;
  const homeLogo = fixture.home.logo || "";
  const awayLogo = fixture.away.logo || "";
  const homeScore = fixture.score?.home ?? 0;
  const awayScore = fixture.score?.away ?? 0;
  const competitionClass = getCompetitionCoverClass(fixture.competition || fixture.competitionLabel);

  figure.classList.add("is-match-report", competitionClass);
  figure.innerHTML = `
    <div class="match-report-hero-card">
      <div class="match-report-hero-top">
        <span>${escapeHtml(fixture.competitionLabel || "")}</span>
        <span>${escapeHtml(formatNewsDate(fixture.date || record.date || ""))}</span>
      </div>
      <div class="match-report-hero-scoreline">
        <div class="match-report-team">
          <img src="${escapeHtml(homeLogo)}" alt="${escapeHtml(homeName)} crest" />
          <strong>${escapeHtml(homeName)}</strong>
        </div>
        <div class="match-report-score">
          <span>${escapeHtml(String(homeScore))}</span>
          <em>-</em>
          <span>${escapeHtml(String(awayScore))}</span>
        </div>
        <div class="match-report-team">
          <img src="${escapeHtml(awayLogo)}" alt="${escapeHtml(awayName)} crest" />
          <strong>${escapeHtml(awayName)}</strong>
        </div>
      </div>
      <div class="match-report-hero-bottom">
        <span>${escapeHtml(isHome ? "Home" : "Away")}</span>
        <span>${escapeHtml(fixture.stadium || "")}</span>
      </div>
    </div>
  `;
  return true;
}

function renderArticlePage() {
  const articlePage = document.querySelector("[data-article-id]");
  if (!articlePage) return;
  const articleId = articlePage.dataset.articleId;
  const sortedRecords = [...newsRecords].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const record = sortedRecords.find((item) => item.id === articleId);
  if (!record) return;

  const title = articlePage.querySelector("[data-article-title]");
  const meta = articlePage.querySelector("[data-article-meta]");
  const excerpt = articlePage.querySelector("[data-article-excerpt]");
  const hero = articlePage.querySelector(".article-template-hero");
  const image = articlePage.querySelector("[data-article-image]");
  const body = articlePage.querySelector("[data-article-body]");
  const fixture = findFixtureForNewsRecord(record);

  document.title = `${record.title} | Islington FC`;
  if (title) title.textContent = record.title;
  if (meta) {
    meta.innerHTML = `
      <a href="news.html?category=${encodeURIComponent(record.category)}">${escapeHtml(record.category)}</a>
      <a href="news.html?category=${encodeURIComponent(record.tag || "News")}">${escapeHtml(record.tag || "News")}</a>
      <time datetime="${escapeHtml(record.date)}">${escapeHtml(formatNewsDate(record.date))}</time>
    `;
  }
  if (excerpt) excerpt.textContent = record.excerpt || record.summary || "";
  if (hero) {
    hero.classList.remove("is-match-report", "is-premier", "is-ucl", "is-carabao");
  }
  if (fixture && hero && renderMatchReportHero(hero, record, fixture)) {
    // Match reports use an auto-generated score cover.
  } else if (image || hero) {
    if (hero) {
      hero.innerHTML = `<img data-article-image src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)}" />`;
      const resetImage = hero.querySelector("[data-article-image]");
      if (resetImage) {
        resetImage.src = record.image;
        resetImage.alt = record.title;
      }
    } else if (image) {
      image.src = record.image;
      image.alt = record.title;
    }
  }
  if (body) {
    body.innerHTML = Array.isArray(record.body) ? record.body.map(renderArticleBlock).join("") : "";
  }

  renderNewsListItems(articlePage.querySelector("[data-article-latest]"), sortedRecords, articleId);
  renderRelatedNews(articlePage.querySelector("[data-article-related]"), sortedRecords, articleId);
}

syncNewsUi();
renderArticlePage();
