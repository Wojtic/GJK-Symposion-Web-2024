const N = 6;
const N_SCROLL = 15;
let page = 0;
let lastPage = page;
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let blockUpdates = false;

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

function generateFrames() {
  const shuffle = (a) => {
    for (var j, i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const shuffled = shuffle([...Array(N).keys()]);
  for (let i = 0; i < N; i++) {
    document.querySelector(
      "#page" + i + " .frame .right"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/R.jpg)";
    document.querySelector(
      "#page" + i + " .frame .left"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/L.jpg)";
    document.querySelector(
      "#page" + i + " .frame .bottom .middle"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/D.jpg)";
    document.querySelector(
      "#page" + i + " .frame .top .middle"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/U.jpg)";
    document.querySelector(
      "#page" + i + " .frame .top .c_top_right"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/UR.jpg)";
    document.querySelector(
      "#page" + i + " .frame .top .c_top_left"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/UL.jpg)";
    document.querySelector(
      "#page" + i + " .frame .c_bottom_right"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/DR.jpg)";
    document.querySelector(
      "#page" + i + " .frame .c_bottom_left"
    ).style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/DL.jpg)";
  }
}

function setup() {
  let navigation = "";
  for (let i = 0; i < N; i++) {
    const containerPage = document.querySelector("#page" + i);
    if (i == 0) {
      navigation = containerPage.querySelectorAll("nav")[0].innerHTML;
    } else {
      containerPage.querySelectorAll("nav")[0].innerHTML = navigation;
    }
  }
  generateFrames();
}

document.addEventListener("DOMContentLoaded", function (event) {
  setup();
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  html.style.scrollBehavior = "initial";
  document.getElementById("intro").scrollIntoView();
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
  if (blockUpdates) return;
  const scrolledPage = Math.round((N_SCROLL - 1) * scrollPercent);
  const dist =
    (N_SCROLL - 1) * scrollPercent - Math.round((N_SCROLL - 1) * scrollPercent);
  if (
    scrolledPage - Math.abs(dist) >= N_SCROLL - 2 - 0.05 ||
    scrolledPage + Math.abs(dist) <= 1.05
  ) {
    html.style.scrollBehavior = "initial";
    html.style.scrollSnapType = "none";
    blockUpdates = true;
    document.getElementById("about").scrollIntoView();
    setTimeout(() => {
      blockUpdates = false;
      update();
    }, 200);

    html.style.scrollBehavior = "smooth";
    html.style.scrollSnapType = "y mandatory";
  }

  setCSS(scrollPercent);
}

function setCSS(scrollPercent) {
  if (blockUpdates) return;
  page = Math.round((N_SCROLL - 1) * scrollPercent) % N;
  if (page != lastPage) {
    assignZIndex();
    lastPage = page;
  }
  const linear = (x) => 0.25 * x + 0.75;

  for (let j = 0; j < N; j++) {
    let curPage = (N + page + j) % N;
    if (isNaN(curPage)) continue;

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
    document.querySelector("#page" + curPage).style.transform =
      "scale(" + scale + ")";

    if (isMobile) continue;
    document.querySelector("#page" + curPage).style.translate =
      Math.round(-cursorX * vw * j * 0.05) +
      "px " +
      Math.round(-cursorY * vh * j * 0.05) +
      "px";
  }
}
