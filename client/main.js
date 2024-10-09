let scrolling = false;
let lastPage = 0;
const N = 5;

$(window).scroll(() => {
  var s = $(this).scrollTop(),
    d = $(document).height(),
    c = $(this).height();
  update(s / (d - c));
});

update(scrollPercent);

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

  let scale = 1;
  for (let i = 0; i < N - page; i++) {
    $("#page" + (page + i)).css({
      transform: "scale(" + 1 / (-scrollPercent * 4 + page + i + 1) + ")",
    });
    scale /= 3;
  }

  $("#page" + page).css({ opacity: Math.min(1, 1 - 2 * dist) });

  for (let i = 0; i < page; i++) {
    $("#page" + i).css({
      transform: "scale(0)",
    });
  }
}
