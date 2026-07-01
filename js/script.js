// ============ Mobile nav toggle ============
(function () {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  const menuIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  const closeIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = isOpen ? closeIcon : menuIcon;
  });
})();

// ============ Video card rendering ============
function isPlaceholderId(id) {
  return !id || id.startsWith("YOUR_VIDEO_ID");
}

function videoCardHTML(video) {
  const placeholder = isPlaceholderId(video.youtubeId) && !video.thumbnail;
  const thumbUrl = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const showHint = isPlaceholderId(video.youtubeId);
  return `
    <article class="video-card">
      <div class="video-thumb${placeholder ? " no-thumb" : ""}" data-id="${video.youtubeId}" role="button" tabindex="0"
           aria-label="تشغيل: ${video.title}">
        ${
          placeholder
            ? ""
            : `<img src="${thumbUrl}" alt=""
             onerror="this.style.display='none'; this.parentElement.classList.add('no-thumb');">`
        }
        <span class="play-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
        ${showHint ? `<span class="thumb-hint"><span>أضف رابط الفيديو</span></span>` : ""}
      </div>
      <div class="video-info">
        <span class="video-cat">${video.category}</span>
        <p class="video-title">${video.title}</p>
        <p class="video-meta">${video.channel} · ${video.duration}</p>
      </div>
    </article>
  `;
}

function attachVideoPlayHandlers(container) {
  container.querySelectorAll(".video-thumb").forEach((thumb) => {
    const play = () => {
      const id = thumb.getAttribute("data-id");
      if (isPlaceholderId(id)) return; // no real video assigned yet
      const card = thumb.closest(".video-card");
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      iframe.title = "مشغل فيديو يوتيوب";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      thumb.replaceWith(iframe);
      card.querySelector(".video-title") && card.querySelector(".video-title").focus?.();
    };
    thumb.addEventListener("click", play);
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    });
  });
}

function renderVideoGrid(container, videos) {
  if (!container) return;
  if (!videos.length) {
    container.innerHTML = `<p class="status-msg">لا توجد فيديوهات في هذا التصنيف حالياً.</p>`;
    return;
  }
  container.innerHTML = videos.map(videoCardHTML).join("");
  attachVideoPlayHandlers(container);
}

// Home page: show first 3 videos
(function () {
  const homeGrid = document.getElementById("homeVideoGrid");
  if (homeGrid && typeof VIDEOS !== "undefined") {
    renderVideoGrid(homeGrid, VIDEOS.slice(0, 3));
  }
})();

// Videos page: full grid with filter + search
(function () {
  const grid = document.getElementById("videoGrid");
  if (!grid || typeof VIDEOS === "undefined") return;

  const filterWrap = document.getElementById("filterChips");
  const searchInput = document.getElementById("videoSearch");
  let activeCategory = "الكل";
  let query = "";

  function applyFilters() {
    const filtered = VIDEOS.filter((v) => {
      const matchesCategory = activeCategory === "الكل" || v.category === activeCategory;
      const matchesQuery = v.title.includes(query) || v.channel.includes(query);
      return matchesCategory && matchesQuery;
    });
    renderVideoGrid(grid, filtered);
  }

  if (filterWrap && typeof CATEGORIES !== "undefined") {
    filterWrap.innerHTML = CATEGORIES.map(
      (cat) =>
        `<button class="filter-chip${cat === "الكل" ? " active" : ""}" data-cat="${cat}">${cat}</button>`
    ).join("");
    filterWrap.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        filterWrap.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeCategory = chip.getAttribute("data-cat");
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value.trim();
      applyFilters();
    });
  }

  applyFilters();
})();

// ============ Quran: surah list (home preview + quran page) ============
async function fetchSurahList() {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  if (!res.ok) throw new Error("تعذر تحميل قائمة السور");
  const data = await res.json();
  return data.data; // array of 114 surahs
}

function surahRowHTML(surah) {
  return `
    <li class="surah-item" data-number="${surah.number}" role="button" tabindex="0">
      <span class="surah-num">${surah.number}</span>
      <span class="surah-name">
        ${surah.englishName}
        <span class="surah-meta">${surah.revelationType === "Meccan" ? "مكية" : "مدنية"} · ${surah.numberOfAyahs} آية</span>
      </span>
      <span class="surah-name-ar">${surah.name}</span>
    </li>
  `;
}

