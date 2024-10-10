// -----------------------------------------------------------------------------------------------------------UBICAR HTML
const masterMaster = document.getElementById("secciones-logs");
const master = document.getElementById("logs-sections");
const secciones = master.getElementsByClassName("logs-section");
const fechas = master.getElementsByClassName("logs-fecha");

// -----------------------------------------------------------------------------------------------------------FIJAR FECHAS
let dates = [
  new Date("Oct 07, 2024 11:11:00"),

  new Date("Oct 14, 2024 12:00:00"),
  new Date("Oct 18, 2024 12:00:00"),
  new Date("Oct 22, 2024 12:23:00"),
  new Date("Oct 26, 2024 13:04:00"),
];

// -----------------------------------------------------------------------------------------------------------ACTUALIZAR A CADA SEGUNDO
// Update the count down every 1 second
let interval = 0;
var x = setInterval(function () {
  interval = 1000;

  // Get today's date and time
  var now = new Date().getTime();

  console.log(secciones.length);

  for (let i = 0; i < dates.length; i++) {
    let distance = dates[i] - now;
    if (distance < 0) {
      masterMaster.classList.remove("oculto");
      secciones[i].classList.remove("oculto");
      fechas[i].innerHTML =
        digits(dates[i].getDay()) +
        "/" +
        digits(dates[i].getMonth()+1) +
        ", " +
        digits(dates[i].getHours()) +
        ":" +
        digits(dates[i].getMinutes());

      if (i === dates.length - 1) {
        clearInterval(x);
      }
    } else {
      secciones[i].classList.add("oculto");
    }
  }
}, interval);

// -----------------------------------------------------------------------------------------------------------ACOMODAR DÍGITOS
function digits(n) {
  return n >= 10 ? n : "0" + n;
}

// -----------------------------------------------------------------------------------------------------------RECIBIR PARÁMETRO
// function getParams() {
//   let url = location.search.split("?form=");
//   if (url[1] === "do") {
//     console.log(finished);
//     if (finished === true) {
//       location.replace("/html/proyectos.html");
//     } else {
//       setVisible("landing-secretForm");
//     }
//   }
// }
