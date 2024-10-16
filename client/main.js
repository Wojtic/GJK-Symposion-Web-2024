const N = 6;
const N_SCROLL = 15;
let page = 0;

let cursorX = 0;
let cursorY = 0;

const body = document.body;
const html = document.documentElement;

let vw = Math.max(html.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(html.clientHeight || 0, window.innerHeight || 0);

document.addEventListener("scroll", (event) => {
  update(getScrollPercent());
});

function assignZIndex() {
  for (let i = 0; i < N; i++) {
    document.querySelector("#page" + i).style.zIndex = (N + page - i - 1) % N;
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  html.style.scrollBehavior = "initial";
  document.getElementById("scroll_page8").scrollIntoView();
  html.style.scrollBehavior = "smooth";
  assignZIndex();
  update(getScrollPercent());
  cover = document.getElementById("cover");
  cover.style.animation = "fade_out 1s linear 1";
  cover.addEventListener("animationend", () => {
    cover.style.display = "none";
  });
});

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
  vw = Math.max(html.clientWidth || 0, window.innerWidth || 0);
  vh = Math.max(html.clientHeight || 0, window.innerHeight || 0);
  cursorX = event.clientX / vw - 0.5;
  cursorY = event.clientY / vh - 0.5;

  update(getScrollPercent());
}

function getScrollPercent() {
  var h = html,
    b = body,
    st = "scrollTop",
    sh = "scrollHeight";
  return 1 - (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

function update(scrollPercent) {
  const scrolledPage = Math.round((N_SCROLL - 1) * scrollPercent);
  const dist =
    (N_SCROLL - 1) * scrollPercent - Math.round((N_SCROLL - 1) * scrollPercent);
  if (
    Math.abs(dist) < 0.01 &&
    (scrolledPage >= N_SCROLL - 2 || scrolledPage <= 1)
  ) {
    //FIX: Needed for mobile, can't scroll to the bottom
    html.style.scrollBehavior = "initial";
    document.getElementById("scroll_page7").scrollIntoView();
    html.style.scrollBehavior = "smooth";
  }

  setCSS(scrollPercent);
}

function setCSS(scrollPercent) {
  page = Math.round((N_SCROLL - 1) * scrollPercent) % N;
  const linear = (x) => 0.5 * x + 0.5;

  assignZIndex();

  for (let j = 0; j < N; j++) {
    let curPage = (N + page + j) % N;
    const scale =
      1 /
      linear(
        -scrollPercent * (N_SCROLL - 1) +
          Math.round((N_SCROLL - 1) * scrollPercent) +
          j +
          1
      );

    const dist =
      (N_SCROLL - 1) * scrollPercent -
      Math.round((N_SCROLL - 1) * scrollPercent);

    document.querySelector("#page" + curPage).style.display = "inherit";
    document.querySelector("#page" + curPage).style.opacity =
      j == 0 ? Math.min(1, 1 - 2 * dist) : "1";
    document.querySelector("#page" + curPage).style.translate =
      Math.round(-cursorX * vw * j * 0.05) +
      "px " +
      Math.round(-cursorY * vh * j * 0.05) +
      "px";
    document.querySelector("#page" + curPage).style.transform =
      "scale(" + scale + ")";
  }
}
