// Manejo del carrito con validación
let carrito = (() => {
    try {
      const stored = localStorage.getItem("carrito")
      return stored ? JSON.parse(stored) : []
    } catch {
      mostrarMensaje("Error al cargar el carrito")
      return []
    }
  })()
  
  let isCartMinimized = false
  
  const updateCart = () => {
    if (!cartContainer) return
  
    cartContainer.innerHTML = ""
  
    const cartHeader = document.createElement("div")
    cartHeader.classList.add("cart-header")
  
    const cartTitle = document.createElement("h2")
    cartTitle.textContent = "Carrito de Compras"
    cartHeader.appendChild(cartTitle)
  
    const minimizeButton = document.createElement("button")
    minimizeButton.classList.add("minimize-cart")
    minimizeButton.textContent = isCartMinimized ? "Maximizar" : "Minimizar"
    minimizeButton.addEventListener("click", toggleCartMinimize)
    cartHeader.appendChild(minimizeButton)
  
    cartContainer.appendChild(cartHeader)
  
    const cartContent = document.createElement("div")
    cartContent.classList.add("cart-content")
  
    if (!Array.isArray(carrito) || carrito.length === 0) {
      cartContent.innerHTML = "<p>El carrito está vacío</p>"
    } else {
      carrito.forEach((item) => {
        if (!item) return
  
        const cartItem = document.createElement("div")
        cartItem.classList.add("cart-item")
        cartItem.innerHTML = `
                  <img src="${item.imagen || ""}" alt="${item.descripcion || "Producto"}" class="cart-item-img">
                  <div class="cart-item-info">
                      <h3>${item.descripcion || "Producto sin descripción"}</h3>
                      <p>Precio: $${(item.precio || 0).toFixed(2)}</p>
                      <div class="quantity-controls">
                          <button class="quantity-btn minus" data-id="${item.id}">-</button>
                          <span class="quantity">${item.quantity}</span>
                          <button class="quantity-btn plus" data-id="${item.id}">+</button>
                      </div>
                  </div>
                  <button class="remove-item" data-id="${item.id}">Eliminar</button>
              `
        cartContent.appendChild(cartItem)
      })
    }
  
    const total = carrito.reduce((acc, item) => acc + (item?.precio || 0) * (item?.quantity || 1), 0)
    const totalElement = document.createElement("div")
    totalElement.classList.add("cart-total")
    totalElement.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`
    cartContent.appendChild(totalElement)
  
    const clearCartButton = document.createElement("button")
    clearCartButton.textContent = "Vaciar carrito"
    clearCartButton.classList.add("clear-cart")
    clearCartButton.addEventListener("click", clearCart)
    cartContent.appendChild(clearCartButton)
  
    const checkoutButton = document.createElement("button")
    checkoutButton.textContent = "Finalizar compra"
    checkoutButton.classList.add("checkout-btn")
    checkoutButton.addEventListener("click", showCheckoutModal)
    cartContent.appendChild(checkoutButton)
  
    cartContainer.appendChild(cartContent)
  
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito))
    } catch (error) {
      mostrarMensaje("Error al guardar el carrito")
    }
  
    if (isCartMinimized) {
      cartContainer.classList.add("minimized")
    } else {
      cartContainer.classList.remove("minimized")
    }
  }
  
  const toggleCartMinimize = () => {
    isCartMinimized = !isCartMinimized
    updateCart()
  }
  
  const clearCart = () => {
    carrito = []
    updateCart()
  }
  
  const addToCart = (product) => {
    if (!product || !product.id) {
      mostrarMensaje("Error al agregar el producto")
      return
    }
    const existingItem = carrito.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1
    } else {
      carrito.push({ ...product, quantity: 1 })
    }
    updateCart()
    mostrarMensaje("Producto agregado al carrito", "exito")
  }
  
  const removeFromCart = (productId) => {
    if (!productId) return
    carrito = carrito.filter((item) => item.id !== productId)
    updateCart()
    mostrarMensaje("Producto eliminado del carrito", "exito")
  }
  
  const loadEvents = () => {
    const buttons = document.querySelectorAll(".boton")
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.id)
        if (isNaN(id)) return
  
        const selectedProducto = productos.find((producto) => producto.id === id)
        if (selectedProducto) {
          addToCart(selectedProducto)
        }
      })
    })
  
    cartContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-item")) {
        const productId = Number(e.target.getAttribute("data-id"))
        if (!isNaN(productId)) {
          removeFromCart(productId)
        }
      } else if (e.target.classList.contains("quantity-btn")) {
        const productId = Number(e.target.getAttribute("data-id"))
        const change = e.target.classList.contains("plus") ? 1 : -1
        updateQuantity(productId, change)
      }
    })
  }
  
  const addCartHoverListeners = () => {
    cartContainer.addEventListener("mouseenter", () => {
      if (isCartMinimized) {
        cartContainer.classList.add("hover-expand")
      }
    })
  
    cartContainer.addEventListener("mouseleave", () => {
      if (isCartMinimized) {
        cartContainer.classList.remove("hover-expand")
      }
    })
  }
  
  const updateQuantity = (productId, change) => {
    const item = carrito.find((item) => item.id === productId)
    if (item) {
      item.quantity = Math.max(1, (item.quantity || 1) + change)
      updateCart()
    }
  }
  
  const showCheckoutModal = () => {
    const modal = document.createElement("div")
    modal.classList.add("checkout-modal")
    modal.innerHTML = `
          <div class="modal-content">
              <h2>Finalizar compra</h2>
              <form id="checkout-form">
                  <input type="text" id="name" placeholder="Nombre completo" required>
                  <input type="tel" id="phone" placeholder="Teléfono" required>
                  <input type="text" id="address" placeholder="Dirección" required>
                  <input type="email" id="email" placeholder="Email" required>
                  <select id="payment" required>
                      <option value="">Seleccione forma de pago</option>
                      <option value="credit">Tarjeta de crédito</option>
                      <option value="debit">Tarjeta de débito</option>
                      <option value="transfer">Transferencia bancaria</option>
                  </select>
                  <button type="submit">Confirmar compra</button>
              </form>
          </div>
      `
    document.body.appendChild(modal)
  
    document.getElementById("checkout-form").addEventListener("submit", handleCheckout)
  }
  
  const handleCheckout = (e) => {
    e.preventDefault()
    const name = document.getElementById("name").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value
    const email = document.getElementById("email").value
    const payment = document.getElementById("payment").value
  
    if (!name || !phone || !address || !email || !payment) {
      mostrarMensaje("Por favor, complete todos los campos", "error")
      return
    }
  
    if (!/^\d+$/.test(phone)) {
      mostrarMensaje("El teléfono debe contener solo números", "error")
      return
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarMensaje("Por favor, ingrese un email válido", "error")
      return
    }
  
    generateReceipt(name, phone, address, email, payment)
  }
  
  const generateReceipt = (name, phone, address, email, payment) => {
    const receiptModal = document.createElement("div")
    receiptModal.classList.add("receipt-modal")
  
    const total = carrito.reduce((acc, item) => acc + (item?.precio || 0) * (item?.quantity || 1), 0)
  
    const receiptContent = `
          <div class="modal-content">
              <h2>Comprobante de compra</h2>
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Teléfono:</strong> ${phone}</p>
              <p><strong>Dirección:</strong> ${address}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Forma de pago:</strong> ${payment}</p>
              <h3>Detalle de productos:</h3>
              <ul>
                   ${carrito.map((item) => `<li>${item.descripcion} - Cantidad: ${item.quantity} - Precio: $${(item.precio * item.quantity).toFixed(2)}</li>`).join("")}
              </ul>
              <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          </div>
      `
  
    receiptModal.innerHTML = receiptContent
    document.body.appendChild(receiptModal)
  
    // Clear the cart after successful purchase
    carrito = []
    updateCart()
  
    // Remove the checkout modal
    document.querySelector(".checkout-modal").remove()
  }

  
  
  