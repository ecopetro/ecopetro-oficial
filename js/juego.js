//------------------------------------------------------------------------------------------------------------DECLARACIÓN
const prop = 1310 / 1226;

let juegoDiv;
let cerrarBtn, cerrarOver;

let zonas,
  sustancias,
  sustanciaSelected,
  sustanciasEnMezcla,
  consigna,
  preConsigna,
  totalEnMezcla;
let porcentajes = [];
const COLORES = [
  "#4BB5DC",
  "#63B330",
  "#FFB9B9",
  "#AC71FF",
  "#FF622e",
  "#f0d463",
];
const NOMBRES = [
  "Antocianina",
  "Clorofila",
  "Tocoferol",

  "Fenol",
  "Etileno",
  "Ácido salicílico",
];
const TEXTOS = [
  "Pigmento que da color a las flores, además de protegerlas de factores como los rayos UV.",
  "Esencial para la fotosíntesis, permitiendo que las plantas conviertan la luz solar en energía.",
  "Antioxidante que reduce el estrés ambiental, como el exceso de luz solar o la Neblina.",

  "Protege a la planta contra agentes patógenos, y regula partes de su crecimiento.",
  "Regula la maduración, crucial para la floración y para adaptarse a heridas o infecciones.",
  "Ayuda a resistir infecciones y a recuperarse de daños físicos o enfermedades.",
];

let doJuego, preDoJuego;
let toque, ptoque;

let fondoImg, consignaImg;
let sustanciasImg = [];

