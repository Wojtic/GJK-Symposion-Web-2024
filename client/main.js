let scrolling = false;
let lastPage = 0;
const N = 7*2-1;

let cursorX = 0;
let cursorY = 0;

const body = document.body;
const html = document.documentElement;

let vw = Math.max(
  html.clientWidth || 0,
  window.innerWidth || 0
);
let vh = Math.max(
  html.clientHeight || 0,
  window.innerHeight || 0
);

document.addEventListener("scroll", (event) => {
  update(getScrollPercent());
});

function copyPage() {
  toPaste = document.getElementsByClassName("copy");
  for(var i = 0; i < toPaste.length; i++){
    toPaste[i].innerHTML = document.getElementById(toPaste[i].id.split("_")[2]).innerHTML;
    toPaste[i].id = toPaste[i].id.split("_")[0];
  }
}

function assignZIndex() {
  pages = document.getElementsByClassName("page");
  console.log(pages);
  for(var i = 0; i < pages.length; i++){
    pages[i].style.zIndex = (pages.length - i + 4).toString();
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  copyPage();
  html.style.scrollBehavior = "initial";
  document
    .getElementById("scroll_page5")
    .scrollIntoView();
  html.style.scrollBehavior = "smooth";
  assignZIndex();
  update(getScrollPercent());
  cover = document.getElementById("cover");
  cover.style.animation = "fade_out 1s linear 1";
  cover.addEventListener('animationend', () => {
    cover.style.display = "none";
  });
});

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
  vw = Math.max(
    html.clientWidth || 0,
    window.innerWidth || 0
  );
  vh = Math.max(
    html.clientHeight || 0,
    window.innerHeight || 0
  );
  cursorX = event.clientX / vw - 0.5;
  cursorY = event.clientY / vh - 0.5;

  update(getScrollPercent());
}

function getScrollPercent() {
  var h = html,
    b = body,
    st = "scrollTop",
    sh = "scrollHeight";
  return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

function update(scrollPercent) {
  scrollPercent = 1 - scrollPercent;
  const page = Math.round((N - 1) * scrollPercent);
  const dist = (N - 1) * scrollPercent - page;
  if (scrollPercent == 1 || scrollPercent == 0){ //FIX: Needed for mobile, can't scroll to the bottom
    html.style.scrollBehavior = "initial";
    document
      .getElementById("scroll_page5")
      .scrollIntoView();
    html.style.scrollBehavior = "smooth";
  }

  const linear = (x) => 0.5 * x + 0.5;

  let scale = 1;
  for (var i = 0; i < N - page; i++) {
    document.querySelector("#page" + (page + i)).style.display = "inherit";
    document.querySelector("#page" + (page + i)).style.translate =
      Math.round(-cursorX * vw * i * 0.05) +
      "px " +
      Math.round(-cursorY * vh * i * 0.05) +
      "px";
    document.querySelector("#page" + (page + i)).style.transform =
      "scale(" + 1 / linear(-scrollPercent * (N-1) + page + i + 1) + ")";
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