// -----------------------------------------------------------------------------------------------------------MOSTRAR-OCULTAR
function setVisible(id) {
  let target = document.getElementById(id).classList;

  if (target.contains("oculto")) {
    target.remove("oculto");
  } else {
    target.add("oculto");
  }
}

// -----------------------------------------------------------------------------------------------------------ACOMODAR DÍGITOS
function digits(n) {
  return n >= 10 ? n : "0" + n;
}
