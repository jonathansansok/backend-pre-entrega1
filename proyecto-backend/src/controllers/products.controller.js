//! CONTENEDOR /////////////////////////////////
const Container = require("../models/Container");
const contenedor = new Container("src/db/products.json");
//! CONTENEDOR /////////////////////////////////
const controller = {};

//? DEVUELVE TODOS LOS PRODUCTOS

controller.getAll = async (req, res) => {
  const data = await contenedor.getAll();
  res.status(200).json(data);
};

//? DEVUELVE UN PRODUCTO SEGÚN SU ID

controller.getById = async (req, res) => {
  const data = await contenedor.getById(req.params.id);

  //! Si el id generado no coincide con ningún producto, devuelve null; de lo contrario, envía la información solicitada
  data
    ? res.status(200).json(data)
    : res.status(404).json({ error: "Producto no encontrado" });
};

//? RECIBE Y AGREGA UN PRODUCTO, Y LO DEVUELVE CON SU ID ASIGNADO

controller.post = async (req, res) => {
  const newObject = req.body;
  const data = await contenedor.save(newObject);
  data == null
    ? res.status(500).json({ message: `[[${newObject.title}]] ya existe en el archivo` })
    : res.status(200).json({
        message: `Se ha agregado el producto ${data.title}`,
        "new product": data,
      });
};

//? RECIBE Y ACTUALIZA UN PRODUCTO SEGÚN SU ID

controller.put = async (req, res) => {
  const { id } = req.params;
  const newObject = req.body;
  const data = await contenedor.update(+id, newObject);

  data != null
    ? res.status(200).json({
        message: `Producto ${id} modificado con éxito`,
        "new product": newObject,
      })
    : res.status(404).json({ error: "Producto no encontrado" });
};

//? ELIMINA UN PRODUCTO SEGÚN SU ID

controller.delete = async (req, res) => {
  const data = await contenedor.deleteById(req.params.id);
  data
    ? res.status(200).send({
        message: `Se ha eliminado el producto`,
        "product deleted": data,
      })
    : res.status(404).send({ message: "No se ha encontrado el producto" });
};

module.exports = controller;
