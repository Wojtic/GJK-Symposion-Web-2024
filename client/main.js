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

function generateFrames(id = "page") {
  let n = N;
  const shuffle = (a) => {
    for (var j, i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const shuffled = shuffle([...Array(N).keys()]);
  const smallerSideFrameSizes = [
    "100%",
    "78px",
    "100%",
    "21px",
    "191px",
    "114px",
  ];
  if (id != "page") {
    n = 1;
  }
  for (let i = 0; i < n; i++) {
    const R = document.querySelector("#" + id + i + " .frame .right");
    const L = document.querySelector("#" + id + i + " .frame .left");
    const D = document.querySelector("#" + id + i + " .frame .bottom .middle");
    const U = document.querySelector("#" + id + i + " .frame .top .middle");
    const UR = document.querySelector(
      "#" + id + i + " .frame .top .c_top_right"
    );
    const UL = document.querySelector(
      "#" + id + i + " .frame .top .c_top_left"
    );
    const DR = document.querySelector("#" + id + i + " .frame .c_bottom_right");
    const DL = document.querySelector("#" + id + i + " .frame .c_bottom_left");
    R.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/R.jpg)";
    R.style.backgroundSize = " 100%" + smallerSideFrameSizes[shuffled[i]];
    L.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/L.jpg)";
    L.style.backgroundSize = " 100%" + smallerSideFrameSizes[shuffled[i]];
    D.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/D.jpg)";
    D.style.backgroundSize = smallerSideFrameSizes[shuffled[i]] + " 100%";
    U.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/U.jpg)";
    U.style.backgroundSize = smallerSideFrameSizes[shuffled[i]] + " 100%";
    UR.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/UR.jpg)";
    UR.style.backgroundSize = "100% 100%";
    UL.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/UL.jpg)";
    UL.style.backgroundSize = "100% 100%";
    DR.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/DR.jpg)";
    DR.style.backgroundSize = "100% 100%";
    DL.style.backgroundImage = "url(./media/frames/" + shuffled[i] + "/DL.jpg)";
    DL.style.backgroundSize = "100% 100%";
  }
}

var bouncingEl = document.getElementsByClassName("bouncing");
var bouncingElDir = [];
const navbar = document.getElementsByTagName("nav")[0];
const rightFrame = document.querySelector("#page0 .right");
const bottomFrame = document.querySelector("#page0 .bottom");
const leftFrame = document.querySelector("#page0 .left");
const bounds = [
  navbar.getBoundingClientRect().bottom,
  rightFrame.getBoundingClientRect().left,
  bottomFrame.getBoundingClientRect().top,
  leftFrame.getBoundingClientRect().right,
]; //TopRightBottomLeft

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
  for (let i = 0; i < bouncingEl.length; i++) {
    bouncingElDir.push([Math.random() * 2 - 1, Math.random() * 2 - 1]);
    bouncingEl[i].style.top =
      (
        navbar.getBoundingClientRect().bottom +
        ((document.documentElement.clientHeight * 0.92 -
          navbar.getBoundingClientRect().bottom) /
          (bouncingEl.length + 2)) *
          (i + 1)
      ).toString() + "px";
    bouncingEl[i].style.left =
      (
        document.documentElement.clientWidth / 2 -
        bouncingEl[i].getBoundingClientRect().width / 2
      ).toString() + "px";
  }
  document.querySelector("footer").addEventListener("click", () => {
    const overlay = document.getElementById("frame_overlay0");
    overlay.style.scale = "1";
    generateFrames((id = "frame_overlay"));
    var video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");

    var constraints = {
      audio: false,
      video: {
        facingMode: "user",
      },
    };

    /* Stream it to video element */
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function success(stream) {
        video.srcObject = stream;
      });
    document.querySelector("#frame_overlay0 .horizontal").appendChild(video);
    document.querySelector("#frame_overlay0 .content").style.display = "none";

    overlay.addEventListener("click", function eventHandler() {
      document.querySelector("#frame_overlay0 .horizontal").removeChild(video);
      document.querySelector("#frame_overlay0 .content").style.display =
        "inherit";
      this.style.scale = 0;
      this.removeEventListener("click", eventHandler);
    });
  });
  generateFrames();
}

