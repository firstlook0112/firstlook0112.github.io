/*!
 * 沈阳鑫龙成门业 — 全站交互
 * 无第三方依赖：导航、移动菜单、产品大菜单、列表筛选、粘性页头。
 */
(function () {
  "use strict";

  var header = document.querySelector("[data-site-header]");
  var nav = document.getElementById("primary-nav");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var main = document.querySelector("main");
  var footer = document.querySelector(".site-footer");
  var mqMobile = window.matchMedia("(max-width: 1080px)");
  var panelItems = Array.prototype.slice.call(
    document.querySelectorAll("[data-panel]")
  );
  var lastFocused = null;

  function isMobile() {
    return mqMobile.matches;
  }

  function syncMegaScrim() {
    if (!header) return;
    header.classList.toggle(
      "mega-open",
      !!document.querySelector("[data-panel].is-open")
    );
  }

  function setPanelState(item, open) {
    item.classList.toggle("is-open", open);
    item.classList.toggle("is-panel-open", open && isMobile());
    var link = item.querySelector("[data-panel-toggle]");
    if (link) link.setAttribute("aria-expanded", String(open));
    syncMegaScrim();
  }

  function closePanels(except) {
    panelItems.forEach(function (item) {
      if (item !== except) setPanelState(item, false);
    });
  }

  function closeNav(returnFocus) {
    if (!header || !menuToggle) return;
    header.classList.remove("nav-open");
    document.body.classList.remove("is-locked");
    if (main) main.inert = false;
    if (footer) footer.inert = false;
    menuToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) menuToggle.focus();
    lastFocused = null;
    closePanels(null);
  }

  function openNav() {
    if (!header || !menuToggle) return;
    lastFocused = document.activeElement;
    header.classList.add("nav-open");
    document.body.classList.add("is-locked");
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    menuToggle.setAttribute("aria-expanded", "true");
    window.setTimeout(function () {
      var firstLink = nav && nav.querySelector("a");
      if (firstLink) firstLink.focus();
    }, 60);
  }

  if (header && menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (header.classList.contains("nav-open")) {
        closeNav(false);
      } else {
        openNav();
      }
    });
  }

  panelItems.forEach(function (item) {
    var toggle = item.querySelector("[data-panel-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", function (event) {
      if (!isMobile()) return;
      event.preventDefault();
      var willOpen = !item.classList.contains("is-open");
      closePanels(item);
      setPanelState(item, willOpen);
    });

    item.addEventListener("mouseenter", function () {
      if (!isMobile()) {
        toggle.setAttribute("aria-expanded", "true");
        item.classList.add("is-open");
        syncMegaScrim();
      }
    });

    item.addEventListener("mouseleave", function () {
      if (!isMobile()) {
        toggle.setAttribute("aria-expanded", "false");
        item.classList.remove("is-open");
        syncMegaScrim();
      }
    });

    item.addEventListener("focusin", function () {
      if (!isMobile()) {
        toggle.setAttribute("aria-expanded", "true");
        item.classList.add("is-open");
        syncMegaScrim();
      }
    });

    item.addEventListener("focusout", function (event) {
      if (!isMobile() && !item.contains(event.relatedTarget)) {
        toggle.setAttribute("aria-expanded", "false");
        item.classList.remove("is-open");
        syncMegaScrim();
      }
    });
  });

  if (nav) {
    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      if (link.hasAttribute("data-panel-toggle") && isMobile()) return;
      if (isMobile()) closeNav(false);
    });
  }

  var navScrim = document.querySelector("[data-nav-scrim]");
  if (navScrim) {
    navScrim.addEventListener("click", function () {
      closeNav(false);
    });
  }

  document.addEventListener("click", function (event) {
    if (!header) return;
    if (!header.contains(event.target)) {
      closePanels(null);
      if (header.classList.contains("nav-open")) closeNav(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var openItem = document.querySelector("[data-panel].is-open");
    if (openItem) {
      setPanelState(openItem, false);
      var toggle = openItem.querySelector("[data-panel-toggle]");
      if (toggle) toggle.focus();
      return;
    }
    if (header && header.classList.contains("nav-open")) {
      closeNav(true);
    }
  });

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* 液态玻璃：指针位置驱动镜面高光 */
  var liquidSelectors = [
    ".site-header__bar",
    ".mega",
    ".dropdown",
    ".page-hero__grid",
    ".product-card",
    ".case-card",
    ".news-card",
    ".solution-card",
    ".filter-rail",
    ".listing-toolbar",
    ".sticky-card",
    ".article-body",
    ".aside-card",
    ".contact-channel",
    ".inquiry-card",
    ".fact-band__item",
    ".value-card",
    ".review-card",
    ".map-frame",
    ".cta-band__inner",
    ".category-strip > .container",
    ".mobile-dock"
  ].join(",");

  var liquidItems = Array.prototype.slice.call(
    document.querySelectorAll(liquidSelectors)
  );

  liquidItems.forEach(function (item) {
    item.classList.add("is-liquid");
    item.addEventListener(
      "pointermove",
      function (event) {
        var rect = item.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        item.style.setProperty(
          "--mx",
          (((event.clientX - rect.left) / rect.width) * 100).toFixed(2) + "%"
        );
        item.style.setProperty(
          "--my",
          (((event.clientY - rect.top) / rect.height) * 100).toFixed(2) + "%"
        );
      },
      { passive: true }
    );

    item.addEventListener("pointerleave", function () {
      item.style.removeProperty("--mx");
      item.style.removeProperty("--my");
    });
  });

  if (mqMobile.addEventListener) {
    mqMobile.addEventListener("change", function () {
      if (!isMobile()) {
        closeNav(false);
        closePanels(null);
      }
    });
  }

  /* 产品 / 案例列表筛选与搜索 */
  var filterRoot = document.querySelector("[data-filter-root]");
  if (filterRoot) {
    var cards = Array.prototype.slice.call(
      filterRoot.querySelectorAll("[data-category]")
    );
    var chips = Array.prototype.slice.call(
      filterRoot.querySelectorAll("[data-filter]")
    );
    var search = filterRoot.querySelector("[data-search]");
    var countEl = filterRoot.querySelector("[data-result-count]");
    var emptyEl = filterRoot.querySelector("[data-empty]");
    var activeFilter = "all";

    var applyFilter = function () {
      var term = search ? search.value.trim().toLowerCase() : "";
      var visible = 0;

      cards.forEach(function (card) {
        var categories = (card.getAttribute("data-category") || "").split(" ");
        var haystack = (
          card.getAttribute("data-search") || card.textContent || ""
        ).toLowerCase();
        var categoryMatch =
          activeFilter === "all" || categories.indexOf(activeFilter) !== -1;
        var termMatch = !term || haystack.indexOf(term) !== -1;
        var show = categoryMatch && termMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (countEl) countEl.textContent = String(visible);
      if (emptyEl) emptyEl.hidden = visible !== 0;
    };

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter") || "all";
        chips.forEach(function (item) {
          var active = item === chip;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        applyFilter();
      });
    });

    if (search) {
      search.addEventListener("input", applyFilter);
      search.addEventListener("search", applyFilter);
    }

    applyFilter();
  }
})();
