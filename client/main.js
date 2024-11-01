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
    const UR = document.querySelector("#" + id + i + " .frame .top .c_top_right");
    const UL = document.querySelector("#" + id + i + " .frame .top .c_top_left");
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
    return;
    document.getElementById("credits_overlay").style.display = "block"; //TODO
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
  /*const replikaASCII = `\n  _____            _ _ _         \n |  __ \\          | (_) |        \n | |__) |___ _ __ | |_| | ____ _ \n |  _  // _ \\ '_ \\| | | |/ / _´ |\n | | \\ \\  __/ |_) | | |   < (_| |\n |_|  \\_\\___| .__/|_|_|_|\\_\\__,_|\n            | |                  \n            |_|`;
  for (let i = 1; i < Math.round(Math.random() * 10); i++) {
    console.log(replikaASCII.repeat(i));
  }*/

  fill_harmonogram();
});

async function cfetch(name, url, refresh_time) {
	let lst="T_"+name;
	let t=Math.floor(new Date().getTime()/1000);
	if(lst in localStorage){
		if(t-localStorage[lst]<refresh_time) {
			console.log("fetch to "+url+" was cached "+(t-localStorage[lst])+"s ago");
			return localStorage[name];
		}
	}
	console.log("fetching "+url);
	let o=await(fetch(url).then((r)=>{
		if(r.ok){
			return r.text();
		}
		throw new Error("fetch_error");
	}).then((o)=>{
		localStorage[lst]=t;
		localStorage[name]=o;
		return o;
	}).catch((e)=>{
		console.error("net_error: "+e);
		if(lst in localStorage){
			console.log("fallback to cache for "+url+" from "+(t-localStorage[lst])+"s ago");
			return localStorage[name];
		}
		return null;
	}));
	return o;
}

function parsecsv(csv) {
	let out = [];
	let rowbuff = [];
	let buff = "";
	let was_q = false;
	let in_q = false;
	for (let i = 0; i < csv.length; i++) {
		let c = csv[i];
		if (c == '"') {
			in_q = !in_q;
			if (in_q && was_q) {
				buff += '"';
			}
		} else if (c == '\n' || (c == ',' && !in_q)) {
			rowbuff.push(buff);
			buff = "";
			if (c == '\n') {
				out.push(rowbuff);
				rowbuff = [];
			}
		} else if (c != '\r') {
			buff += c;
		}
		was_q = c == '"';
	}
	return out;
}

function addelem(par, elem, content) {
	let e = document.createElement(elem);
	if (content != undefined) {
		e.textContent = content;
	}
	return par.appendChild(e);
}
function format_time(utct){
	let d=new Date(utct * 1000);
	return ("00"+d.getDate()).slice(-2)+"."+("00"+(d.getMonth()+1)).slice(-2)+" "+
		("00"+d.getHours()).slice(-2)+":"+("00"+d.getMinutes()).slice(-2)+":"+("00"+d.getSeconds()).slice(-2)
}
async function fill_harmonogram() {
	const url = "https://docs.google.com/spreadsheets/u/0/d/1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g/export?format=csv&id=1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g&gid=478852445";
	const data = parsecsv(await cfetch("harmonogram", url, 480));
	const days = ["čt", "pá", "so"];
	let phase = 0;
	let rooms = [];
	let cells = {};
	let cell_meta = {};
	for (let i = 0; i < data.length; i++) {
		let r = data[i];
		if (phase == 0) {
			phase = 1;
			for (let day = 0; day < 3; day++) {
				const table = document.getElementById("table_"+day);
				addelem(addelem(table, "tr"), "th");
				for (let j = 2; j < r.length; j++) {
					let tr = addelem(table, "tr");
					addelem(tr, "th", r[j]);
					rooms.push(r[j]);
				}
			}
		} else if (phase == 1) {
			if (r[0] == "META") {
				phase = 2;
				continue;
			}
			let start = r[0].split(/[ \t]/);
			let end = r[1];
			let day = days.indexOf(start[0]);
			start = start[start.length-1];
			const table = document.getElementById("table_"+day);
			addelem(table.children.item(0), "th", start);
			for (let j = 2; j < r.length; j++) {
				let tr = table.children.item(j-1);
				let td = addelem(tr, "td");
				addelem(td, "p", r[j]).classList.add("presenter");
				cells[r[j]] = td;
				cell_meta[r[j]] = {room:rooms[j],time:["čtvrtek 14.11.", "pátek 15.11.", "sobota 16.11."][day] + start + "-" + end};
			}
		} else if (r[0].length > 0) {
			let id = r[0];
			let name = r[1];
			addelem(cells[id], "p", name).classList.add("lectureName");
			let room = cell_meta[id].room;
			let time = cell_meta[id].time;
			cells[id].onclick = () => { showPopup(id, time, room, name); };
		}
	}
	for (const fetch_tms of document.getElementsByClassName("fetch_timestamp")) {
		let tm = localStorage["T_harmonogram"];
		fetch_tms.textContent = "Data z " + format_time(tm);
	}
}

async function showPopup(id, time, room, name) {
	const url = "https://docs.google.com/spreadsheets/d/1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g/export?format=csv&id=1JpLMEVMGintaOSQBqE2WIoBIHecXauFP_nRzKCdGA3g&gid=0";
	const data = parsecsv(await cfetch("anotace", url, 1800));
	let anot = "";
	let meda = "";
	for (const r of data) {
		if (r[0] == id) {
			anot = r[2];
			meda = r[1];
			break;
		}
	}
	document.getElementById("frame_overlay0").style.scale = "1";
	document.getElementById("presenting").textContent = id;
	document.getElementById("presentation").textContent = name;
	document.getElementById("annotation").innerHTML = anot;
	document.getElementById("medailon").innerHTML = meda;
	document.getElementById("room").innerHTML = room;
	document.getElementById("time").innerHTML = time;
	generateFrames(id="frame_overlay");
	document.getElementById("annot_fetch_time").textContent = "Data z " + format_time(localStorage["T_anotace"]);
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
