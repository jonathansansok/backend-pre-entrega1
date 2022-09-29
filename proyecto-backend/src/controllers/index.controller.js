const controller = {};

controller.index = (req, res) => {
  res.status(200).json({ message: "página de inicio" });
};

module.exports = controller;
