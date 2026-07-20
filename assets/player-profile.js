(function () {
  const config = window.TOPS_PROFILE_CONFIG || {};
  const players = window[config.dataKey] || [];
  const id = new URLSearchParams(window.location.search).get("id") || players[0]?.id;
  const player = players.find((item) => item.id === id);
  const detail = document.querySelector("#player-profile");
  const notFound = document.querySelector("#player-not-found");

  const euro = (value) => String(value ?? "").replace(/EUR/g, "&euro;");
  const number = (value) => Number(value ?? 0);
  const initials = (name) => String(name || "TOPS").replace(/\([^)]*\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const position = (item) => item.specificPosition || item.position || "--";
  const statFourth = (item) => item.positionShort === "GKP" || position(item).includes("GK") ? "Clean Sheets" : "Clearances";
  const statFourthKey = (item) => statFourth(item) === "Clean Sheets" ? "cleanSheets" : "clearances";
  const profileKind = config.profileKind || "MEN'S FIRST TEAM";

  function transferRecordsFor(item) {
    const windows = window.TOPS_TRANSFER_DATA?.windows || [];
    return windows.flatMap((windowItem) => [
      ...(windowItem.arrivals || []).filter((entry) => entry.playerId === item.id).map((entry) => ({
        kind: "Arrival",
        season: windowItem.season,
        from: entry.from,
        to: "TOPS FC",
        fee: entry.fee,
        weeklyWage: entry.weeklyWage,
        detail: entry.contract || ""
      })),
      ...(windowItem.academyPromotions || []).filter((entry) => entry.playerId === item.id).map((entry) => ({
        kind: "Academy",
        season: windowItem.season,
        from: entry.from,
        to: "TOPS FC",
        fee: entry.fee,
        weeklyWage: entry.weeklyWage,
        detail: entry.contract || entry.note || ""
      })),
      ...(windowItem.departures || []).filter((entry) => entry.playerId === item.id).map((entry) => ({
        kind: "Departure",
        season: windowItem.season,
        from: "TOPS FC",
        to: entry.destination,
        fee: entry.fee,
        weeklyWage: "",
        detail: ""
      })),
      ...(windowItem.loansOut || []).filter((entry) => entry.playerId === item.id).map((entry) => ({
        kind: "Loan Out",
        season: windowItem.season,
        from: "TOPS FC",
        to: entry.destination,
        fee: entry.type || "Loan",
        weeklyWage: "",
        detail: entry.type || "Loan"
      }))
    ]);
  }

  function clubToken(name) {
    const isTops = String(name).toLowerCase().includes("tops");
    return `<div class="club-token"><span class="club-logo">${isTops ? `<img src="assets/nav-hat-logo.webp" alt="">` : initials(name)}</span><span>${name}</span></div>`;
  }

  function renderTransfer(record) {
    return `
      <article class="transfer-card panel">
        <p class="panel-title">Transfer History</p>
        <div class="transfer-layout">
          <div class="transfer-kind"><b>${record.season}</b>${record.kind}</div>
          ${clubToken(record.from)}
          <div class="transfer-arrow">&rarr;</div>
          ${clubToken(record.to)}
          <div class="transfer-money">
            <span class="money-label">Transfer Fee</span><span class="money-value">${euro(record.fee)}</span>
            ${record.weeklyWage ? `<span class="money-label">Weekly Wage</span><span class="money-value">${euro(record.weeklyWage)}</span>` : ""}
          </div>
        </div>
        <a class="transfer-full-link" href="transfer-history.html">View full transfer history &rsaquo;</a>
      </article>
    `;
  }

  if (!player) {
    notFound.hidden = false;
    return;
  }

  document.title = `${player.name} | TOPS`;
  detail.hidden = false;

  const seasons = player.seasonStats || [{ season: player.seasons || "2026/27", ...(player.stats || {}) }];
  const fourthKey = statFourthKey(player);
  const totals = seasons.reduce((sum, item) => ({
    appearances: sum.appearances + number(item.appearances),
    goals: sum.goals + number(item.goals),
    assists: sum.assists + number(item.assists),
    fourth: sum.fourth + number(item[fourthKey] ?? item.cleanSheets ?? 0)
  }), { appearances: 0, goals: 0, assists: 0, fourth: 0 });
  const transfers = transferRecordsFor(player);
  const transfer = transfers[0];
  const bio = player.bio || (config.isArchive
    ? `${player.name} is archived as a predecessor player after appearing in the club's ${player.seasons || "all-competitions"} records. This page keeps the player's TOPS club file separate from the current first-team squad while preserving their season statistics.`
    : `${player.name} is part of the TOPS men's first team squad. Live season data for appearances, goals, assists and average rating can be updated from the shared player data source.`);

  detail.innerHTML = `
    <a class="back-link" href="${config.backHref}">${config.backLabel}</a>
    <header class="profile-head">
      <span class="profile-number">${player.number || ""}</span>
      <div><h1 class="profile-name">${player.name}</h1><div class="profile-meta">TOPS FC <span>|</span> ${profileKind} <span>|</span> ${player.position || position(player)}</div></div>
      <img class="head-mark" src="assets/islington-oval-mark.webp" alt="">
    </header>
    <div class="profile-grid">
      <div>
        <figure class="portrait-card" data-number="${player.number || ""}">${player.photo ? `<img src="${player.photo}" alt="${player.name}">` : ""}</figure>
        <a class="portrait-link" href="transfer-history.html">View full transfer history &rsaquo;</a>
      </div>
      <div class="content-panel">
        <section class="career-card panel">
          <p class="panel-title">${config.statsTitle || "Career Stats"}</p>
          <div class="career-stats">
            <div class="career-stat"><div><div class="stat-value">${totals.appearances}</div><div class="stat-label">Appearances</div></div></div>
            <div class="career-stat"><div><div class="stat-value">${totals.goals}</div><div class="stat-label">Goals</div></div></div>
            <div class="career-stat"><div><div class="stat-value">${totals.assists}</div><div class="stat-label">Assists</div></div></div>
            <div class="career-stat"><div><div class="stat-value">${totals.fourth}</div><div class="stat-label">${statFourth(player)}</div></div></div>
          </div>
        </section>
        <section class="season-block">
          <h2 class="season-title">Season Statistics</h2>
          <div class="season-scroll">
            <table class="season-table">
              <thead><tr><th>Season</th><th>Apps</th><th>Goals</th><th>Assists</th><th>${statFourth(player)}</th><th>Avg Rating</th></tr></thead>
              <tbody>
                ${seasons.map((item) => `
                  <tr>
                    <td><div class="season-cell"><span>${item.season}</span>${item.loanClub ? `<span class="loan-chip"><b>Loan</b><span>${item.loanLogo ? `<img src="${item.loanLogo}" alt="">` : ""}${item.loanClub}</span></span>` : ""}</div></td>
                    <td>${item.appearances ?? 0}</td><td>${item.goals ?? 0}</td><td>${item.assists ?? 0}</td><td>${item[fourthKey] ?? item.cleanSheets ?? 0}</td><td>${item.averageRating ?? "0.0"}</td>
                  </tr>`).join("")}
                <tr class="total-row"><td>Total</td><td>${totals.appearances}</td><td>${totals.goals}</td><td>${totals.assists}</td><td>-</td><td>-</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="info-row">
          <div class="bio-card">
            <p class="panel-title">${config.bioTitle || "Biography"}</p>
            <p>${bio}</p>
          </div>
          <div class="facts-card panel">
            <div class="fact"><span class="fact-label">Nationality</span><span class="fact-value">${player.flag ? `<img src="${player.flag}" alt="">` : ""}${player.nationality || "--"}</span></div>
            <div class="fact"><span class="fact-label">Position</span><span class="fact-value">${player.position || "--"}</span></div>
            <div class="fact"><span class="fact-label">${config.isArchive ? "Record Type" : "Age"}</span><span class="fact-value">${config.isArchive ? "Predecessor" : (player.age || "--")}</span></div>
          </div>
        </section>
        ${transfer ? renderTransfer(transfer) : ""}
      </div>
    </div>
  `;
})();
