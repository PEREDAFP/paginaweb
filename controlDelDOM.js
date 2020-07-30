function cargaDatosEnElemento(elemento, tipo, dato, draggable = false) {
  const lista = document.getElementById(elemento);
  const li = document.createElement(tipo);
  li.innerHTML = `${dato}`;
  const att = document.createAttribute('draggable'); // Create a "class" attribute
  att.value = draggable; // Set the value of the class attribute
  li.setAttributeNode(att);
  lista.appendChild(li);
}

export { cargaDatosEnElemento };
