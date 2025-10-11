// Mostrar reclamos desde localStorage
function mostrarReclamos() {
  const lista = document.getElementById("listaReclamos");
  lista.innerHTML = ""; // Limpia contenido anterior

  const reclamos = JSON.parse(localStorage.getItem("reclamos")) || [];

  if (reclamos.length === 0) {
    lista.innerHTML = "<li class='list-group-item'>No hay reclamos registrados.</li>";
    return;
  }

  reclamos.forEach((rec, index) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `📄 <strong>${rec.nombre}</strong> reclamó: ${rec.detalle}`;
    lista.appendChild(li);
  });
}

// Captura del formulario
document.getElementById("formReclamo").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener datos necesarios
  const nombre = document.getElementById("nombre").value;
  const detalle = document.getElementById("detalle").value;

  const nuevoReclamo = { nombre, detalle };

  const reclamosGuardados = JSON.parse(localStorage.getItem("reclamos")) || [];
  reclamosGuardados.push(nuevoReclamo);
  localStorage.setItem("reclamos", JSON.stringify(reclamosGuardados));

  // Mostrar toast
  const toastEl = document.getElementById("toastReclamo");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  // Limpiar formulario
  this.reset();
});

// Mostrar reclamos al hacer clic en "Ver reclamos"
document.getElementById("verReclamos").addEventListener("click", function (e) {
  e.preventDefault();
  const lista = document.getElementById("listaReclamos");
  lista.classList.toggle("d-none");
  if (!lista.classList.contains("d-none")) {
    mostrarReclamos();
  }
});

// Cargar reclamos al cargar la página
document.addEventListener("DOMContentLoaded", mostrarReclamos);
