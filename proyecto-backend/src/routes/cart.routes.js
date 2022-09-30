const { Router } = require("express");
const router = Router();
const controller = require("../controllers/cart.controller");
const { adminAuth } = require("../middlewares/middlewares");

//? CART

router.post("/", adminAuth(true), controller.newCart);
router.delete("/:id", adminAuth(true), controller.deleteCart);
router.get("/:id/products", adminAuth(true), controller.getProductsInCart);
router.post("/:id/products", adminAuth(true), controller.saveProductInCart);
router.delete(
  "/:id/products/:id_prod",
  adminAuth(true),
  controller.deleteProductInCart
);

module.exports = router;
