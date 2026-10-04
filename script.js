/* ПрофиТрек: общая логика страниц.
   Файл подключается на всех страницах, но запускает только нужный модуль. */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initReveal();

  const page = document.body;

  if (page.classList.contains("test-page")) initTest();
  if (document.getElementById("resultsApp")) initResults();
  if (document.getElementById("professionGrid")) initProfessionCatalog();
});

/* ---------- Общие UI ---------- */

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}

function animateNumber(element, target) {
  const duration = 700;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    element.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + "%";
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- Тест ---------- */

function initTest() {
  const saved = localStorage.getItem("profiTrekAnswers");
  let answers = saved ? JSON.parse(saved) : [];
  if (!Array.isArray(answers) || answers.length !== questions.length) {
    answers = new Array(questions.length).fill(null);
  }

  let current = 0;
  const counter = document.getElementById("questionCounter");
  const progress = document.getElementById("progressFill");
  const questionText = document.getElementById("questionText");
  const questionMeta = document.getElementById("questionMeta");
  const answersBox = document.getElementById("answers");
  const error = document.getElementById("testError");
  const back = document.getElementById("backBtn");
  const next = document.getElementById("nextBtn");
  const card = document.getElementById("questionCard");

  function save() {
    localStorage.setItem("profiTrekAnswers", JSON.stringify(answers));
  }

  function render(direction = 0) {
    const q = questions[current];
    counter.textContent = `Вопрос ${current + 1} из ${questions.length}`;
    questionMeta.textContent = `Вопрос ${String(current + 1).padStart(2, "0")}`;
    questionText.textContent = q.text;
    progress.style.width = `${((current + 1) / questions.length) * 100}%`;
    next.textContent = current === questions.length - 1 ? "Получить результат →" : "Далее →";
    back.disabled = current === 0;
    error.classList.remove("show");

    card.classList.remove("slide-in-left", "slide-in-right");
    void card.offsetWidth;
    card.classList.add(direction >= 0 ? "slide-in-right" : "slide-in-left");

    answersBox.innerHTML = "";
    q.answers.forEach((answer, index) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      label.innerHTML = `<input type="radio" name="question" value="${index}" ${answers[current] === index ? "checked" : ""}>
        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
        <span class="answer-text">${answer.text}</span>
        <span class="answer-check">✓</span>`;
      label.addEventListener("click", () => {
        answers[current] = index;
        save();
        error.classList.remove("show");
        answersBox.querySelectorAll(".answer-option").forEach(el => el.classList.remove("selected"));
        label.classList.add("selected");
      });
      if (answers[current] === index) label.classList.add("selected");
      answersBox.appendChild(label);
    });
  }

  next.addEventListener("click", () => {
    if (answers[current] === null || answers[current] === undefined) {
      error.classList.add("show");
      return;
    }
    if (current === questions.length - 1) {
      save();
      window.location.href = "results.html";
      return;
    }
    current++;
    render(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  back.addEventListener("click", () => {
    if (current === 0) return;
    current--;
    render(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  render(1);
}

/* ---------- Расчёт результата ---------- */

function calculateResult() {
  const raw = localStorage.getItem("profiTrekAnswers");
  if (!raw) return null;
  const answers = JSON.parse(raw);
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some(a => a === null)) return null;

  const scores = {};
  Object.keys(directions).forEach(key => scores[key] = 0);

  answers.forEach((answerIndex, questionIndex) => {
    const selected = questions[questionIndex].answers[answerIndex];
    if (!selected) return;
    Object.entries(selected.score).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  const maxPossible = {};
  Object.keys(directions).forEach(key => {
    maxPossible[key] = 0;
    questions.forEach(q => {
      const max = Math.max(0, ...q.answers.map(a => a.score[key] || 0));
      maxPossible[key] += max;
    });
  });

  const ranked = Object.entries(scores)
    .map(([key, score]) => ({
      key,
      score,
      percent: maxPossible[key] ? Math.round((score / maxPossible[key]) * 100) : 0
    }))
    .sort((a, b) => b.score - a.score || b.percent - a.percent);

  // Для профессий используем нормализованные баллы направлений.
  const normalized = {};
  ranked.forEach(item => normalized[item.key] = item.percent);

  const profRanked = professions.map(profession => {
    let weighted = 0;
    let totalWeight = 0;
    Object.entries(profession.weights).forEach(([key, weight]) => {
      weighted += (normalized[key] || 0) * weight;
      totalWeight += weight;
    });
    const match = totalWeight ? Math.round(weighted / totalWeight) : 0;
    return { ...profession, match };
  }).sort((a, b) => b.match - a.match);

  return { scores, ranked, professions: profRanked };
}

function chooseProfile(ranked) {
  // Выбираем профиль по сумме сильных направлений.
  let best = profileTypes[0];
  let bestScore = -1;
  profileTypes.forEach(profile => {
    const top = profile.keys.reduce((sum, key) => sum + (ranked.find(x => x.key === key)?.score || 0), 0);
    if (top > bestScore) {
      bestScore = top;
      best = profile;
    }
  });
  return best;
}

/* ---------- Страница результата ---------- */

function initResults() {
  const raw = localStorage.getItem("profiTrekAnswers");
  const loading = document.getElementById("loadingScreen");
  const content = document.getElementById("resultsContent");

  if (!raw) {
    loading.innerHTML = `<div class="empty-result">
      <h1>Сначала пройди тест</h1>
      <p>Чтобы увидеть персональный результат, ответь на все 20 вопросов.</p>
      <a class="btn btn-primary" href="test.html">Начать тест →</a>
    </div>`;
    return;
  }

  setTimeout(() => {
    const result = calculateResult();
    if (!result) {
      loading.innerHTML = `<div class="empty-result">
        <h1>Тест ещё не завершён</h1>
        <p>Нужно ответить на все вопросы.</p>
        <a class="btn btn-primary" href="test.html">Продолжить тест →</a>
      </div>`;
      return;
    }

    const profile = chooseProfile(result.ranked);
    document.getElementById("profileName").textContent = profile.name;
    document.getElementById("profileDescription").textContent = profile.description;

    const directionBox = document.getElementById("topDirections");
    directionBox.innerHTML = "";
    result.ranked.slice(0, 3).forEach((item, index) => {
      const row = document.createElement("article");
      row.className = "direction-row";
      row.innerHTML = `
        <div class="rank">${["🥇","🥈","🥉"][index]}</div>
        <div class="direction-main">
          <div class="direction-title"><strong>${directions[item.key].name}</strong><span class="direction-percent">0%</span></div>
          <div class="result-bar"><span style="width:${item.percent}%"></span></div>
        </div>`;
      directionBox.appendChild(row);
      setTimeout(() => animateNumber(row.querySelector(".direction-percent"), item.percent), 250 + index * 100);
    });

    const profBox = document.getElementById("topProfessions");
    profBox.innerHTML = "";
    result.professions.slice(0, 5).forEach((prof, index) => {
      const card = document.createElement("article");
      card.className = "result-prof-card";
      card.innerHTML = `
        <div class="prof-rank">${String(index + 1).padStart(2, "0")}</div>
        <div class="prof-result-head"><h3>${prof.name}</h3><span class="match">${prof.match}%</span></div>
        <p>${prof.description}</p>
        <div class="why"><strong>Почему подходит</strong><span>${whyProfessionFits(prof, result.ranked)}</span></div>
        <div class="tag-group">${prof.skills.map(s => `<span>${s}</span>`).join("")}</div>
        <div class="subject-line"><strong>Предметы:</strong> ${prof.subjects.join(" · ")}</div>`;
      profBox.appendChild(card);
    });

    loading.classList.add("hidden");
    content.classList.remove("hidden");
    content.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }, 1200);

  document.getElementById("restartBtn")?.addEventListener("click", () => {
    localStorage.removeItem("profiTrekAnswers");
    window.location.href = "test.html";
  });
}

function whyProfessionFits(prof, ranked) {
  const strongest = Object.entries(prof.weights)
    .sort((a,b) => b[1] - a[1])
    .map(x => x[0])
    .find(key => (ranked.find(r => r.key === key)?.score || 0) > 0);
  const texts = {
    it:"логика, технологии и создание работающих решений",
    engineering:"системное мышление и интерес к практическим решениям",
    medicine:"интерес к человеку, науке и помощи другим",
    science:"любознательность, анализ и поиск закономерностей",
    business:"инициативность, цели и превращение идей в результат",
    finance:"аналитика, числа и внимание к деталям",
    marketing:"коммуникация, аудитория и креативное мышление",
    design:"креативность, визуальное мышление и внимание к людям",
    media:"интерес к историям, информации и коммуникации",
    law:"логика, аргументация и работа с правилами",
    education:"интерес к людям, объяснению и развитию других",
    psychology:"интерес к людям, эмпатия и анализ поведения",
    government:"ответственность, правила и общественные задачи"
  };
  return `тебе близки ${texts[strongest] || "навыки, связанные с этой сферой"}.`;
}

/* ---------- Каталог профессий ---------- */

function initProfessionCatalog() {
  const filters = document.getElementById("professionFilters");
  const grid = document.getElementById("professionGrid");
  const empty = document.getElementById("emptyState");

  let active = "Все";

  professionCategories.forEach(category => {
    const button = document.createElement("button");
    button.className = `filter-btn ${category === active ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      active = category;
      filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      renderCatalog();
    });
    filters.appendChild(button);
  });

  function renderCatalog() {
    const list = active === "Все" ? professions : professions.filter(p => p.category === active);
    grid.innerHTML = "";
    empty.classList.toggle("hidden", list.length !== 0);

    list.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "catalog-card";
      card.innerHTML = `
        <div class="catalog-card-top"><span class="category-chip">${p.category}</span><span class="card-number">${String(i + 1).padStart(2,"0")}</span></div>
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <div class="catalog-info"><strong>Навыки</strong><div class="tag-group">${p.skills.map(s => `<span>${s}</span>`).join("")}</div></div>
        <div class="catalog-info"><strong>Школьные предметы</strong><p class="subject-text">${p.subjects.join(" · ")}</p></div>
        <button class="catalog-more" type="button" aria-label="Подробнее о профессии ${p.name}">Подробнее →</button>`;
      card.querySelector(".catalog-more").addEventListener("click", () => {
        card.classList.toggle("expanded");
        const btn = card.querySelector(".catalog-more");
        btn.textContent = card.classList.contains("expanded") ? "Свернуть ↑" : "Подробнее →";
      });
      grid.appendChild(card);
    });
  }

  renderCatalog();
}