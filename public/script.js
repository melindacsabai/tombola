import { requestFn } from "./request.js";

const TICKETS = [];

const content = document.querySelector("#content");
const startBtn = document.querySelector("#start-btn");
const induloSzam = document.querySelector("#induloszam");
const sorsolasBtn = document.querySelector(".sorsolas-btn")
let btn;

const mezoTpl = (jatek) => `
 <div class="mezo" id="${jatek.number}" 
 data-sale="${jatek.sale}" 
 data-lot="${jatek.lot}>${jatek.number}</div>
 `;
const innerCt = document.createElement("div");
innerCt.className = "inner-ct";

function build(data) {
  const div = document.createElement("div");

  div.className = "div-mezo";
  div.setAttribute("id", data.number);
  div.setAttribute("data-sale", data.sale);
  div.setAttribute("data-lot", data.lot);
  div.innerText = data.number;

  innerCt.appendChild(div);
}

function builbtn() {
  btn = document.createElement("div");
  content.insertAdjacentElement("afterend", btn);
  btn.className = "vasarol-btn";
  btn.innerText = "Megveszem";
}

function btnFn() {
  btn.addEventListener("click", function () {
   
    const selectedElement = document.querySelectorAll(".selected");
    selectedElement.forEach((element) => {
      if (!element.classList.contains("inactive-div")) {
        TICKETS.push({
          number: Number(element.id),
          sale: true,
          lot: false,
        });
        element.setAttribute("data-sale", true);
        element.classList.add("kivalasztva");
      }
    });

    requestFn.post("/bytickets", TICKETS).then((res) => {
      alert("Sikeres vásárlás. Vásárlási hivatkokzási számod: " + res);
    });
  });
}

startBtn.addEventListener("click", async function () {
  await requestFn.get(`/reset/${induloSzam.value}`).then((res) => {
    for (let adat of res) {
      build(adat);
    }
    content.innerHTML = "";
    content.appendChild(innerCt);
  });
  builbtn();
  sorsolasBtn.style.display = "inline-block";
  selectFn(".div-mezo", "selected");
  btnFn();
});

const selectFn = function (selector, cssName) {
  const element = document.querySelectorAll(selector);
  element.forEach((child) => {
    child.addEventListener("click", function () {
      const selectedElement = document.querySelectorAll("." + cssName);
      this.classList.toggle(cssName);
      child.classList.contains(".selected")
        ? child.setAttribute("data-sale", true)
        : ("data-sale", false);
    });
  });
};

sorsolasBtn.addEventListener("click", async function(){

  let nyeroszam = await requestFn.get('/lot');
 
  const mezok = await document.querySelectorAll(".div-mezo");
  for( let mezo of mezok){
    if( mezo.id == nyeroszam.number){
      mezo.style.border = `2px solid red`;
      mezo.style.backgroundColor= "#fb7171";
      mezo.style.scale = 1.3;
    }
  }
    let nyert = false;
    for( let tic of TICKETS){
      if(tic.number === nyeroszam.number)
        nyert = true;
    }
    nyert ? alert("Gratulálunk Ön NYERT a " + nyeroszam.number + " számmal"): alert("Sajnáljuk, most nem nyert.")
  
})