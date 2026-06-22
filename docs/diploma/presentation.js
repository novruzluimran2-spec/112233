(function () {
  const slides = [...document.querySelectorAll(".slide")];
  const counter = document.getElementById("counter");
  let i = 0;

  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    counter.textContent = `${i + 1} / ${slides.length}`;
    history.replaceState(null, "", `#${i + 1}`);
  }

  document.getElementById("prev").addEventListener("click", () => show(i - 1));
  document.getElementById("next").addEventListener("click", () => show(i + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      show(i + 1);
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      show(i - 1);
    }
    if (e.key === "Home") show(0);
    if (e.key === "End") show(slides.length - 1);
  });

  const hash = parseInt(location.hash.replace("#", ""), 10);
  show(Number.isFinite(hash) && hash > 0 ? hash - 1 : 0);
})();
