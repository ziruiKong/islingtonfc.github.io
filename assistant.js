(function () {
  const form = document.querySelector("[data-assistant-form]");
  const input = document.querySelector("[data-assistant-input]");
  const log = document.querySelector("[data-assistant-log]");
  const stats = document.querySelector("[data-assistant-stats]");
  const promptButtons = Array.from(document.querySelectorAll("[data-assistant-prompt]"));

  if (!form || !input || !log) return;

  const newsRecords = Array.isArray(window.ISLINGTON_NEWS) ? window.ISLINGTON_NEWS : [];
  const matchData = window.ISLINGTON_MATCH_DATA || { players: [], fixtures: [] };
  const players = Array.isArray(matchData.players) ? matchData.players : [];
  const fixtures = Array.isArray(matchData.fixtures) ? matchData.fixtures.slice() : [];

  const playerLookup = new Map(players.map((player) => [player.slug, player]));
  const aliases = new Map();
  const playerStats = new Map();

  const accentSafe = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalize = (value) =>
    accentSafe(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const bodyToText = (body) =>
    Array.isArray(body)
      ? body
          .map((block) => {
            if (block.text) return block.text;
            if (Array.isArray(block.items)) return block.items.join(" ");
            if (Array.isArray(block.rows)) return block.rows.flat().join(" ");
            return "";
          })
          .join(" ")
      : "";

  const summarize = (text, max = 180) => {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).trim()}...`;
  };

  function registerAlias(alias, slug) {
    const key = normalize(alias);
    if (!key) return;
    aliases.set(key, slug);
  }

  players.forEach((player) => {
    registerAlias(player.slug.replace(/-/g, " "), player.slug);
    registerAlias(player.name, player.slug);
    registerAlias(player.name.replace(/\(c\)/gi, "").trim(), player.slug);
    const parts = accentSafe(player.name.replace(/\(c\)/gi, "").trim()).split(/\s+/).filter(Boolean);
    if (parts.length) {
      registerAlias(parts[parts.length - 1], player.slug);
    }
  });

  fixtures.forEach((fixture) => {
    (fixture.scorers || []).forEach((entry) => {
      if (entry.slug && playerLookup.has(entry.slug)) {
        const current = playerStats.get(entry.slug) || {
          appearances: 0,
          goals: 0,
          assists: 0,
          yellows: 0,
          ratings: [],
          competitions: new Map()
        };
        current.goals += 1;
        const competitionTotal = current.competitions.get(fixture.competitionLabel || fixture.competition) || {
          goals: 0,
          assists: 0
        };
        competitionTotal.goals += 1;
        current.competitions.set(fixture.competitionLabel || fixture.competition, competitionTotal);
        playerStats.set(entry.slug, current);
      }

      if (entry.assistSlug && playerLookup.has(entry.assistSlug)) {
        const current = playerStats.get(entry.assistSlug) || {
          appearances: 0,
          goals: 0,
          assists: 0,
          yellows: 0,
          ratings: [],
          competitions: new Map()
        };
        current.assists += 1;
        const competitionTotal = current.competitions.get(fixture.competitionLabel || fixture.competition) || {
          goals: 0,
          assists: 0
        };
        competitionTotal.assists += 1;
        current.competitions.set(fixture.competitionLabel || fixture.competition, competitionTotal);
        playerStats.set(entry.assistSlug, current);
      }
    });

    const lineupRatings = fixture.lineup?.ratings || {};
    Object.entries(lineupRatings).forEach(([slug, rating]) => {
      if (!playerLookup.has(slug)) return;
      const current = playerStats.get(slug) || {
        appearances: 0,
        goals: 0,
        assists: 0,
        yellows: 0,
        ratings: [],
        competitions: new Map()
      };
      current.appearances += 1;
      current.ratings.push(Number(rating.value) || 0);
      if (/yellow/i.test(String(rating.note || ""))) {
        current.yellows += 1;
      }
      playerStats.set(slug, current);
    });
  });

  const newsDocs = newsRecords.map((record) => ({
    type: "news",
    id: record.id,
    title: record.title,
    url: record.url,
    date: record.date,
    searchable: normalize([record.title, record.category, record.tag, record.excerpt, bodyToText(record.body)].join(" ")),
    excerpt: record.excerpt,
    bodyText: bodyToText(record.body)
  }));

  const fixtureDocs = fixtures.map((fixture) => {
    const scorers = (fixture.scorers || [])
      .map((entry) => `${entry.minute} ${entry.player}${entry.assist ? ` ${entry.assist}` : ""}`)
      .join(" ");
    return {
      type: "fixture",
      id: fixture.id,
      title: `${fixture.home.name} ${fixture.score.home}-${fixture.score.away} ${fixture.away.name}`,
      url: fixture.detail?.reportUrl || "",
      date: fixture.date,
      fixture,
      searchable: normalize(
        [
          fixture.home.name,
          fixture.home.code,
          fixture.away.name,
          fixture.away.code,
          fixture.competitionLabel,
          fixture.stadium,
          fixture.displayDate,
          scorers,
          fixture.detail?.reportHtml || ""
        ].join(" ")
      )
    };
  });

  const sortedNews = newsRecords.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const sortedFixtures = fixtures.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const latestFixture = sortedFixtures[sortedFixtures.length - 1] || null;
  const nextFixture = sortedFixtures.find((fixture) => fixture.date >= "2026-06-20") || sortedFixtures[0] || null;

  if (stats) {
    stats.textContent = `${newsRecords.length} news articles · ${fixtures.length} fixtures · ${players.length} players`;
  }

  function findPlayerSlug(question) {
    const normalizedQuestion = normalize(question);
    let matchedSlug = "";
    let matchedLength = 0;

    aliases.forEach((slug, alias) => {
      if (normalizedQuestion.includes(alias) && alias.length > matchedLength) {
        matchedSlug = slug;
        matchedLength = alias.length;
      }
    });

    return matchedSlug || "";
  }

  function getPlayerAnswer(question, slug) {
    const player = playerLookup.get(slug);
    if (!player) return null;

    const statsEntry = playerStats.get(slug) || {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellows: 0,
      ratings: []
    };

    const averageRating =
      statsEntry.ratings.length > 0
        ? (statsEntry.ratings.reduce((sum, value) => sum + value, 0) / statsEntry.ratings.length).toFixed(1)
        : null;

    const playerFixtures = fixtures
      .filter((fixture) => fixture.lineup?.ratings?.[slug])
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    const latestPlayerFixture = playerFixtures[0];
    const latestNote = latestPlayerFixture?.lineup?.ratings?.[slug]?.note || "";
    const latestRating = latestPlayerFixture?.lineup?.ratings?.[slug]?.value;

    let text = `${player.name.replace(/\s*\(C\)\s*/g, "")} 当前站内已录入数据：${statsEntry.appearances} 场、${statsEntry.goals} 球、${statsEntry.assists} 助攻`;
    if (statsEntry.yellows) {
      text += `、${statsEntry.yellows} 张黄牌`;
    }
    text += "。";

    if (averageRating) {
      text += ` 平均赛后评分约 ${averageRating}。`;
    }

    if (latestPlayerFixture && latestRating) {
      text += ` 最近一场录入比赛是 ${latestPlayerFixture.displayDate} 对阵 ${latestPlayerFixture.home.code === "ISL" ? latestPlayerFixture.away.name : latestPlayerFixture.home.name}，评分 ${latestRating}`;
      if (latestNote) {
        text += `，${latestNote}`;
      }
      text += "。";
    }

    return {
      text,
      links: latestPlayerFixture
        ? [
            {
              label: `${latestPlayerFixture.home.code} ${latestPlayerFixture.score.home}-${latestPlayerFixture.score.away} ${latestPlayerFixture.away.code}`,
              url: `match-detail.html?date=${encodeURIComponent(latestPlayerFixture.displayDate)}&competition=${encodeURIComponent(
                latestPlayerFixture.competitionLabel
              )}&home=${encodeURIComponent(latestPlayerFixture.home.code)}&away=${encodeURIComponent(
                latestPlayerFixture.away.code
              )}&score=${encodeURIComponent(
                `${latestPlayerFixture.score.home} - ${latestPlayerFixture.score.away}`
              )}&stadium=${encodeURIComponent(latestPlayerFixture.stadium)}&homeLogo=${encodeURIComponent(
                latestPlayerFixture.home.logo
              )}&awayLogo=${encodeURIComponent(latestPlayerFixture.away.logo)}`
            }
          ]
        : []
    };
  }

  function buildFixtureLink(fixture) {
    return `match-detail.html?date=${encodeURIComponent(fixture.displayDate)}&competition=${encodeURIComponent(
      fixture.competitionLabel
    )}&home=${encodeURIComponent(fixture.home.code)}&away=${encodeURIComponent(fixture.away.code)}&score=${encodeURIComponent(
      `${fixture.score.home} - ${fixture.score.away}`
    )}&stadium=${encodeURIComponent(fixture.stadium)}&homeLogo=${encodeURIComponent(
      fixture.home.logo
    )}&awayLogo=${encodeURIComponent(fixture.away.logo)}`;
  }

  function answerLatestNews() {
    const article = sortedNews[0];
    if (!article) {
      return { text: "当前还没有可用的新闻数据。", links: [] };
    }
    return {
      text: `目前最新一篇新闻是《${article.title}》，发布时间 ${formatDate(article.date)}。${article.excerpt}`,
      links: [{ label: article.title, url: article.url }]
    };
  }

  function answerNextMatch() {
    if (!nextFixture) {
      return { text: "当前还没有录入下一场比赛。", links: [] };
    }
    return {
      text: `目前已录入的下一场比赛是 ${nextFixture.displayDate}，${nextFixture.home.name} vs ${nextFixture.away.name}，赛事为 ${nextFixture.competitionLabel}，球场 ${nextFixture.stadium}。`,
      links: [{ label: `${nextFixture.home.code} vs ${nextFixture.away.code}`, url: buildFixtureLink(nextFixture) }]
    };
  }

  function answerRecentMatch() {
    if (!latestFixture) {
      return { text: "当前还没有录入比赛结果。", links: [] };
    }
    return {
      text: `目前最新一场已录入比赛是 ${latestFixture.displayDate} 的 ${latestFixture.home.name} ${latestFixture.score.home}-${latestFixture.score.away} ${latestFixture.away.name}。`,
      links: [{ label: `${latestFixture.home.code} ${latestFixture.score.home}-${latestFixture.score.away} ${latestFixture.away.code}`, url: buildFixtureLink(latestFixture) }]
    };
  }

  function answerFixtureBySearch(question) {
    const normalizedQuestion = normalize(question);
    const ranked = fixtureDocs
      .map((doc) => {
        let score = 0;
        normalizedQuestion.split(" ").forEach((token) => {
          if (token && doc.searchable.includes(token)) score += token.length;
        });
        return { doc, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || String(b.doc.date).localeCompare(String(a.doc.date)));

    const match = ranked[0]?.doc?.fixture;
    if (!match) return null;

    const goals = (match.scorers || [])
      .map((entry) => {
        const assist = entry.assist ? `，助攻 ${entry.assist}` : "";
        return `${entry.minute} ${entry.player}${assist}`;
      })
      .join("；");

    return {
      text: `${match.displayDate} 的 ${match.home.name} ${match.score.home}-${match.score.away} ${match.away.name} 已录入站内。${
        goals ? `进球明细：${goals}。` : ""
      }`,
      links: [{ label: `${match.home.code} ${match.score.home}-${match.score.away} ${match.away.code}`, url: buildFixtureLink(match) }]
    };
  }

  function answerNewsBySearch(question) {
    const normalizedQuestion = normalize(question);
    const ranked = newsDocs
      .map((doc) => {
        let score = 0;
        normalizedQuestion.split(" ").forEach((token) => {
          if (token && doc.searchable.includes(token)) score += token.length;
        });
        return { doc, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || String(b.doc.date).localeCompare(String(a.doc.date)));

    if (!ranked.length) return null;
    const top = ranked[0].doc;
    return {
      text: `我找到最相关的新闻是《${top.title}》(${formatDate(top.date)})。${summarize(top.excerpt || top.bodyText)}`,
      links: ranked.slice(0, 3).map((entry) => ({ label: entry.doc.title, url: entry.doc.url }))
    };
  }

  function answerAllFixtures() {
    if (!sortedFixtures.length) {
      return { text: "当前还没有录入比赛。", links: [] };
    }

    const preview = sortedFixtures
      .slice(0, 6)
      .map((fixture) => `${fixture.displayDate}: ${fixture.home.code} ${fixture.score.home}-${fixture.score.away} ${fixture.away.code}`)
      .join("；");

    return {
      text: `目前站内共录入 ${sortedFixtures.length} 场比赛。前几场是：${preview}。`,
      links: [{ label: "Open matches page", url: "matches.html" }]
    };
  }

  function getFallbackAnswer(question) {
    const fixtureAnswer = answerFixtureBySearch(question);
    const newsAnswer = answerNewsBySearch(question);

    if (fixtureAnswer && newsAnswer) {
      return {
        text: `${fixtureAnswer.text} 另外还有相关资讯：${newsAnswer.text}`,
        links: [...fixtureAnswer.links, ...newsAnswer.links].slice(0, 4)
      };
    }

    return (
      fixtureAnswer ||
      newsAnswer || {
        text: "我暂时没在已录入的新闻和比赛数据库里找到明确答案。你可以换一种问法，比如球员名字、对手名字、比赛日期，或者直接问“最新新闻”“下一场比赛”。",
        links: [
          { label: "News", url: "news.html" },
          { label: "Matches", url: "matches.html" }
        ]
      }
    );
  }

  function answerQuestion(question) {
    const normalizedQuestion = normalize(question);
    const playerSlug = findPlayerSlug(question);

    if (!normalizedQuestion) {
      return { text: "你可以直接问我新闻、比赛、球员数据或者转会内容。", links: [] };
    }

    if (/(最新|latest).*(新闻|news)|新闻.*(最新|latest)/.test(normalizedQuestion)) {
      return answerLatestNews();
    }

    if (/(下一场|next).*(比赛|match|fixture)|比赛.*(下一场|next)/.test(normalizedQuestion)) {
      return answerNextMatch();
    }

    if (/(最近|latest|last).*(比赛|result|match)|上一场比赛|最近一场/.test(normalizedQuestion)) {
      return answerRecentMatch();
    }

    if (/(已录入|全部|所有).*(比赛|fixtures|matches)/.test(normalizedQuestion)) {
      return answerAllFixtures();
    }

    if (playerSlug) {
      return getPlayerAnswer(question, playerSlug);
    }

    return getFallbackAnswer(question);
  }

  function appendMessage(role, html, links = []) {
    const article = document.createElement("article");
    article.className = `assistant-message assistant-message-${role}`;
    article.innerHTML = `
      <div class="assistant-avatar">${role === "user" ? "You" : "AI"}</div>
      <div class="assistant-bubble">
        <div class="assistant-message-copy">${html}</div>
        ${
          links.length
            ? `<div class="assistant-message-links">${links
                .map((link) => `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`)
                .join("")}</div>`
            : ""
        }
      </div>
    `;
    log.appendChild(article);
    log.scrollTop = log.scrollHeight;
  }

  function handlePrompt(question) {
    appendMessage("user", `<p>${escapeHtml(question)}</p>`);
    const answer = answerQuestion(question);
    appendMessage("bot", `<p>${escapeHtml(answer.text)}</p>`, answer.links || []);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    handlePrompt(question);
    input.value = "";
  });

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.assistantPrompt || "";
      input.value = prompt;
      handlePrompt(prompt);
    });
  });
})();
