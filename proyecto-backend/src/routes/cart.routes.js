const { Router } = require("express");
const router = Router();
const controller = require("../controllers/cart.controller");
const middlewares = require("../middlewares/middlewares");

//? CART

router.post("/", controller.newCart); 
router.delete("/:id", controller.deleteCart); 
router.get("/:id/products", controller.getProductsInCart); 
router.post("/:id/products", controller.saveProductInCart); // TODO Agregar un producto al carro por su ID - terminar de implementar
router.delete("/:id/products/:id_prod", controller.deleteProductInCart); // TODO Eliminar un producto de un carrito por su id de producto y de carrito

module.exports = router;
