//------------------------------------------------------------------------------------------------------------DECLARACIÓN
let juegoDiv;

//------------------------------------------------------------------------------------------------------------PRELOAD
function preload() {}

//------------------------------------------------------------------------------------------------------------SETUP
function setup() {
  let canvasDiv = document.querySelector("#canvas");
  let theCanvas = createCanvas(400, 400);
  theCanvas.parent(canvasDiv);

  juegoDiv = document.querySelector("#juego");

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
}
function reset() {
  setVisible("juego");
  loop();
}

//------------------------------------------------------------------------------------------------------------DRAW
function draw() {
  if (juegoDiv.classList.contains("oculto") === false) {
    background(220);
  } else {
    noLoop();
  }
}

//------------------------------------------------------------------------------------------------------------MOUSE
function mouseClicked() {}

//------------------------------------------------------------------------------------------------------------CLASE