// Home preview: first 5 surahs
(function () {
  const list = document.getElementById("surahPreviewList");
  if (!list) return;
  fetchSurahList()
    .then((surahs) => {
      list.innerHTML = surahs.slice(0, 5).map(surahRowHTML).join("");
    })
    .catch(() => {
      list.innerHTML = `<li class="status-msg">تعذر تحميل قائمة السور، تحقق من الاتصال بالإنترنت.</li>`;
    });
})();

// Quran page: full list + reader
(function () {
  const list = document.getElementById("surahFullList");
  const reader = document.getElementById("ayahReader");
  const readerTitle = document.getElementById("readerSurahName");
  const reciterSelect = document.getElementById("reciterSelect");
  const searchInput = document.getElementById("surahSearch");
  if (!list) return;

  let allSurahs = [];

  const RECITERS = {
    "ar.alafasy": "مشاري العفاسي",
    "ar.husary": "محمود خليل الحصري",
    "ar.minshawi": "محمد صديق المنشاوي"
  };

  if (reciterSelect) {
    reciterSelect.innerHTML = Object.entries(RECITERS)
      .map(([id, name]) => `<option value="${id}">${name}</option>`)
      .join("");
  }

  async function loadSurah(number) {
    reader.innerHTML = `<p class="status-msg">جارٍ تحميل السورة…</p>`;
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`);
      const data = await res.json();
      const surah = data.data;
      readerTitle.textContent = `${surah.name} — ${surah.englishName}`;
      const reciter = reciterSelect ? reciterSelect.value : "ar.alafasy";
      reader.innerHTML = `
        <div class="reader-toolbar">
          <audio controls style="width:100%; max-width:360px;">
            <source src="https://cdn.islamic.network/quran/audio-surah/128/${reciter}/${number}.mp3" type="audio/mpeg">
            متصفحك لا يدعم تشغيل الصوت.
          </audio>
        </div>
        ${surah.ayahs
          .map(
            (ayah) => `
          <div class="ayah">
            <span class="ayah-num">${ayah.numberInSurah}</span>
            <p class="ayah-text">${ayah.text}</p>
          </div>`
          )
          .join("")}
      `;
    } catch {
      reader.innerHTML = `<p class="status-msg">تعذر تحميل السورة، حاول مرة أخرى.</p>`;
    }
  }

  function renderList(surahs) {
    list.innerHTML = surahs.map(surahRowHTML).join("");
    list.querySelectorAll(".surah-item").forEach((item) => {
      const open = () => loadSurah(item.getAttribute("data-number"));
      item.addEventListener("click", open);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  }

  fetchSurahList()
    .then((surahs) => {
      allSurahs = surahs;
      renderList(allSurahs);
      loadSurah(1);
    })
    .catch(() => {
      list.innerHTML = `<li class="status-msg">تعذر تحميل قائمة السور، تحقق من الاتصال بالإنترنت.</li>`;
    });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim();
      const filtered = allSurahs.filter(
        (s) => s.name.includes(q) || s.englishName.toLowerCase().includes(q.toLowerCase())
      );
      renderList(filtered);
    });
  }

  if (reciterSelect) {
    reciterSelect.addEventListener("change", () => {
      const current = reader.querySelector(".ayah-num");
      if (readerTitle.textContent) loadSurah(list.querySelector(".surah-item")?.getAttribute("data-number") || 1);
    });
  }
})();

// ============ Prayer times ============
(function () {
  const nameEl = document.getElementById("nextPrayerName");
  const listEl = document.getElementById("prayerTimesList");
  if (!nameEl || !listEl) return;

  const PRAYER_LABELS = {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };

  function renderTimes(timings) {
    const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();

    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let nextKey = order.find((k) => toMinutes(timings[k]) > nowMinutes) || order[0];

    nameEl.textContent = PRAYER_LABELS[nextKey];
    listEl.innerHTML = order
      .map(
        (k) =>
          `<li class="${k === nextKey ? "now" : ""}"><span>${PRAYER_LABELS[k]}</span><span>${timings[k]}</span></li>`
      )
      .join("");
  }

  async function fetchTimings(lat, lon) {
    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
    );
    const data = await res.json();
    renderTimes(data.data.timings);
  }

  function fallback() {
    // Cairo, Egypt as a sensible default
    fetchTimings(30.0444, 31.2357).catch(() => {
      listEl.innerHTML = `<li class="status-msg" style="color:var(--green-soft)">تعذر تحميل مواقيت الصلاة.</li>`;
    });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchTimings(pos.coords.latitude, pos.coords.longitude).catch(fallback),
      fallback,
      { timeout: 5000 }
    );
  } else {
    fallback();
  }
})();
