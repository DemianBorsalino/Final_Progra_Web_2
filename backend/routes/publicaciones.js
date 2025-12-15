// backend/routes/publicaciones.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const publicacionesController = require("../controllers/publicacionesController");

// Obtener todas las publicaciones
router.get("/", auth, publicacionesController.obtenerPublicaciones);

// Crear una nueva publicación
router.post("/", auth, publicacionesController.crearPublicacion);

// Eliminar publicación por ID (solo autor o admin)
router.delete("/:id", auth, publicacionesController.eliminarPublicacion);

// Editar publicaciones por ID (Solo autor)
router.patch("/:id", auth, publicacionesController.editarPublicacion);

// Obtener cantidad de likes y si el usuario ya dio like
router.get("/:id/likes", auth, publicacionesController.obtenerLikes);

// Alternar like (dar o quitar)
router.post("/:id/like", auth, publicacionesController.toggleLike);

module.exports = router;
