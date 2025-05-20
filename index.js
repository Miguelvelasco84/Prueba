let usuario = null;
let rol = null;
let carrito = [];

function iniciarSesion() {
    usuario = document.getElementById("usuario").value;
    rol = document.getElementById("rol").value;
    document.getElementById("user-status").textContent = `Hola, ${usuario} (${rol})`;
    document.getElementById("logout").classList.remove("none");
    cargarProductos();
}

function cerrarSesion() {
    usuario = null;
    rol = null;
    carrito = [];
    document.getElementById("user-status").textContent = "No has iniciado sesión";
    document.getElementById("logout").classList.add("none");
    document.getElementById("productos").innerHTML = "";
}

function cargarProductos() {
    fetch("http://localhost:8000/productos/")
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("productos");
            contenedor.innerHTML = "";
            data.forEach(p => {
                const card = document.createElement("article");
                card.innerHTML = `
                    <img src="${p.imagen}" />
                    <h2>${p.nombre}</h2>
                    <h4>${p.descripcion}</h4>
                    <p>Precio: $${p.precio} COP</p>
                    <button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio})">Agregar</button>
                    ${rol === "admin" ? `<button onclick="eliminarProducto(${p.id})">🗑️</button>` : ""}
                `;
                contenedor.appendChild(card);
            });
            if (rol === "admin") {
                const form = document.createElement("form");
                form.innerHTML = `
                    <h3>Agregar nuevo producto</h3>
                    <input placeholder="Nombre" id="nombre" />
                    <input placeholder="Descripción" id="descripcion" />
                    <input placeholder="Precio" id="precio" type="number" />
                    <input placeholder="URL Imagen" id="imagen" />
                    <button type="button" onclick="agregarProducto()">Guardar</button>
                `;
                contenedor.appendChild(form);
            }
        });
}

function agregarProducto() {
    const nuevo = {
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        precio: parseInt(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value
    };
    fetch("http://localhost:8000/productos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
    }).then(() => cargarProductos());
}

function eliminarProducto(id) {
    fetch(`http://localhost:8000/productos/${id}`, { method: "DELETE" })
        .then(() => cargarProductos());
}

function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    alert(`${nombre} agregado al carrito.`);
    mostrarCarrito();
}

function AbrirElCarrito() {
    document.getElementById("carrito").style.display = "block";
    mostrarCarrito();
}

function cerrarCarrito() {
    document.getElementById("carrito").style.display = "none";
}

function mostrarCarrito() {
    const lista = document.getElementById("productosAgregadosAlCarrito");
    lista.innerHTML = "";
    let total = 5000; // Envío fijo
    carrito.forEach(p => {
        lista.innerHTML += `<p>${p.nombre} - $${p.precio}</p>`;
        total += p.precio;
    });
    document.getElementById("total").textContent = `Total: $${total} COP`;
}

function finalizarCompra() {
    if (!usuario || carrito.length === 0) return alert("Debes iniciar sesión y tener productos.");
    document.getElementById("procesando").classList.remove("none");
    setTimeout(() => {
        document.getElementById("procesando").classList.add("none");
        alert("Compra realizada con éxito");
        carrito = [];
        cerrarCarrito();
    }, 2000);
}
