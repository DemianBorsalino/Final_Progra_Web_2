import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (clave !== clave2) {
      alert("Las contraseñas no coinciden");
      return;
    }

  try {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        email,
        clave,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.msg || "Error al registrar");
      return;
    }

    alert("Cuenta creada correctamente");
    navigate("/");
  } catch (error) {
    console.error("Error al registrar:", error);
    alert("No se pudo conectar con el servidor");
  }
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Crear cuenta</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

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

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Repetir contraseña"
            value={clave2}
            onChange={(e) => setClave2(e.target.value)}
            required
          />

          <button className="btn btn-success w-100 mb-3">Registrarse</button>
        </form>

        <button className="btn btn-link w-100 p-0" onClick={() => navigate("/")}>
          ¿Ya tenés cuenta? Iniciar sesión
        </button>
      </div>
    </div>
  );
}