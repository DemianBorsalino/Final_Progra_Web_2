//src/pages/CambiarPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CambiarPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    repetir: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!form.actual || !form.nueva || !form.repetir) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (form.nueva !== form.repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/usuario/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          actual: form.actual,
          nueva: form.nueva,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al cambiar la contraseña");
        return;
      }

      setMensaje("Contraseña actualizada correctamente ✔");

      // cerrar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // si lo usás

      // pequeña pausa para que se vea el mensaje (opcional)
      setTimeout(() => {
        navigate("/");
      }, 1500);

      // opcional: cerrar sesión después
      // localStorage.removeItem("token");
      // window.location.href = "/login";

    } catch (err) {
      console.error(err);
      setError("No se pudo conectar al servidor");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-3">Cambiar contraseña</h4>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Contraseña actual</label>
            <input
              type="password"
              className="form-control"
              name="actual"
              value={form.actual}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Repetir nueva contraseña</label>
            <input
              type="password"
              className="form-control"
              name="repetir"
              value={form.repetir}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary w-100">
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
