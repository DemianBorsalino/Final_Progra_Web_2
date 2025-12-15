//backend/routes/authController.js
const db = require("../config_db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  // POST /api/login
  login: async (req, res) => {
    const { email, clave } = req.body;

    if (!email || !clave) {
      return res.status(400).json({ msg: "Email y clave son obligatorios" });
    }

    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (rows.length === 0) {
        return res.status(401).json({ msg: "Usuario no encontrado" });
      }

      const user = rows[0];

      // Comparar contraseña hasheada
      const match = await bcrypt.compare(clave, user.clave);
      if (!match) {
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      }

      // Crear token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET || "secreto123",
        { expiresIn: "7d" }
      );

      return res.json({
        msg: "Login correcto",
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol
        }
      });

    } catch (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  },


  // POST /api/register
  register: async (req, res) => {
    const { email, clave, nombre } = req.body;

    if (!email || !clave) {
     return res.status(400).json({ msg: "Email y clave son obligatorios" });
    }

    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (rows.length > 0) {
        return res.status(400).json({ msg: "El email ya está registrado" });
      }

     const hashed = await bcrypt.hash(clave, 10);

      const [result] = await db.query(
        "INSERT INTO usuarios (email, clave, nombre, rol) VALUES (?, ?, ?, 'usuario')",
        [email, hashed, nombre || null]
      );

    return res.json({ msg: "Usuario registrado", id: result.insertId });

  } catch (err) {
      console.error("Error en register:", err);
      return res.status(500).json({ msg: "Error en el servidor" });
    }
  }
};
