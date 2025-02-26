const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      console.log(errors)
      return res.status(400).json({ success: false, message: errors });
    }
    next();
  };
  
  module.exports = validateRequest;