function bouncingText() {
  const speed = Math.log(document.documentElement.clientWidth / 600) * 4 + 4;
  for (let i = 0; i < bouncingEl.length; i++) {
    if (bouncingEl[i].getBoundingClientRect().left < bounds[3])
      bouncingElDir[i][1] = Math.abs(bouncingElDir[i][1]);
    if (bouncingEl[i].getBoundingClientRect().right > bounds[1])
      bouncingElDir[i][1] = -Math.abs(bouncingElDir[i][1]);
    if (bouncingEl[i].getBoundingClientRect().top < bounds[0])
      bouncingElDir[i][0] = Math.abs(bouncingElDir[i][0]);
    if (bouncingEl[i].getBoundingClientRect().bottom > bounds[2])
      bouncingElDir[i][0] = -Math.abs(bouncingElDir[i][0]);
    bouncingEl[i].style.top =
      (
        parseFloat(bouncingEl[i].style.top.split("px")[0]) +
        bouncingElDir[i][0] * speed
      ).toString() + "px";
    bouncingEl[i].style.left =
      (
        parseFloat(bouncingEl[i].style.left.split("px")[0]) +
        bouncingElDir[i][1] * speed
      ).toString() + "px";
  }
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
  const replikaASCII = `\n  _____            _ _ _         \n |  __ \\          | (_) |        \n | |__) |___ _ __ | |_| | ____ _ \n |  _  // _ \\ '_ \\| | | |/ / _´ |\n | | \\ \\  __/ |_) | | |   < (_| |\n |_|  \\_\\___| .__/|_|_|_|\\_\\__,_|\n            | |                  \n            |_|`;
  for (let i = 1; i < Math.round(Math.random() * 10); i++) {
    console.log(replikaASCII.repeat(i));
  }

  fill_harmonogram();
});
let names = [];
let times = [];
let rooms = [];
let medailons = [];
let annotations = [];
let titles = [];
let parsedTable = [];

let evening_events = [[], [], []];

function evening_popup(day) {
  /*
  for (let i = 0; i < evening_events[day].length; i++) {

    console.log(evening_events[day]);
  }*/
  const overlay = document.getElementById("frame_evening_overlay0");
  if (day == 0) {
    document.getElementById("evening_ctvrtek").style.display = "unset";
    document.getElementById("evening_patek").style.display = "none";
  } else {
    document.getElementById("evening_ctvrtek").style.display = "none";
    document.getElementById("evening_patek").style.display = "unset";
  }
  overlay.style.scale = "1";
  generateFrames((id = "frame_evening_overlay"));
}

async function fetchDirectly() {
  /*const URL =
    "https://docs.google.com/spreadsheets/d/1lat6R_n_AQRJp1Jztt5YHqsjl9AmY8mEuTLvroDnRiU/export?format=csv";
  if (parsedTable.length > 0) return parsedTable;
  let csv = await fetch(URL);
  csv = parseCSV(await csv.text());
*/

  const DAY_LENGTHS = [5, 6, 3];
  const ROOM_NAMES = ["P1.1", "P2.2", "Aula", "Sborovna", "USV", "P2.3"];
  const ROOMS = ROOM_NAMES.length;
  for (let i = 1; i < DAY_LENGTHS.reduce((a, b) => a + b * ROOMS, 0) + 1; i++) {
    names.push(csv[i][4] == "-" ? "" : csv[i][4]);
    times.push(csv[i][5]);
    rooms.push(csv[i][6]);
    medailons.push(csv[i][7]);
    annotations.push(csv[i][8]);
    titles.push(csv[i][9]);
  }

  const create_table = () => {
    let day_offset = 0;
    let days = [];
    for (let day = 0; day < 3; day++) {
      let day_table = {};
      for (let room = 0; room < ROOMS; room++) {
        table_row = [];
        for (let time = 0; time < DAY_LENGTHS[day]; time++) {
          let index = day_offset + time * ROOMS + room;
          table_row.push({
            name: names[index],
            title: titles[index],
            id: index,
          });
        }
        day_table[ROOM_NAMES[room]] = table_row;
      }
      days.push(day_table);
      day_offset += DAY_LENGTHS[day] * ROOMS;
    }
    return days;
  };

  parsedTable = create_table();

  return parsedTable;
}

function parseCSV(str) {
  const arr = [];
  let quote = false;
  for (let row = 0, col = 0, c = 0; c < str.length; c++) {
    let cc = str[c],
      nc = str[c + 1];
    arr[row] = arr[row] || [];
    arr[row][col] = arr[row][col] || "";
    if (cc == '"' && quote && nc == '"') {
      arr[row][col] += cc;
      ++c;
      continue;
    }
    if (cc == '"') {
      quote = !quote;
      continue;
    }
    if (cc == "," && !quote) {
      ++col;
      continue;
    }
    if (cc == "\r" && nc == "\n" && !quote) {
      ++row;
      col = 0;
      ++c;
      continue;
    }
    if (cc == "\n" && !quote) {
      ++row;
      col = 0;
      continue;
    }
    if (cc == "\r" && !quote) {
      ++row;
      col = 0;
      continue;
    }
    arr[row][col] += cc;
  }
  return arr;
}

