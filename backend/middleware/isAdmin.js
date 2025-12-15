module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado: se requiere rol administrador" });
  }

  next();
};
