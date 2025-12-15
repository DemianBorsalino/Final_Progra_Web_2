// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          clave,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError(data.msg || "Credenciales incorrectas");
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Guardar usuario
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/foro");

    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100 mb-3">Ingresar</button>
        </form>

        <div className="d-flex justify-content-between">

          <button
            className="btn btn-link w-100 p-0"
            onClick={() => navigate("/registrarte")}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
