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
  console.log(data, "DATA 33");
  data
    ? res.status(200).json({
        message: "Se obtuvieron los productos del carrito",
        "cart id": `${req.params.id}`,
        products: data.productos,
      })
    : res.status(401).json({
        message: "El carrito no tiene productos", //FIXME REVISAR LUEGO
      });
};

controller.saveProductInCart = async (req, res) => { //TODO Mejorar la funcionalidad - terminar de implementar
  const productToAdd = await contenedor.getById(req.body.id)

  const data = await cart.addProductToCart(req.params.id, productToAdd);

  res //  TODO Implementar respuesta encaso que no exista carrito
    .status(200)
    .json({
      message: "Se añadió un producto al carrito",
      "products in cart": data.productos,
    });
};

controller.deleteProductInCart = async (req, res)=>{
  const {id, id_prod} = req.params
  const data = await cart.deleteProductInCartById(id, id_prod)

  res.status(200).json({message:`Se ha eliminado el producto ${id_prod} del carrito`})
}

module.exports = controller;
