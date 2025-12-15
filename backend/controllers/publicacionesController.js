// backend/controllers/publicacionesController.js
const db = require("../config_db");

module.exports = {

  // GET /api/publicaciones
  obtenerPublicaciones: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.id, p.titulo, p.contenido, p.fecha_publicacion,
               u.id AS autorId, 
               u.nombre AS autorNombre, 
               u.email AS autorEmail
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.fecha_publicacion DESC
      `);

      return res.json(rows);

    } catch (err) {
      console.error("Error obteniendo publicaciones:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },


  // POST /api/publicaciones
  crearPublicacion: async (req, res) => {
    const { titulo, contenido } = req.body;
    const usuario_id = req.user.id; // viene del token

    if (!titulo || !contenido) {
      return res.status(400).json({ msg: "Título y contenido son obligatorios" });
    }

    try {
      const [result] = await db.query(
        "INSERT INTO publicaciones (usuario_id, titulo, contenido) VALUES (?, ?, ?)",
        [usuario_id, titulo, contenido]
      );

      // Obtener la publicación recién creada con info del usuario
      const [nuevaPub] = await db.query(`
        SELECT p.id, p.titulo, p.contenido, p.fecha_publicacion,
               u.id AS autorId, u.nombre AS autorNombre, u.email AS autorEmail
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.id = ?
      `, [result.insertId]);

      return res.json(nuevaPub[0]);

    } catch (err) {
      console.error("Error creando publicación:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },


  // DELETE /api/publicaciones/:id
  eliminarPublicacion: async (req, res) => {
    const { id } = req.params;

    try {
      // Obtener publicación para ver si el usuario es el autor
      const [rows] = await db.query(
        "SELECT usuario_id FROM publicaciones WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ msg: "Publicación no encontrada" });
      }

      const esAutor = rows[0].usuario_id === req.user.id;
      const esAdmin = req.user.rol === "admin";

      if (!esAutor && !esAdmin) {
        return res.status(403).json({ msg: "No tienes permiso para eliminar esto" });
      }

      await db.query("DELETE FROM publicaciones WHERE id = ?", [id]);

      return res.json({ msg: "Publicación eliminada" });

    } catch (err) {
      console.error("Error eliminando publicación:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  // PATCH /api/publicaciones/:id
editarPublicacion: async (req, res) => {
  const { id } = req.params;
  const { titulo, contenido } = req.body;

  if (!titulo && !contenido) {
    return res.status(400).json({ msg: "Debes enviar al menos un campo para editar" });
  }

  try {
    const [rows] = await db.query(
      "SELECT usuario_id FROM publicaciones WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Publicación no encontrada" });
    }

    // Solo el autor puede editar, admin NO puede hacerlo
    const esAutor = rows[0].usuario_id === req.user.id;

    if (!esAutor) {
      return res.status(403).json({ msg: "No tienes permiso para editar esta publicación" });
    }

    await db.query(
      "UPDATE publicaciones SET titulo = ?, contenido = ? WHERE id = ?",
      [titulo, contenido, id]
    );

    return res.json({ msg: "Publicación editada correctamente" });

  } catch (err) {
    console.error("Error editando publicación:", err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
},

  obtenerLikes: async (req, res) => {
    const publicacionId = req.params.id;
    const usuarioId = req.user.id;

    try {
        const [likes] = await db.query(
            "SELECT COUNT(*) AS total FROM likes WHERE publicacionId = ?",
            [publicacionId]
        );

        const [yaDioLike] = await db.query(
            "SELECT * FROM likes WHERE usuarioId = ? AND publicacionId = ?",
            [usuarioId, publicacionId]
        );

        res.json({
            likes: likes[0].total,
            likedByUser: yaDioLike.length > 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo likes" });
    }
},

  toggleLike: async (req, res) => {
    const publicacionId = req.params.id;
    const usuarioId = req.user.id;

    try {
        // ¿Ya existe?
        const [existe] = await db.query(
            "SELECT * FROM likes WHERE usuarioId = ? AND publicacionId = ?",
            [usuarioId, publicacionId]
        );

        if (existe.length > 0) {
            // Quita el like
            await db.query(
                "DELETE FROM likes WHERE usuarioId = ? AND publicacionId = ?",
                [usuarioId, publicacionId]
            );
        } else {
            // Da like
            await db.query(
                "INSERT INTO likes (usuarioId, publicacionId) VALUES (?, ?)",
                [usuarioId, publicacionId]
            );
        }

        // Devolver el estado actualizado
        const [likes] = await db.query(
            "SELECT COUNT(*) AS total FROM likes WHERE publicacionId = ?",
            [publicacionId]
        );

        const [yaDioLike] = await db.query(
            "SELECT * FROM likes WHERE usuarioId = ? AND publicacionId = ?",
            [usuarioId, publicacionId]
        );

        res.json({
            likes: likes[0].total,
            likedByUser: yaDioLike.length > 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al alternar like" });
    }
},



};
