//backend/routes/comentarios.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const comentariosController = require("../controllers/comentariosController");

// Obtener comentarios de una publicación
router.get("/:idPublicacion", auth, comentariosController.obtenerComentarios);

// Crear un comentario
router.post("/", auth, comentariosController.crearComentario);

// Eliminar comentario (autor o admin)
router.delete("/:id", auth, comentariosController.eliminarComentario);

// Editar comentario
router.patch("/:id", auth, comentariosController.editarComentario);

module.exports = router;
