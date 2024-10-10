//------------------------------------------------------------------------------------------------------------DECLARACIÓN
let doCaptcha;

let imgs = [];
let tanda = [];
let correctas, incorrectas, acertadas, erradas;

//------------------------------------------------------------------------------------------------------------PRELOAD
function preload() {
  for (let i = 0; i <= 5; i++) {
    imgs.push(loadImage("../assets/captcha" + i + ".jpg"));
  }
}

//------------------------------------------------------------------------------------------------------------SETUP
function setup() {
  if (random(0, 100) < 50) {
    let canvasDiv = document.querySelector("#canvas");
    let theCanvas = createCanvas(400, 400);
    theCanvas.parent(canvasDiv);

    acertadas = erradas = 0;
    correctas = round(random(1, 2));
    incorrectas = 3 - correctas;

    let tam = width / 4.5;

    let piolas = [0, 1, 2];
    let impiolas = [3, 4, 5];
    let l = shuffle([0, 1, 2]);

    for (let i = 0; i < 3; i++) {
      let t;
      if (i < correctas) {
        t = random(piolas);
        piolas.splice(piolas.indexOf(t), 1);
      } else {
        t = random(impiolas);
        impiolas.splice(impiolas.indexOf(t), 1);
      }

      tanda.push(
        new Option(
          imgs[t],
          map(l[i], 0, 2, tam, width - tam),
          height * (2 / 3),
          tam,
          i < correctas
        )
      );
    }

    doCaptcha = true;
    setVisible("captcha");

    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
  }
}

//------------------------------------------------------------------------------------------------------------DRAW
function draw() {
  if (doCaptcha) {
    background(220);

    text("Selecciona las imágenes que contengan TIERRA", width / 2, height / 6);

    for (let i = 0; i < tanda.length; i++) {
      tanda[i].dibujar();
    }

    if (acertadas >= correctas && erradas <= 0) {
      setVisible("captcha");
      doCaptcha = false;
    }
  } else {
    noLoop();
  }
}

//------------------------------------------------------------------------------------------------------------MOUSE
function mouseClicked() {
  for (let i = 0; i < tanda.length; i++) {
    tanda[i].clickear();
  }
}

//------------------------------------------------------------------------------------------------------------CLASE OPCCIÓN
class Option {
  constructor(i, x, y, t, c) {
    this.img = i;

    this.posX = x;
    this.posY = y;
    this.tam = t;

    this.correcta = c;
    this.clicked = false;
  }

  dibujar() {
    if (this.clicked) {
      push();
      noStroke();
      fill(86, 222, 0);
      rect(this.posX, this.posY, this.tam * 1.125, this.tam * 1.125, 5);
      pop();
    }
    image(this.img, this.posX, this.posY, this.tam, this.tam);

    // text(this.clicked, this.posX, this.posY + this.tam * 0.75);
    // text(this.correcta, this.posX, this.posY + this.tam * 1);
  }

  clickear() {
    if (
      mouseX > this.posX - this.tam / 2 &&
      mouseX < this.posX + this.tam / 2 &&
      mouseY > this.posY - this.tam / 2 &&
      mouseY < this.posY + this.tam / 2
    ) {
      this.clicked = !this.clicked;

      if (this.correcta === true) {
        if (this.clicked === true) {
          acertadas += 1;
        } else {
          acertadas -= 1;
        }
      } else {
        if (this.clicked === true) {
          erradas += 1;
        } else {
          erradas -= 1;
        }
      }
    }
  }
}
