// Constructor de los productos
class Producto{ 
    constructor(id, marca, codigo, categoria, vehiculo, precio){ 
    this.id = id;
    this.marca = marca;
    this.codigo = codigo;
    this.categoria = categoria;
    this.vehiculo = vehiculo;
    this.precio = precio;}
}

// Arrays de productos
const productos = [
    new Producto(1, "sachs", "ZF3000000144", "embrague", "wolkswagen", 138500),
    new Producto(2, "luk", "620312700", "embrague", "chevrolet", 190324),
    new Producto(3, "sachs", "ZF3182654238", "crapodina", "volkswagen", 112329),
    new Producto(4, "luk", "510006511A1", "crapodina", "fiat", 113245),
    new Producto(5, "skf", "VKMA01107A", "distribucion", "chevrolet", 65000),
    new Producto(6, "ina", "530063010", "distribucion", "renault", 50987),
];

console.log(productos);

// El usuario debe colocar categoria o marca del producto que desea buscar
const categoriaUsuario = prompt("Buscar por categoria (embrague, crapodina, distribucion) o marca (sachs, luk, skf, ina)").toLowerCase().trim();

// Filtrar productos por categoría o marca 
const productosFiltrados = productos.filter(producto => 
    producto.categoria.toLowerCase() === categoriaUsuario || 
    producto.marca.toLowerCase() === categoriaUsuario
);

// Mostrar los productos filtrados o mensaje de no encontrado
if (productosFiltrados.length > 0) {
    console.log("Productos filtrados:", productosFiltrados);
} else {
    console.log("No se encontró el producto buscado.");
}







