// backend/controllers/comentariosController.js
const db = require("../config_db");

module.exports = {

  // GET /api/comentarios/:idPublicacion
  obtenerComentarios: async (req, res) => {
    const { idPublicacion } = req.params;

    try {
      const [rows] = await db.query(`
        SELECT c.id, c.contenido, c.fecha_comentario,
               u.id AS autorId,
               u.nombre AS autorNombre
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.publicacion_id = ?
        ORDER BY c.fecha_comentario ASC
      `, [idPublicacion]);

      return res.json(rows);

    } catch (err) {
      console.error("Error obteniendo comentarios:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },


  // POST /api/comentarios
  crearComentario: async (req, res) => {
    const { contenido, publicacion_id } = req.body;
    const usuario_id = req.user.id; // del token

    if (!contenido || !publicacion_id) {
      return res.status(400).json({ msg: "Contenido y publicación son obligatorios" });
    }

    try {
      const [result] = await db.query(`
        INSERT INTO comentarios (publicacion_id, usuario_id, contenido)
        VALUES (?, ?, ?)
      `, [publicacion_id, usuario_id, contenido]);

      const [nuevo] = await db.query(`
        SELECT c.id, c.contenido, c.fecha_comentario,
               u.id AS autorId,
               u.nombre AS autorNombre
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.id = ?
      `, [result.insertId]);

      return res.json(nuevo[0]);

    } catch (err) {
      console.error("Error creando comentario:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },


  // DELETE /api/comentarios/:id
  eliminarComentario: async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db.query(
        "SELECT usuario_id FROM comentarios WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ msg: "Comentario no encontrado" });
      }

      const esAutor = rows[0].usuario_id === req.user.id;
      const esAdmin = req.user.rol === "admin";

      if (!esAutor && !esAdmin) {
        return res.status(403).json({ msg: "No tienes permiso para eliminar este comentario" });
      }

      await db.query("DELETE FROM comentarios WHERE id = ?", [id]);

      return res.json({ msg: "Comentario eliminado" });

    } catch (err) {
      console.error("Error eliminando comentario:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  // PATCH /api/comentarios/:id

  editarComentario: async (req, res) => {
  const { id } = req.params;
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).json({ msg: "Contenido requerido" });
  }

  try {
    const [rows] = await db.query(
      "SELECT usuario_id FROM comentarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Comentario no encontrado" });
    }

    const esAutor = rows[0].usuario_id === req.user.id;
    const esAdmin = req.user.rol === "admin";

    if (!esAutor && !esAdmin) {
      return res.status(403).json({ msg: "No tienes permiso para editar este comentario" });
    }

    await db.query(
      "UPDATE comentarios SET contenido = ? WHERE id = ?",
      [contenido, id]
    );

    return res.json({ msg: "Comentario editado correctamente" });

  } catch (err) {
    console.error("Error editando comentario:", err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
}

};
