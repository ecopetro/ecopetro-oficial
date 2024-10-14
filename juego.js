//------------------------------------------------------------------------------------------------------------DECLARACIÓN
const prop = 1310 / 1226;

let juegoDiv;
let cerrarBtn;

let zonas, sustancias, sustanciaSelected, sustanciasEnMezcla;

let doJuego;
let toque, ptoque;

//------------------------------------------------------------------------------------------------------------PRELOAD
function preload() {}

//------------------------------------------------------------------------------------------------------------SETUP
function setup() {
  //----------------------------------------------------------------------------------------------VENTANA
  let bodyWidth = Number(split(select("#body-2").style("width"), "p")[0]);
  let canvasWidth = bodyWidth;
  if (bodyWidth <= 500) {
    canvasWidth -= 16;
  }
  // let canvasHeight = map(canvasWidth, 0, 1226, 0, 1310);
  let canvasHeight = canvasWidth * prop;

  let canvasDiv = document.querySelector("#canvas");
  let theCanvas = createCanvas(canvasWidth, canvasHeight);
  theCanvas.parent(canvasDiv);

  juegoDiv = document.querySelector("#juego");
  doJuego = false;

  //----------------------------------------------------------------------------------------------BOTÓN PARA CERRAR
  cerrarBtn = createButton(`X`);
  cerrarBtn.style(`
    height: 30px;
  `);
  cerrarBtn.parent(canvasDiv);
  cerrarBtn.position((windowWidth - canvasWidth) / 2, 8);
  cerrarBtn.mouseClicked(cerrar);

  //----------------------------------------------------------------------------------------------ZONA DE BARRA
  let zonasMargin = 16;
  zonas = [];
  zonas.push(new Zona(16, zonasMargin, width - 32, width / 5));

  //----------------------------------------------------------------------------------------------ZONA DE SUSTANCIAS
  zonas.push(
    new Zona(
      16,
      zonas[0].posY + zonas[0].alto + zonasMargin,
      width - 32,
      zonas[0].alto / 2
    )
  );

  sustancias = [];
  for (let i = 0; i < 6; i++) {
    sustancias.push(
      new Sustancia(
        i,
        zonas[1].posX + zonas[1].alto * (i + 1),
        zonas[1].posY + zonas[1].alto / 2,
        zonas[1].alto - 8,
        0
      )
    );
  }
  for (let i = 0; i < 3; i++) {
    sustancias.push(
      new Sustancia(
        i,
        zonas[1].posX + zonas[1].alto * sustancias.length,
        zonas[1].posY + zonas[1].alto / 2,
        zonas[1].alto - 8,
        0
      )
    );
  }
  sustancias = shuffle(sustancias);
  ordenarSustancias();
  sustanciaSelected = null;

  //----------------------------------------------------------------------------------------------ZONA DE MEZCLA
  zonas.push(
    new Zona(
      16,
      zonas[1].posY + zonas[1].alto + zonasMargin,
      width - 32,
      height - zonasMargin - (zonas[1].posY + zonas[1].alto + zonasMargin)
    )
  );

  sustanciasEnMezcla = [];
  for (let i = 0; i < 6; i++) {
    sustanciasEnMezcla.push(0);
  }

  //----------------------------------------------------------------------------------------------CONFIGURACIÓN
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);
}
function reset() {
  setVisible("juego");
  loop();
}

//------------------------------------------------------------------------------------------------------------DRAW
function draw() {
  //----------------------------------------------------------------------------------------------DETECTAR SI SE CIERRA EL JUEGO
  doJuego = !juegoDiv.classList.contains("oculto");

  if (doJuego === true) {
    if (touches[0] != undefined) {
      toque = touches[touches.length - 1];
    } else {
      toque = { x: mouseX, y: mouseY };
    }

    background(180);

    //----------------------------------------------------------------------------------------------DIBUJAR ZONAS
    for (let z of zonas) {
      z.dibujar();
    }

    let barra = {
      x: zonas[0].posX + 8,
      y: zonas[0].posY + 8,
      w: zonas[0].ancho - 16,
      h: zonas[0].alto / 3,
    };
    push();
    rectMode(CORNER);
    fill(90);
    noStroke();
    rect(barra.x, barra.y, barra.w, barra.h, 16);
    pop();

    let porcentajes = [];
    let total = 0;
    for (let p of sustanciasEnMezcla) {
      if (p > 0) {
        porcentajes.push(p);
        total += p;
      }
    }
    for (let p of porcentajes) {
      push();
      rectMode(CORNER);
      // fill(map(this.tipo, 0, 6, 0, 360), 80, 80);    //NECESITO MANTENER LA REFERENCIA DEL TIPO
      noStroke();
      rect(barra.x + 4, barra.y + 4, barra.w - 4, barra.h - 4, 16);
      pop();
    }
    text(
      porcentajes + " = " + total,
      barra.x + barra.w / 2,
      barra.y + barra.h / 2
    );

    for (let s of sustancias) {
      s.actualizar();
    }

    ptoque = toque;
  } else {
    noLoop();
  }
}

