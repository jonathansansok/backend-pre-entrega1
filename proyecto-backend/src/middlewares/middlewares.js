const middlewares = {};

//? completedFields revisará si el input del formulario o la query recibe todos los parámetros solicitados // Método POST

middlewares.completedFields = (req, res, next) => {
  const { title, price, thumbnail } = req.body;
  title && price && thumbnail
    ? next()
    : res.status(300).send({ message: "Debe completar todos los campos" });
};

//? Permisos de administrador

middlewares.adminAuth = (permissions) => {


// return ("/:admin", (req, res, next)=>{
//   const administrador = req.params
//   administrador === "admin" 
//   ? next()
//       : res
//           .status(401)
//           .json({ error: -1, description: "unauthorized permission" });
// })



  return (req, res, next) => {
    permissions === true
      ? next()
      : res
          .status(401)
          .json({ error: -1, description: "unauthorized permission" });
  };
};

module.exports = middlewares;
