// backend/controllers/usuarioController.js
const db = require("../config_db");
const bcrypt = require("bcrypt");

module.exports = {
  // ================= PERFIL =================
  obtenerPerfil: async (req, res) => {
    const userId = req.user.id;

    try {
      const [userRows] = await db.query(
        "SELECT id, nombre, email, fecha_registro, rol FROM usuarios WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      const usuario = userRows[0];

      const [pubRows] = await db.query(
        "SELECT COUNT(*) AS total FROM publicaciones WHERE usuario_id = ?",
        [userId]
      );

      return res.json({
        ...usuario,
        postsCreados: pubRows[0].total,
      });

    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  actualizarPerfil: async (req, res) => {
    const userId = req.user.id;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({ msg: "Nombre y email son obligatorios" });
    }

    try {
      const [emailRows] = await db.query(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [email, userId]
      );

      if (emailRows.length > 0) {
        return res.status(400).json({ msg: "El email ya está en uso" });
      }

      await db.query(
        "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
        [nombre, email, userId]
      );

      return res.json({ msg: "Perfil actualizado correctamente" });

    } catch (error) {
      console.error("Error actualizando perfil:", error);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },

  // ================= CONTRASEÑA =================
  cambiarPassword: async (req, res) => {
    const userId = req.user.id;
    const { actual, nueva } = req.body;

    if (!actual || !nueva) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    try {
      // Obtener hash actual
      const [rows] = await db.query(
        "SELECT clave FROM usuarios WHERE id = ?",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      const hashActual = rows[0].clave;

      // Verificar contraseña actual
      const coincide = await bcrypt.compare(actual, hashActual);

      if (!coincide) {
        return res.status(400).json({ msg: "La contraseña actual es incorrecta" });
      }

      // Hashear nueva contraseña
      const nuevaHash = await bcrypt.hash(nueva, 10);

      // Guardar
      await db.query(
        "UPDATE usuarios SET clave = ? WHERE id = ?",
        [nuevaHash, userId]
      );

      return res.json({ msg: "Contraseña actualizada correctamente" });

    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },
};
