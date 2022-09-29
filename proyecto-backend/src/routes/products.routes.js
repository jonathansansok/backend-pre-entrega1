const { Router } = require("express");
const router = Router();
const controller = require("../controllers/products.controller");
const { completedFields, adminAuth } = require("../middlewares/middlewares");

//? PRODUCTS

router.get("/", adminAuth(true), controller.getAll);
router.get("/:id", adminAuth(true), controller.getById);
router.post("/", adminAuth(false), completedFields, controller.post);
router.put("/:id", adminAuth(false), completedFields, controller.put);
router.delete("/:id", adminAuth(false), controller.delete);

module.exports = router;
