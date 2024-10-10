let scrolling = false;
let lastPage = 0;
const N = 5;

document.addEventListener("scroll", (event) => {
  update(getScrollPercent());
});

function getScrollPercent() {
  var h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

update(getScrollPercent());

function update(scrollPercent) {
  const page = Math.round((N - 1) * scrollPercent);
  const dist = (N - 1) * scrollPercent - page;
  if (scrolling && Math.abs(dist) < 0.3) {
    document
      .getElementById("scroll_page" + page)
      .scrollIntoView({ behavior: "smooth" });
    scrolling = false;
  }

  if (Math.abs(dist) > 0.3 || lastPage != page) {
    scrolling = true;
    lastPage = page;
  }

  const linear = (x) => 0.5 * x + 0.5;

  let scale = 1;
  for (let i = 0; i < N - page; i++) {
    document.querySelector("#page" + (page + i)).style.display = "inherit";
    document.querySelector("#page" + (page + i)).style.transform =
      "scale(" + 1 / linear(-scrollPercent * 4 + page + i + 1) + ")";
    scale /= 3;
  }

  document.querySelector("#page" + page).style.opacity = Math.min(
    1,
    1 - 2 * dist
  );

  for (let i = 0; i < page; i++) {
    document.querySelector("#page" + i).style.display = "none";
  }
}
