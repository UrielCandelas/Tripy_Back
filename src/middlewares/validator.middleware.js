//Se exporta la constante que valida si el esquema es valido
export const validateSchema = (schema) => (req, res, next) => {
    try {
      //Envia los datos del json de la peticion a los esquemas
      schema.parse(req.body);
      next();
    } catch (error) {
       //Si no cumple con los esquemas envia un estado 400
      return res.status(400).json(error.errors.map((error) => error.message));
      
    }
  };