async function fill_harmonogram() {
  const getData = async () => {
    const time = new Date().getTime();
    const url =
      "https://api-795043680894.europe-central2.run.app/harmonogram?t=" + time;
    let data;
    try {
      data = await cachedFetch("harmonogram", url, 180);
    } catch {
      data = await fetchDirectly();
    }
    return data;
  };
  //const data = await getData();
  const data = await fetchDirectly();

  let room_order = ["Aula", "Sborovna", "USV", "P1.1", "P2.2", "P2.3"];
  for (let day = 0; day < 3; day++) {
    const rows = document.querySelectorAll("#table_" + day + " tr");
    for (let room = 0; room < 6; room++) {
      if (day == 2) {
        room_order = ["Sborovna", "USV", "P2.2", "P2.3"];
      }
      if (day == 2 && room >= 4) {
        continue;
      }
      let afterLaunch = 0;
      let room_data = data[day][room_order[room]];
      for (let i = 0; i < room_data.length; i++) {
        if (i > 1 && day != 2) afterLaunch = 1;
        if ((day == 0 && i == 4) || (day == 1 && i == 5)) {
          evening_events[day].push(room_data[i]);
          continue;
        }
        let lecture = room_data[i];
        let onclick =
          lecture.name != "" ? "onclick = showPopup(" + lecture.id + ")" : "";
        rows[i + 1 + afterLaunch].innerHTML +=
          "<td " +
          onclick +
          " id='lecture_" +
          lecture.id +
          "'><p class='presenter'>" +
          lecture.name +
          "</p><p class='lecture'>" +
          lecture.title +
          "</p></td>";
        if (lecture.name != "") {
          document
            .getElementById("lecture_" + lecture.id)
            .classList.add("td_hoverable");
        }
      }
    }
  }
}

async function showPopup(id) {
  /*const getData = async () => {
    const url =
      "https://api-795043680894.europe-central2.run.app/lecture_info?id=" + id;
    try {
      return await cachedFetch("anotace" + id, url, 180);
    } catch {
      if (parsedTable.length == 0) {
        await fetchDirectly();
      }
      return {
        name: names[id],
        title: titles[id],
        annotation: annotations[id],
        medailon: medailons[id],
        room: rooms[id],
        time: times[id],
      };
    }
  };
  const json = await getData();*/
  const json = {
    name: names[id],
    title: titles[id],
    annotation: annotations[id],
    medailon: medailons[id],
    room: rooms[id],
    time: times[id],
  };
  const day_names = { čt: "čtvrtek", pá: "pátek", so: "sobota" };

  const overlay = document.getElementById("frame_overlay0");
  overlay.style.scale = "1";
  document.getElementById("presenting").innerHTML = json.name;
  document.getElementById("presentation").innerHTML = json.title;
  document.getElementById("annotation").innerHTML = json.annotation;
  document.getElementById("medailon").innerHTML = json.medailon;
  document.getElementById("room").innerHTML = json.room;
  document.getElementById("time").innerHTML =
    day_names[json.time.slice(0, 2)] + json.time.substring(2);
  generateFrames((id = "frame_overlay"));
  document.getElementById("medailon").focus();
  return;
}

async function cachedFetch(name, url, refresh_time) {
  let lst = "T_" + name;
  let t = Math.floor(new Date().getTime() / 1000);
  if (lst in localStorage) {
    if (t - localStorage[lst] < refresh_time) {
      console.log(
        "fetch to " + url + " was cached " + (t - localStorage[lst]) + "s ago"
      );
      return JSON.parse(localStorage[name]);
    }
  }
  console.log("fetching " + url);
  let r = await fetch(url);

  try {
    if (r.ok) {
      const json = await r.json();
      localStorage[lst] = t;
      localStorage[name] = JSON.stringify(json);
      return json;
    } else {
      throw new Error("fetch_error");
    }
  } catch (error) {
    console.error(error.message);
    console.error("net_error: " + error);
    if (lst in localStorage) {
      console.log(
        "fallback to cache for " +
          url +
          " from " +
          (t - localStorage[lst]) +
          "s ago"
      );
      return localStorage[name];
    }
  }
}

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

var bouncingTextInterval = setInterval(bouncingText, 50);
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
  if (scrolledPage % 6 == 0 && isNaN(bouncingTextInterval)) {
    bouncingTextInterval = setInterval(bouncingText, 50);
  } else if (scrolledPage % 6 != 0 && bouncingTextInterval != NaN) {
    clearInterval(bouncingTextInterval);
    bouncingTextInterval = NaN;
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
