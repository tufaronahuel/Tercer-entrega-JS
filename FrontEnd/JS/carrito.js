// Manejo del carrito con validación
let carrito = (() => {
    try {
        const stored = localStorage.getItem("carrito");
        return stored ? JSON.parse(stored) : [];
    } catch {
        mostrarMensaje('Error al cargar el carrito');
        return [];
    }
  })();
  
  let isCartMinimized = false;
  
  const updateCart = () => {
    if (!cartContainer) return;
    
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
  
    if (!Array.isArray(carrito) || carrito.length === 0) {
        cartContent.innerHTML = "<p>El carrito está vacío</p>";
    } else {
        carrito.forEach(item => {
            if (!item) return;
            
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.imagen || ''}" alt="${item.descripcion || 'Producto'}" class="cart-item-img">
                <div class="cart-item-info">
                    <h3>${item.descripcion || 'Producto sin descripción'}</h3>
                    <p>Precio: $${(item.precio || 0).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            `;
            cartContent.appendChild(cartItem);
        });
    }
  
    const total = carrito.reduce((acc, item) => acc + (item?.precio || 0), 0);
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
  
    try {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (error) {
        mostrarMensaje('Error al guardar el carrito');
    }
  
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
    if (!product || !product.id) {
        mostrarMensaje('Error al agregar el producto');
        return;
    }
    carrito.push(product);
    updateCart();
    mostrarMensaje('Producto agregado al carrito', 'exito');
  };
  
  const removeFromCart = (productId) => {
    if (!productId) return;
    carrito = carrito.filter(item => item.id !== productId);
    updateCart();
    mostrarMensaje('Producto eliminado del carrito', 'exito');
  };
  
  const loadEvents = () => {
    const buttons = document.querySelectorAll('.boton');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const id = Number(button.id);
            if (isNaN(id)) return;
            
            const selectedProducto = productos.find(producto => producto.id === id);
            if (selectedProducto) {
                addToCart(selectedProducto);
            }
        });
    });
  
    cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const productId = Number(e.target.getAttribute('data-id'));
            if (!isNaN(productId)) {
                removeFromCart(productId);
            }
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