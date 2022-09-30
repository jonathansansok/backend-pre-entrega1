//! CONTENEDOR /////////////////////////////////
const Container = require("../models/Container");
const contenedor = new Container("src/db/products.json");

const Cart = require("../models/Cart");
const cart = new Cart("src/db/cart.json");
//! CONTENEDOR /////////////////////////////////
const controller = {};

controller.newCart = async (req, res) => {
  const data = await cart.newCart();
  res.status(200).json({
    date: `${data.timestamp}`,
    message: "Se ha creado un nuevo carrito",
    id: `${data.id}`,
  });
};

controller.deleteCart = async (req, res) => {
  const data = await cart.deleteCartById(req.params.id);
  data
    ? res.status(200).json({
        message: `Se ha eliminado el carrito`,
        "cart deleted": `${req.params.id}`,
      })
    : res
        .status(404)
        .json({ message: "No se ha encontrado el carrito. No existe" });
};

controller.getProductsInCart = async (req, res) => {
  const data = await cart.getCartById(req.params.id);
  if (data === null) {
    res
      .status(200)
      .json({ error: "Not found", message: "No se encontró el carrito" });
  } else if (data.products.length > 0) {
    res.status(200).json({
      message: "Se obtuvieron los productos del carrito",
      "cart id": data.id,
      products: data.products,
    });
  } else {
    res.status(200).json({
      message: "Not found",
      "cart id": data.id,
      products: "El carrito no tiene productos",
    });
  }
};

controller.saveProductInCart = async (req, res) => {
  const productToAdd = await contenedor.getById(req.body.id);

  const data = await cart.addProductToCart(req.params.id, productToAdd);

  data != null
    ? res.status(200).json({
        message: "Se añadió un producto al carrito",
        "products in cart": data,
      })
    : res.status(200).json({
        error: "No se puede añadir el producto",
        message: "El carrito no existe",
      });
};

controller.deleteProductInCart = async (req, res) => {
  const { id, id_prod } = req.params;
  const data = await cart.deleteProductInCartById(id, id_prod);
  console.log(data, "data 63 producto eliminado");
  data != undefined
    ? res.status(200).json({
        message: `Se ha eliminado el producto ${data.title} del carrito ${id}`,
      })
    : res.status(200).json({ error: "No existe el producto en el carrito" });
};

module.exports = controller;
