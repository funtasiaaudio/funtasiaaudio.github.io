/* FUNtasia Studio expansion packs: accessible category filters and sorting. */
(() => {
  "use strict";
  const browser = document.querySelector("[data-pack-browser]");
  const list = document.getElementById("pack-list");
  if (!browser || !list) return;

  const cards = Array.from(list.querySelectorAll(".expansion-card[data-pack-type]"));
  const buttons = Array.from(browser.querySelectorAll("[data-pack-filter]"));
  const sortSelect = browser.querySelector("[data-pack-sort]");
  const resultText = document.querySelector("[data-pack-results]");
  const emptyText = document.querySelector("[data-pack-empty]");
  const counts = Array.from(browser.querySelectorAll("[data-pack-count]"));
  if (!cards.length || !sortSelect || !resultText || !emptyText) return;

  const ja = document.documentElement.lang.toLowerCase().startsWith("ja");
  const validTypes = new Set(["all", "midi", "sample", "wavetable", "library"]);
  let activeType = "all";
  let activeSort = "featured";

  function readQuery() {
    const query = new URL(window.location.href).searchParams;
    const type = query.get("type") || "all";
    activeType = validTypes.has(type) ? type : "all";
    activeSort = query.get("sort") === "name" ? "name" : "featured";
  }

  function writeQuery() {
    const url = new URL(window.location.href);
    if (activeType === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", activeType);
    if (activeSort === "featured") url.searchParams.delete("sort");
    else url.searchParams.set("sort", activeSort);
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
  }

  function render(updateUrl = false) {
    const ordered = cards.slice().sort((a, b) => {
      if (activeSort === "name") {
        return a.querySelector("h3").textContent.trim().localeCompare(
          b.querySelector("h3").textContent.trim(), ja ? "ja" : "en"
        );
      }
      return Number(a.dataset.packOrder) - Number(b.dataset.packOrder);
    });

    for (const card of ordered) {
      list.appendChild(card);
      card.hidden = activeType !== "all" && card.dataset.packType !== activeType;
      card.classList.remove("is-first-visible");
    }

    const firstVisible = ordered.find(card => !card.hidden);
    if (firstVisible) firstVisible.classList.add("is-first-visible");

    buttons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.packFilter === activeType));
    });
    counts.forEach(counter => {
      const type = counter.dataset.packCount;
      const total = type === "all" ? cards.length : cards.filter(card => card.dataset.packType === type).length;
      counter.textContent = String(total);
    });
    sortSelect.value = activeSort;

    const visible = ordered.filter(card => !card.hidden).length;
    resultText.textContent = ja
      ? `${visible} / ${cards.length} パックを表示`
      : `Showing ${visible} of ${cards.length} packs`;
    resultText.hidden = false;
    emptyText.hidden = visible !== 0;
    browser.hidden = false;
    if (updateUrl) writeQuery();
  }

  buttons.forEach(button => button.addEventListener("click", () => {
    activeType = button.dataset.packFilter;
    render(true);
  }));
  sortSelect.addEventListener("change", () => {
    activeSort = sortSelect.value === "name" ? "name" : "featured";
    render(true);
  });
  window.addEventListener("popstate", () => {
    readQuery();
    render(false);
  });

  readQuery();
  render(false);
})();
