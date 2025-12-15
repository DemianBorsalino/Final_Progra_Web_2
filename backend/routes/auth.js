//backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const usuarioController = require("../controllers/usuarioController")
// Rutas de autenticación
router.post("/login", authController.login);
router.post("/register", authController.register);
//router.delete("/usuarios/:id", auth, isAdmin, usuarioController.eliminarUsuario);


module.exports = router;