//------------------------------------------------------------------------------------------------------------MOUSE / TACTIL
function cerrar() {
  if (doJuego === true) {
    setVisible("juego");
  }
}
function outOfCanvas(x, y) {
  if (x < 0 || x > width || y < 0 || y > height) {
    cerrar();
  }
}
function mouseClicked() {
  outOfCanvas(mouseX, mouseY);
}
function mouseDragged() {
  for (let s of sustancias) {
    s.mover();
  }
}
function mouseReleased() {
  for (let s of sustancias) {
    s.soltar();
  }
}
function touchEnded() {
  outOfCanvas(toque.x, toque.y);

  for (let s of sustancias) {
    s.soltar();
  }
}

//------------------------------------------------------------------------------------------------------------CLASE ZONA
class Zona {
  constructor(x, y, w, h) {
    this.posX = x;
    this.posY = y;
    this.ancho = w;
    this.alto = h;
  }

  dibujar() {
    push();
    rectMode(CORNER);
    fill(270);
    strokeWeight(4);
    rect(this.posX, this.posY, this.ancho, this.alto, 16);
    pop();
  }
}
function ordenarSustancias() {
  for (let i = 0; i < sustancias.length; i++) {
    if (sustancias[i].estado === 0) {
      sustancias[i].posX =
        zonas[1].posX + zonas[1].alto * (i + 1) - sustancias[i].tam / 2;
      sustancias[i].posY = zonas[1].posY + zonas[1].alto / 2;
    }
  }
}

//------------------------------------------------------------------------------------------------------------CLASE SUSTANCIA
class Sustancia {
  constructor(t, x, y, s, e) {
    this.tipo = t;
    this.posX = x;
    this.posY = y;
    this.tam = s;
    this.estado = e;

    this.preEstado = this.estado;
    this.eventoEstado = false;

    this.tinte = map(this.tipo, 0, 6, 0, 360);
  }

  actualizar() {
    this.eventoEstado = this.estado != this.preEstado;
    if (this.eventoEstado) {
      if (this.estado === 0) {
        sustanciasEnMezcla[this.tipo] -= 1;
      } else if (this.estado === 1) {
        sustanciasEnMezcla[this.tipo] += 1;
      }

      if (this.estado <= 1) {
        ordenarSustancias();
      }
      this.preEstado = this.estado;
    }

    if (this.estado < 1) {
      push();
      ellipseMode(CENTER);
      fill(this.tinte, 80, 80);
      noStroke();
      ellipse(this.posX, this.posY, this.tam);
      pop();
    } else {
      push();
      ellipseMode(CENTER);
      fill(this.tinte, 80, 80);
      noStroke();
      ellipse(this.posX, this.posY, this.tam * 1.5);
      pop();
    }
    text(this.tipo + "\n" + this.estado, this.posX, this.posY);
  }

  mover() {
    let cursorDentro = dist(toque.x, toque.y, this.posX, this.posY) < this.tam;
    let noOtroSelected =
      sustanciaSelected === null || sustanciaSelected === this;
    if (cursorDentro && noOtroSelected) {
      sustanciaSelected = this;
      this.estado = 2;
    }

    if (this.estado === 2) {
      this.posX = toque.x;
      this.posY = toque.y;
    }
  }
  soltar() {
    sustanciaSelected = null;

    if (
      this.posX > zonas[2].posX + this.tam / 2 &&
      this.posX < zonas[2].posX + zonas[2].ancho - this.tam / 2 &&
      this.posY > zonas[2].posY + this.tam / 2 &&
      this.posY < zonas[2].posY + zonas[2].alto - this.tam / 2
    ) {
      this.estado = 1;
    } else {
      this.estado = 0;
    }
  }
}
