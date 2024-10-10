// -----------------------------------------------------------------------------------------------------------UBICAR HTML
const showCountdown = document.getElementById("countdown");
const showFulldate = document.getElementById("fulldate");

const showYear = document.getElementById("year");
const showMonth = document.getElementById("month");
const showDay = document.getElementById("day");
const showHour = document.getElementById("hour");
const showMinute = document.getElementById("minute");
const showSecond = document.getElementById("second");

// -----------------------------------------------------------------------------------------------------------FIJAR FECHA FINAL
// LOS MESES EMPIEZAN EN 0 QUIÉN FUE EL HIJO DE MIL PUTA????????
var fechaFinal = new Date("Nov 15, 2024 12:00:00");

let finished = false;
// getParams();

if (showFulldate != null) {
  showFulldate.innerHTML =
    fechaFinal.getDate() +
    " / " +
    fechaFinal.getMonth() +
    " / " +
    fechaFinal.getFullYear() +
    ", " +
    fechaFinal.getHours() +
    ":" +
    fechaFinal.getMinutes();
}

// -----------------------------------------------------------------------------------------------------------ACTUALIZAR A CADA SEGUNDO
// Update the count down every 1 second
let interval = 0;
var x = setInterval(function () {
  interval = 1000;

  // ----------------------------------------------------------------------------------------FECHA ACTUAL
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = fechaFinal - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // ----------------------------------------------------------------------------------------MOSTRAR EN EL HTML
  showDay.innerHTML = digits(days);
  showHour.innerHTML = digits(hours);
  showMinute.innerHTML = digits(minutes);
  showSecond.innerHTML = digits(seconds);

  // ----------------------------------------------------------------------------------------CUANDO TERMINE LA CUENTA
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").classList.remove("flex-row");
    document.getElementById("countdown").classList.add("flex-column");
    document.getElementById("countdown").innerHTML =
      "<h2 class='rosita'>¡Vení a ver el proyecto elegido!</h2>Sede Fonseca - Diagonal 78 esq 62";
    finished = true;

    // getParams();
  }
}, interval);

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
