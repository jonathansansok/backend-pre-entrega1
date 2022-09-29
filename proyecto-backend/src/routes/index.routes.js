const { Router } = require("express");
const router = Router();
const productsRoute = require("./products.routes");
const cartRoute = require("./cart.routes");
const controller = require("../controllers/index.controller");

//? INDEX
router.get("/", controller.index);
router.use("/products", productsRoute);
router.use("/cart", cartRoute);

module.exports = router;
