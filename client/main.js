let scrolling = false;
const N = 5;

$(window).scroll(update);
update();

function update() {
  var s = $(this).scrollTop(),
    d = $(document).height(),
    c = $(this).height();

  scrollPercent = s / (d - c);
  const page = Math.round((N - 1) * scrollPercent);
  const dist = (N - 1) * scrollPercent - page;
  if (scrolling && Math.abs(dist) < 0.2) {
    document
      .getElementById("scroll_page" + page)
      .scrollIntoView({ behavior: "smooth" });
    scrolling = false;
  }

  if (Math.abs(dist) > 0.2) {
    scrolling = true;
  }

  /*$horizontal.css({
    transform: "scale(" + (position / 100 + 0.5) + ")",
  });*/

  const distFromTop =
    (N - 1) * scrollPercent - Math.floor((N - 1) * scrollPercent);

  let scale = 1;
  console.log(distFromTop);
  for (let i = 0; i < N - page; i++) {
    $("#page" + (page + i)).css({
      transform: "scale(" + 1 / (scrollPercent * 4 - page - i - 1) + ")",
    });
    scale /= 3;
  }

  for (let i = 0; i < page; i++) {
    $("#page" + i).css({
      transform: "scale(" + 0 + ")",
    });
  }
}
