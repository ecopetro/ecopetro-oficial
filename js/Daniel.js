// -----------------------------------------------------------------------------------------------------------UBICAR HTML
const masterMaster = document.getElementById("secciones-logs");
const master = document.getElementById("logs-sections");
const secciones = master.getElementsByClassName("logs-section");
const fechas = master.getElementsByClassName("logs-fecha");

// -----------------------------------------------------------------------------------------------------------FIJAR FECHAS
let dates = [
  // new Date("Oct 7, 2024 11:11:00"),
  // new Date("Oct 10, 2024 12:11:00"),
  // new Date("Oct 7, 2024 11:11:00"),
  // new Date("Oct 10, 2024 12:11:00"),
  // new Date("Oct 7, 2024 11:11:00"),
  // new Date("Oct 10, 2024 12:11:00"),

  new Date("Oct 14, 2024 12:00:00"),
  new Date("Oct 18, 2024 12:00:00"),
  new Date("Oct 22, 2024 13:23:00"),
  new Date("Oct 27, 2024 02:18:00"),
  new Date("Nov 2, 2024 03:05:00"),
  new Date("Nov 8, 2024 12:00:00"),
];

// -----------------------------------------------------------------------------------------------------------ACTUALIZAR A CADA SEGUNDO
// Update the count down every 1 second
let interval = 0;
var x = setInterval(function () {
  interval = 1000;

  // Get today's date and time
  var now = new Date().getTime();

  for (let i = 0; i < dates.length; i++) {
    let distance = dates[i] - now;
    if (distance < 0) {
      masterMaster.classList.remove("oculto");
      secciones[i].classList.remove("oculto");
      fechas[i].innerHTML =
        digits(dates[i].getDate()) +
        "/" +
        digits(dates[i].getMonth() + 1) +
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
