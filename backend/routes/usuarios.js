// backend/routes/usuarios.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const usuarioController = require("../controllers/usuarioController");

router.get("/me", auth, usuarioController.obtenerPerfil);
router.patch("/me", auth, usuarioController.actualizarPerfil);
router.patch("/password", auth, usuarioController.cambiarPassword);

module.exports = router;