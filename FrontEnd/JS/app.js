// Utilidad para mostrar mensajes de error
const mostrarMensaje = (mensaje, tipo = 'error') => {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.className = `mensaje-${tipo}`;
  mensajeDiv.textContent = mensaje;
  document.body.appendChild(mensajeDiv);
  setTimeout(() => mensajeDiv.remove(), 3000);
};

let productos = [];

// Función asíncrona para cargar productos
async function cargarProductos() {
  try {
      const response = await fetch('/FrontEnd/json/productos.json'); 
      if (!response.ok) {
          throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
          throw new Error('Formato de datos inválido');
      }
      productos = data;
      creacionProducto();
  } catch (error) {
      mostrarMensaje('No se pudieron cargar los productos. Por favor, intente más tarde.'); 
  }
}

const root = document.querySelector("#root");
if (!root) {
  mostrarMensaje('Error: Elemento root no encontrado');
}

const cartContainer = document.createElement("div");
cartContainer.classList.add("cart-container");
document.body.appendChild(cartContainer);



const creacionProducto = () => {
  if (!root) return;
  
  if (!Array.isArray(productos) || productos.length === 0) {
      root.innerHTML = '<p>No hay productos disponibles</p>';
      return;
  }

  root.innerHTML = ''; // Limpiar contenedor antes de agregar productos
  
  productos.forEach(producto => {
      if (!producto) return;
      
      const { id, marca, codigo, descripcion, aplicacion, imagen, precio } = producto;
      const card = document.createElement("div");
      card.classList.add('cards');
      card.innerHTML = `
          <img src="${marca || ''}" onerror="this.src='./img/placeholder.jpg'">
          <img src="${imagen || ''}" alt="${descripcion || 'Producto'}" class="card-img" onerror="this.src='./img/placeholder.jpg'">
          <h3 class="card-code">${codigo || 'Sin código'}</h3>
          <h3 class="card-price">$${(precio || 0).toFixed(2)}</h3>
          <h4 class="card-name">${descripcion || 'Sin descripción'}</h4>
          <h5 class="card-aplicacion">${aplicacion || 'Sin aplicación'}</h5>
          <button class="boton" id="${id}" >Agregar al carrito</button>
      `;
      root.appendChild(card);
  });
  
  loadEvents();
  updateCart();
  addCartHoverListeners();
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await cargarProductos();
  updateCart();
});