let scrolling = false;
let lastPage = 0;
const N = 5*2-1;

let cursorX = 0;
let cursorY = 0;

let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
let vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

document.addEventListener("scroll", (event) => {
  update(getScrollPercent());
});

function copyPage() {
  toPaste = document.getElementsByClassName("copy");
  for(var i=0; i<toPaste.length; i++){
    toPaste[i].innerHTML = document.getElementById(toPaste[i].id.split("_")[2]).innerHTML;
    toPaste[i].id = toPaste[i].id.split("_")[0];
  }
}

window.onload = () => {
  copyPage();
  document
    .getElementById("scroll_page4")
    .scrollIntoView();
  update(getScrollPercent());
  cover = document.getElementById("cover");
  cover.style.animation = "fade_out 1s linear 1";
  cover.addEventListener('animationend', () => {
    cover.style.display = "none";
    document.documentElement.style.scrollBehavior = "smooth";
  });
};

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
  vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  cursorX = event.clientX / vw - 0.5;
  cursorY = event.clientY / vh - 0.5;

  update(getScrollPercent());
}

function getScrollPercent() {
  var h = document.documentElement,
    b = document.body,
    st = "scrollTop",
    sh = "scrollHeight";
  return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
}

function update(scrollPercent) {
  scrollPercent = 1 - scrollPercent;
  const page = Math.round((N - 1) * scrollPercent);
  const dist = (N - 1) * scrollPercent - page;

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