//------------------------------------------------------------------------------------------------------------PRELOAD
function preload() {
  fondoImg = loadImage("../assets/juego-fondo.png");
  consignaImg = loadImage("../assets/juego-consigna.png");

  for (let i = 0; i < 6; i++) {
    sustanciasImg.push(loadImage("../assets/sustancia" + i + ".png"));
  }
}

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
  preDoJuego = false;

  //----------------------------------------------------------------------------------------------BOTÓN PARA CERRAR
  cerrarBtn = createButton(`X`);
  cerrarBtn.style(`
    width: 64px;
    height: 30px;
    background-color: #56de00
  `);
  cerrarBtn.parent(canvasDiv);
  cerrarBtn.position(windowWidth / 2 - 32, 16);
  cerrarBtn.mouseClicked(cerrar);
  cerrarBtn.mouseOver(() => {
    cerrarOver = true;
  });
  cerrarBtn.mouseOut(() => {
    cerrarOver = false;
  });
  cerrarOver = false;

  //----------------------------------------------------------------------------------------------ZONA DE BARRA
  let zonasMargin = 16;
  zonas = [];
  zonas.push(
    new Zona(16, zonasMargin, width - 32, width / 5, "#FFE3E3", CORNER)
  );

  //----------------------------------------------------------------------------------------------ZONA DE SUSTANCIAS
  zonas.push(
    new Zona(
      16,
      zonas[0].posY + zonas[0].alto + zonasMargin,
      width - 32,
      zonas[0].alto / 2,
      "#FFE3E3",
      CORNER
    )
  );

  sustancias = [];
  for (let i = 0; i < 6; i++) {
    // Crear al menos una sustancia de cada tipo
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
    // Duplicar las sustancias importantes para reforzar/confundir
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
  sustancias = shuffle(sustancias); // desordenar las sustancias para que sea más divertido
  for (let i = 0; i < sustancias.length; i++) {
    if (sustancias[i].estado === 0) {
      sustancias[i].OGposX =
        zonas[1].posX + zonas[1].alto * (i + 1) - sustancias[i].tam / 2;
      sustancias[i].OGposY = zonas[1].posY + zonas[1].alto / 2;
    }
    sustancias[i].ordenar();
  }
  sustanciaSelected = null;

  //----------------------------------------------------------------------------------------------ZONA DE MEZCLA
  zonas.push(
    new Zona(
      16,
      zonas[1].posY + zonas[1].alto + zonasMargin,
      width - 32,
      height - zonasMargin - (zonas[1].posY + zonas[1].alto + zonasMargin),
      "#FFE3E3",
      CORNER
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
  angleMode(DEGREES);
}

//------------------------------------------------------------------------------------------------------------DRAW
function draw() {
  //----------------------------------------------------------------------------------------------CONVERTIR TÁCTIL EN MOUSE
  if (touches[0] != undefined) {
    toque = touches[touches.length - 1];
  } else {
    toque = { x: mouseX, y: mouseY };
  }

  //----------------------------------------------------------------------------------------------DETECTAR SI SE CIERRA EL JUEGO
  doJuego = !juegoDiv.classList.contains("oculto");

  if (doJuego === true) {
    background("#FFCBCB");
    push();
    imageMode(CORNER);
    image(fondoImg, 0, 0, width, height);
    pop();

    for (let z of zonas) {
      z.dibujar();
    }

    //----------------------------------------------------------------------------------------------MOSTRAR BARRA DE PORCENTAJES
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

    porcentajes = [];
    totalEnMezcla = 0;
    for (let i = 0; i < sustanciasEnMezcla.length; i++) {
      if (sustanciasEnMezcla[i] > 0) {
        for (let j = 0; j < sustanciasEnMezcla[i]; j++) {
          porcentajes.push(new Porcentaje(i, barra));
          totalEnMezcla++;
        }
      }
    }
    let anchos = (barra.w - 8) / totalEnMezcla;
    for (let i = 0; i < porcentajes.length; i++) {
      let p = porcentajes[i];
      p.actualizar(barra.x + 4 + anchos * i, anchos, i, porcentajes.length - 1);
    }

    //----------------------------------------------------------------------------------------------MOSTRAR CONSIGNA
    let correctas =
      testSustancias(0, 2) && testSustancias(1, 1) && testSustancias(2, 1);

    if (testSustancias(0)) {
      consigna = "Arrastrá alguna sustancia a la mezcla para empezar.";
    } else {
      if (totalEnMezcla >= 6) {
        consigna = "La mezcla se está saturando, son demasiados componentes.";
      } else if (
        (testSustancias(5, 1, 2) ||
          testSustancias(4, 1, 2) ||
          testSustancias(0, 1, 2) ||
          testSustancias(1, 1, 2)) &&
        !(testSustancias(2, 1, 2) || testSustancias(3, 1, 2))
      ) {
        consigna =
          "La planta estaría desprotegida contra otros factores ambientales.";
      } else if (
        !(testSustancias(0, 1, 2) || testSustancias(2, 1, 2)) &&
        testSustancias(1, 1, 2)
      ) {
        consigna = "Sería demasiado sensible al sol.";
      } else if (!testSustancias(0, 2)) {
        consigna = "Le faltaría color a la flor.";
      } else if (
        testSustancias(0, 1, 2) &&
        (testSustancias(2, 1, 2) ||
          testSustancias(3, 1, 2) ||
          testSustancias(4, 1, 2) ||
          testSustancias(5, 1, 2)) &&
        testSustancias(1, 0)
      ) {
        consigna =
          "La flor tendría problemas para captar sol en los días nublados o cuando hay Neblina.";
      } else if (
        testSustancias(0, 2) &&
        testSustancias(1, 1, 2) &&
        testSustancias(2, 0) &&
        (testSustancias(3, 1, 2) ||
          testSustancias(4, 1, 2) ||
          testSustancias(5, 1, 2))
      ) {
        consigna =
          "La planta estaría desprotegida contra otros factores ambientales.";
      }
    }
    //------------------------------------------------------------------------------------CORRECTA
    if (testSustancias(4) && correctas) {
      consigna = "¡Esta combinación podría funcionar!";
      noLoop();
    }

    //------------------------------------------------------------------------------------DIBUJAR CONSIGNA
    push();
    if (testSustancias(4) && correctas) {
      textStyle(BOLD);
      tint(100, 100, 100);
    }

    imageMode(CORNER);
    image(
      consignaImg,
      barra.x,
      zonas[0].posY + zonas[0].alto / 2,
      zonas[0].alto / 3,
      zonas[0].alto / 3
    );

    let tx = zonas[0].ancho / 10 + 8;
    textAlign(LEFT, CENTER);
    text(
      consigna,
      barra.x + tx,
      zonas[0].posY + zonas[0].alto / 2,
      zonas[0].ancho - (tx + 8),
      zonas[0].alto / 2 - 8
    );
    pop();

    //----------------------------------------------------------------------------------------------MOSTRAR SUSTANCIAS
    for (let s of sustancias) {
      s.actualizar();
    }
    if (
      !testSustancias(0, 2) &&
      !testSustancias(1, 1) &&
      !testSustancias(2, 1) &&
      !testSustancias(4)
    ) {
      for (let s of sustancias) {
        s.describir();
      }
    }

    ptoque = toque;
    preDoJuego = doJuego;
  } else {
    noLoop();
  }
}

//----------------------------------------------------------------------------------------------TEST SUSTANCIAS
function testSustancias(t, p, pm) {
  if (p >= 0) {
    if (pm > p) {
      return sustanciasEnMezcla[t] === p || sustanciasEnMezcla[t] === pm;
    } else {
      return sustanciasEnMezcla[t] === p;
    }
  } else {
    return totalEnMezcla === t;
  }
}

//----------------------------------------------------------------------------------------------PRENDER/APAGAR JUEGO
function reset() {
  console.log(doJuego);
  if (doJuego === false) {
    juegoDiv.classList.remove("oculto");
    loop();
  }
}
function cerrar() {
  console.log(doJuego);
  if (doJuego === true && preDoJuego === true) {
    juegoDiv.classList.add("oculto");
  }
}

//------------------------------------------------------------------------------------------------------------MOUSE / TACTIL
// function outOfCanvas(x, y) {
//   // if (doJuego === true && preDoJuego=== false) {
//   if ((x < 0 || x > width || y < 0 || y > height) && cerrarOver === false) {
//     cerrar();
//   }
//   // }
// }
function mouseClicked() {
  // outOfCanvas(mouseX, mouseY);
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
  // outOfCanvas(toque.x, toque.y);

  for (let s of sustancias) {
    s.soltar();
  }
}

//------------------------------------------------------------------------------------------------------------CLASE ZONA
class Zona {
  constructor(x, y, w, h, c, m) {
    this.posX = x;
    this.posY = y;
    this.ancho = w;
    this.alto = h;
    this.color = c;
    this.modo = m;
  }

  dibujar() {
    push();
    rectMode(this.modo);
    fill("#fff");
    strokeWeight(4);
    stroke(this.color);
    rect(this.posX, this.posY, this.ancho, this.alto, 16);
    pop();
  }
}

class Porcentaje {
  constructor(t, b) {
    this.tipo = t;
    this.cant = 0;

    this.posX = 0;
    this.posY = b.y + 4;
    this.ancho = 0;
    this.alto = b.h - 8;
  }

  actualizar(x, w, i, l) {
    this.posX = x;
    this.ancho = w;

    this.index = i;
    this.last = l;

    push();
    rectMode(CORNER);
    fill(COLORES[this.tipo]);
    noStroke();

    let esPrimero = this.index === 0;
    let esFinal = this.index === this.last;
    let esUnico = this.last === 0;

    if (esPrimero && !esUnico) {
      rect(this.posX, this.posY, this.ancho, this.alto, 16, 0, 0, 16);
    } else if (esFinal && !esUnico) {
      rect(this.posX, this.posY, this.ancho, this.alto, 0, 16, 16, 0);
    } else if (!esPrimero && !esFinal) {
      rect(this.posX, this.posY, this.ancho, this.alto, 0);
    } else if (esUnico) {
      rect(this.posX, this.posY, this.ancho, this.alto, 16);
    }
    pop();

    // text(
    //   this.index + "/" + this.last + " es " + this.tipo,
    //   this.posX + this.ancho / 2,
    //   this.posY + this.alto / 2
    // );
  }
}

//------------------------------------------------------------------------------------------------------------CLASE SUSTANCIA
class Sustancia {
  constructor(t, x, y, s, e) {
    this.tipo = t;
    this.color = COLORES[this.tipo];
    this.nombre = NOMBRES[this.tipo];
    this.texto = TEXTOS[this.tipo];

    this.posX = x;
    this.posY = y;
    this.tam = s;

    this.estado = e;
    this.preEstado = this.estado;
    this.eventoEstado = false;
    this.dragging = false;

    this.cursorDentro = false;

    this.zona = null;

    this.OGposX = this.posX;
    this.OGposY = this.posY;
    this.OGtam = this.tam;

    this.roto = 0;
    this.sentido = random([-1, +1]);
  }

  ordenar() {
    this.posX = this.OGposX;
    this.posY = this.OGposY;

    if (this.zona === null) {
      let zx = this.tam * 5;
      let zy = this.tam * 1.75;

      this.zona = new Zona(
        constrain(
          map(
            this.OGposX,
            zonas[1].posX,
            zonas[1].posX + zonas[1].ancho,
            zonas[1].posX + this.tam,
            zonas[1].posX + zonas[1].ancho - this.tam
          ),
          zonas[1].posX + this.tam + zx / 2,
          zonas[1].posX + zonas[1].ancho - this.tam - zx / 2
        ),
        zonas[1].posY + zonas[1].alto + 8 + zy / 2,
        zx,
        zy,
        this.color,
        CENTER
      );
    }
  }

  actualizar() {
    this.cursorDentro =
      dist(toque.x, toque.y, this.posX, this.posY) < this.tam / 2;

    this.eventoEstado = this.estado != this.preEstado;
    if (this.eventoEstado) {
      if (this.estado === 0) {
        sustanciasEnMezcla[this.tipo] -= 1;
      } else if (this.estado === 1) {
        sustanciasEnMezcla[this.tipo] += 1;
      }
      this.preEstado = this.estado;
    }

    if (this.estado === 1 || this.dragging === true) {
      if (this.tipo < 3) {
        this.tam = 2 * this.OGtam;
      }

      push();
      if (
        testSustancias(0, 2) &&
        testSustancias(1, 1) &&
        testSustancias(2, 1) &&
        testSustancias(4)
      ) {
        ellipseMode(CENTER);
        fill(100, 100, 100, 25);
        noStroke();
        ellipse(this.posX, this.posY, this.tam * 2);
      }

      if (this.dragging === false) {
        this.roto += random(0.05, 0.2) * this.sentido;
      }
      translate(this.posX, this.posY);
      rotate(this.roto);
      imageMode(CENTER);
      image(sustanciasImg[this.tipo], 0, 0);
      pop();
    } else {
      this.tam = this.OGtam;

      push();
      ellipseMode(CENTER);
      fill(this.color);
      noStroke();
      ellipse(this.posX, this.posY, this.tam);
      pop();
    }
    // text(this.tipo + "\n" + this.estado, this.posX, this.posY);
  }

  describir() {
    if (
      this.cursorDentro === true &&
      sustanciaSelected === null &&
      this.estado === 0
    ) {
      this.zona.dibujar();
      push();
      textAlign(LEFT, CENTER);
      textStyle(BOLD);
      text(
        this.nombre,
        this.zona.posX + 8 - this.zona.ancho / 2,
        this.zona.posY + 16 - this.zona.alto / 2
      );
      pop();
      push();
      textAlign(LEFT, BOTTOM);
      text(
        this.texto,
        this.zona.posX + 8 - this.zona.ancho / 2,
        this.zona.posY + 4 - this.zona.alto / 2,
        this.zona.ancho - 8,
        this.zona.alto - 8
      );
      pop();
    }
  }

  mover() {
    let noOtroSelected =
      sustanciaSelected === null || sustanciaSelected === this;
    if (this.cursorDentro === true && noOtroSelected === true) {
      sustanciaSelected = this;
      this.dragging = true;
    }

    if (this.dragging === true) {
      this.posX = toque.x;
      this.posY = toque.y;
    }
  }
  soltar() {
    sustanciaSelected = null;
    this.dragging = false;

    if (
      this.posX > zonas[2].posX + this.tam / 2 &&
      this.posX < zonas[2].posX + zonas[2].ancho - this.tam / 2 &&
      this.posY > zonas[2].posY + this.tam / 2 &&
      this.posY < zonas[2].posY + zonas[2].alto - this.tam / 2
    ) {
      this.estado = 1;
    } else {
      this.estado = 0;
      this.ordenar();
    }

    // console.log(this.tipo + " pasó de " + this.preEstado + " a " + this.estado);
  }
}
