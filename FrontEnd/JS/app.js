// Constructor de los productos
class Producto {
    constructor(id, marca, codigo, descripcion, aplicacion, imagen, precio) {
      this.id = id;
      this.marca = marca;
      this.codigo = codigo;
      this.descripcion = descripcion;
      this.aplicacion = aplicacion;
      this.imagen = imagen;
      this.precio = precio;
    }
  }
  
  
  // Arrays de productos
  const productos = [
    new Producto(1, "./img/sachs.jpg", "ZF3000000144", "Kit de embrague", "FIAT / FIORINO / 1.3 8V FIRE / DESPUES 2006 FIAT / FIORINO / 1.4 EVO (NUEVA) / DESPUES 2014", './img/ZF3000000144.webp', 138559),
    new Producto(2, "./img/luk.jpg", "620312700", "Kit de embrague", "VOLKSWAGEN / FOX / 1.6 8V (98CV) MOTOR BAH (EA111) CAJA MQ>250 05.2004", "./img/620312700.webp", 190324),
    new Producto(3, "./img/sachs.jpg", "ZF3182654238", "Crapodina de embrague", "FORD / ECOSPORT / 1.6 16V SIGMA / DESPUES 2012 (PRODUCTO ORIGINAL)", "./img/ZF3182654238.webp", 112329),
    new Producto(4, "./img/luk.jpg", "510006511A1", "Crapodina de embrague", "FORD / ECOSPORT / 1.4 TDCI (68CV) VERSION CON VOLANTE BIMASA MOTOR DURATORQ TURBO COMMON RAIL (F6JA", "./img/510006511A1.webp", 113245),
    new Producto(5, "./img/skf.jpg", "VKMA01107A", "Kit de distribucion", "VOLKSWAGEN / FOX / 1.6 EA111 BAH , CFZ / 10.2003 ", "./img/VKMA01107A.webp", 65159),
    new Producto(6, "./img/ina.jpg", "530063010", "Kit de distribucion", "CHEVROLET / AGILE / 1.4 8V X14YX / 09.2009", "./img/530063010.webp", 50987),
  ];
  
  const root = document.querySelector("#root");
  const cartContainer = document.createElement("div");
  cartContainer.classList.add("cart-container");
  document.body.appendChild(cartContainer);
  
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let isCartMinimized = false;
  
  const updateCart = () => {
    cartContainer.innerHTML = "";
    
    const cartHeader = document.createElement("div");
    cartHeader.classList.add("cart-header");
    
    const cartTitle = document.createElement("h2");
    cartTitle.textContent = "Carrito de Compras";
    cartHeader.appendChild(cartTitle);
    
    const minimizeButton = document.createElement("button");
    minimizeButton.classList.add("minimize-cart");
    minimizeButton.textContent = isCartMinimized ? "Maximizar" : "Minimizar";
    minimizeButton.addEventListener("click", toggleCartMinimize);
    cartHeader.appendChild(minimizeButton);
    
    cartContainer.appendChild(cartHeader);
  
    const cartContent = document.createElement("div");
    cartContent.classList.add("cart-content");
    
    if (carrito.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío</p>";
    } else {
      carrito.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <img src="${item.imagen}" alt="${item.descripcion}" class="cart-item-img">
          <div class="cart-item-info">
            <h3>${item.descripcion}</h3>
            <p>Precio: $${item.precio.toFixed(2)}</p>
          </div>
          <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        cartContent.appendChild(cartItem);
      });
    }
    
    const total = carrito.reduce((acc, item) => acc + item.precio, 0);
    const totalElement = document.createElement("div");
    totalElement.classList.add("cart-total");
    totalElement.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
    cartContent.appendChild(totalElement);
  
    const clearCartButton = document.createElement("button");
    clearCartButton.textContent = "Vaciar carrito";
    clearCartButton.classList.add("clear-cart");
    clearCartButton.addEventListener("click", clearCart);
    cartContent.appendChild(clearCartButton);
  
    cartContainer.appendChild(cartContent);
  
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    if (isCartMinimized) {
      cartContainer.classList.add("minimized");
    } else {
      cartContainer.classList.remove("minimized");
    }
  };
  
  const toggleCartMinimize = () => {
    isCartMinimized = !isCartMinimized;
    updateCart();
  };
  
  const clearCart = () => {
    carrito = [];
    updateCart();
  };
  
  const addToCart = (product) => {
    carrito.push(product);
    updateCart();
  };
  
  const removeFromCart = (productId) => {
    carrito = carrito.filter(item => item.id !== productId);
    updateCart();
  };
  
  const loadEvents = () => {
    const buttons = document.querySelectorAll('.boton');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedProducto = productos.find(producto => producto.id === Number(button.id));
        addToCart(selectedProducto);
      });
    });
  
    cartContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const productId = Number(e.target.getAttribute('data-id'));
        removeFromCart(productId);
      }
    });
  };
  
  const addCartHoverListeners = () => {
    cartContainer.addEventListener('mouseenter', () => {
      if (isCartMinimized) {
        cartContainer.classList.add('hover-expand');
      }
    });
  
    cartContainer.addEventListener('mouseleave', () => {
      if (isCartMinimized) {
        cartContainer.classList.remove('hover-expand');
      }
    });
  };
  
  // Card de los productos
  const creacionProducto = () => {
      productos.forEach(producto => {
          const { id, marca, codigo, descripcion, aplicacion, imagen, precio } = producto;
          const card = document.createElement("div")
          card.classList.add('cards');
          card.innerHTML = `
              <img src="${marca}">
              <img src="${imagen}" alt="${descripcion}" class="card-img">
              <h3 class="card-code">${codigo}</h3>
              <h3 class="card-price">$${precio.toFixed(2)}</h3>
              <h4 class="card-name">${descripcion}</h4>
              <h5 class="card-aplicacion">${aplicacion}</h5>
              <button class="boton" id="${id}" >Agregar al carrito</button>
          `;
          root.appendChild(card)
      });
      loadEvents();
      updateCart();
      addCartHoverListeners();
  }
  
  creacionProducto();
  
  
  document.addEventListener('DOMContentLoaded', () => {
    updateCart();
  });
  
  















