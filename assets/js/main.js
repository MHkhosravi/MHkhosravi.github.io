(function() {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const header = document.querySelector("#header");
  const headerToggleBtn = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelectorAll("#navmenu a");
  const scrollTop = document.querySelector("#scroll-top");

  function toggleHeader() {
    if (!header || !headerToggleBtn) return;
    const icon = headerToggleBtn.querySelector("i");
    header.classList.toggle("header-show");
    headerToggleBtn.setAttribute("aria-expanded", header.classList.contains("header-show").toString());
    if (icon) {
      icon.classList.toggle("bi-list");
      icon.classList.toggle("bi-x");
    }
  }

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener("click", toggleHeader);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (header && header.classList.contains("header-show")) {
        toggleHeader();
      }
    });
  });

  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  function toggleScrollTop() {
    if (!scrollTop) return;
    if (window.scrollY > 120) {
      scrollTop.classList.add("active");
    } else {
      scrollTop.classList.remove("active");
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
    window.addEventListener("load", toggleScrollTop);
    document.addEventListener("scroll", toggleScrollTop, { passive: true });
  }

  function initAos() {
    if (!window.AOS) return;
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      mirror: false
    });
  }

  window.addEventListener("load", initAos);

  const typedElement = document.querySelector(".typed");
  if (typedElement && window.Typed) {
    const typedItems = typedElement.getAttribute("data-typed-items");
    if (typedItems) {
      new Typed(".typed", {
        strings: typedItems.split(",").map((item) => item.trim()),
        loop: true,
        typeSpeed: 96,
        backSpeed: 42,
        backDelay: 2600,
        startDelay: 600,
        smartBackspace: true,
        showCursor: false
      });
    }
  }

  function correctHashScroll() {
    if (!window.location.hash) return;
    const section = document.querySelector(window.location.hash);
    if (!section) return;
    setTimeout(() => {
      const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
      window.scrollTo({
        top: section.offsetTop - scrollMarginTop,
        behavior: "smooth"
      });
    }, 100);
  }

  window.addEventListener("load", correctHashScroll);

  function navmenuScrollspy() {
    const position = window.scrollY + 220;
    navLinks.forEach((link) => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;

      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navLinks.forEach((activeLink) => activeLink.classList.remove("active"));
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy, { passive: true });

  // Publications: fetch, render, and filter
  (function () {
    const listEl = document.getElementById("publication-list");
    const countEl = document.getElementById("pub-count");
    const filterBtns = document.querySelectorAll(".pub-filter");
    if (!listEl) return;

    function authorHtml(authors) {
      return authors
        .map((a) => (a.includes("Khosravi") ? `<strong>${a}</strong>` : a))
        .join(", ");
    }

    function renderPubs(pubs, year) {
      const filtered =
        year === "all" ? pubs : pubs.filter((p) => p.year === parseInt(year, 10));

      if (countEl) {
        const n = filtered.length;
        countEl.textContent =
          year === "all"
            ? `Showing all ${n} publications`
            : `${n} publication${n !== 1 ? "s" : ""} in ${year}`;
      }

      listEl.innerHTML = filtered
        .map((p) => {
          const badgeClass =
            p.type === "journal" ? "pub-badge--journal" : "pub-badge--conference";
          const badgeLabel = p.type === "journal" ? "Journal" : "Conference";

          const linkHtml = p.url
            ? `<div class="pub-links">
                <a href="${p.url}" target="_blank" rel="noopener">
                  <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
                  ${p.doi ? "DOI: " + p.doi : p.linkLabel || "View paper"}
                </a>
               </div>`
            : "";
          const noteHtml = p.note
            ? `<p class="pub-note"><i class="bi bi-award" aria-hidden="true"></i>${p.note}</p>`
            : "";

          return `<article class="pub-item">
            <div class="pub-meta">
              <span class="pub-badge ${badgeClass}">${badgeLabel}</span>
              <span class="pub-year">${p.year}</span>
            </div>
            <h3 class="pub-title">${p.title}</h3>
            <p class="pub-authors">${authorHtml(p.authors)}</p>
            <p class="pub-venue">${p.venue}</p>
            ${noteHtml}
            ${linkHtml}
          </article>`;
        })
        .join("");
    }

    var pubDataEl = document.getElementById("pub-data");
    var pubs = pubDataEl ? JSON.parse(pubDataEl.textContent) : [];

    renderPubs(pubs, "all");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderPubs(pubs, btn.dataset.year);
      });
    });
  })();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-label");
  const root = document.documentElement;

  function applyTheme(isDark) {
    if (isDark) {
      root.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.className = "bi bi-moon-fill ti-icon";
      if (themeLabel) themeLabel.textContent = "Light Mode";
      if (themeToggle) themeToggle.setAttribute("aria-pressed", "true");
    } else {
      root.removeAttribute("data-theme");
      if (themeIcon) themeIcon.className = "bi bi-sun-fill ti-icon";
      if (themeLabel) themeLabel.textContent = "Dark Mode";
      if (themeToggle) themeToggle.setAttribute("aria-pressed", "false");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  // Sync button state with theme already applied by inline head script
  if (root.getAttribute("data-theme") === "dark") {
    if (themeIcon) themeIcon.className = "bi bi-moon-fill ti-icon";
    if (themeLabel) themeLabel.textContent = "Light Mode";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", "true");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") !== "dark");
    });
  }
})();
