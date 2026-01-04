let paginaActual = 1;
const ITEMS_POR_PAGINA = 30;


const catalogo = document.getElementById("catalogo");
const modal = document.getElementById("modal");
const modalNombre = document.getElementById("modal-nombre");
const modalCantidad = document.getElementById("modal-cantidad");
const listaCarrito = document.getElementById("listaCarrito");
const modalTamanos = document.getElementById("modal-tamanos");
const carritoPanel = document.getElementById("carrito-panel");
const cartCount = document.getElementById("cart-count");

let carrito = [];
let perfumeActivo = null;
let tamanoSeleccionado = null;

/* Abrir / cerrar carrito */
function toggleCarrito() {
  carritoPanel.style.display =
    carritoPanel.style.display === "block" ? "none" : "block";
}
function cargarMarcas() {
  const select = document.getElementById("filtroMarca");

  const marcasUnicas = [...new Set(perfumes.map(p => p.marca))].sort();

  marcasUnicas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    select.appendChild(option);
  });
}
function filtrarTodo() {
  paginaActual = 1;
  renderPaginado();
}

/* =========================
   RENDER CATÁLOGO
   ========================= */
function render(lista) {
  catalogo.innerHTML = "";

  lista.forEach(p => {
    const indexReal = perfumes.indexOf(p);

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="marca">${p.marca}</div>
      <div class="nombre">${p.nombre}</div>
      <div class="info">
        ${p.genero} · ${p.concentracion} · ${p.tamanos.join(" / ")}
      </div>
      <span class="badge">.</span><br>
      <button onclick="abrirModal(${indexReal})">Agregar</button>
    `;

    catalogo.appendChild(card);
  });
}


function renderPaginado() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const marca = document.getElementById("filtroMarca").value;

  let filtrados = perfumes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideMarca = marca === "" || p.marca === marca;
    return coincideNombre && coincideMarca;
  });

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;

  const pagina = filtrados.slice(inicio, fin);

  render(pagina);

  document.getElementById("infoPagina").textContent =
    `Página ${paginaActual} de ${totalPaginas || 1}`;
}
function paginaSiguiente() {
  paginaActual++;
  renderPaginado();
}

function paginaAnterior() {
  if (paginaActual > 1) {
    paginaActual--;
    renderPaginado();
  }
}


/* =========================
   BUSCADOR
   ========================= */
function filtrar() {
  const texto = document
    .getElementById("buscador")
    .value
    .toLowerCase();

  const filtrados = perfumes.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );

  render(filtrados);
}

/* =========================
   MODAL
   ========================= */
function abrirModal(index) {
  perfumeActivo = perfumes[index];
  modalNombre.textContent = perfumeActivo.nombre;

  modalTamanos.innerHTML = "";
  tamanoSeleccionado = null;

  perfumeActivo.tamanos.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "tamano-btn";
    btn.textContent = t;

    btn.onclick = () => {
      document
        .querySelectorAll(".tamano-btn")
        .forEach(b => b.classList.remove("activo"));

      btn.classList.add("activo");
      tamanoSeleccionado = t;
    };

    modalTamanos.appendChild(btn);
  });

  modalCantidad.value = 1;
  modal.style.display = "block";
}

function cerrarModal() {
  modal.style.display = "none";
}

/* =========================
   CONFIRMAR CARRITO
   ========================= */
function confirmar() {
  if (!tamanoSeleccionado) {
    alert("Seleccioná un tamaño");
    return;
  }

  carrito.push({
    nombre: perfumeActivo.nombre,
    tamano: tamanoSeleccionado,
    cantidad: modalCantidad.value
  });

  renderCarrito();
  cerrarModal();
}

/* =========================
   RENDER CARRITO
   ========================= */
function renderCarrito() {
  listaCarrito.innerHTML = "";

  carrito.forEach((p, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "6px";

    li.innerHTML = `
      <span>${p.nombre} · ${p.tamano} x${p.cantidad}</span>
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;

    listaCarrito.appendChild(li);
  });

  cartCount.textContent = carrito.length;
}
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCarrito();
}


/* =========================
   WHATSAPP
   ========================= */
function enviarWhatsApp() {
  if (!carrito.length) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero cotizar:%0A";
  carrito.forEach(p => {
    mensaje += `- ${p.nombre} (${p.tamano}) x${p.cantidad}%0A`;
  });

  window.open(
    "https://wa.me/85097011?text=" + mensaje,
    "_blank"
  );
}

/* =========================
   CERRAR CARRITO AL CLICK FUERA
   ========================= */
document.addEventListener("click", function (e) {
  if (
    carritoPanel.style.display === "block" &&
    !carritoPanel.contains(e.target) &&
    !e.target.closest(".cart-icon")
  ) {
    carritoPanel.style.display = "none";
  }
});

/* CARGA INICIAL */
cargarMarcas();
renderPaginado();
