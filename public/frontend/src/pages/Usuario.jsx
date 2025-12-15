// src/pages/Usuario.jsx
import { useEffect, useState } from "react";
import "./usuario.css";

export default function Usuario() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // edición
  const [editando, setEditando] = useState(false);
  const [nombreEdit, setNombreEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");

  // ===========================
  // CARGAR PERFIL
  // ===========================
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3001/api/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.msg || "Error cargando datos");
          return;
        }

        setUsuario(data);
        setNombreEdit(data.nombre);
        setEmailEdit(data.email);
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar al servidor");
      }
    };

    fetchUsuario();
  }, []);

  // ===========================
  // GUARDAR CAMBIOS PERFIL
  // ===========================
  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/usuario/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nombreEdit,
          email: emailEdit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.msg || "Error actualizando perfil");
        return;
      }

      setUsuario({
        ...usuario,
        nombre: nombreEdit,
        email: emailEdit,
      });

      setEditando(false);
      setMensaje("Perfil actualizado correctamente ✔");

    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión");
    }
  };

  // ===========================
  // ESTADOS DE CARGA / ERROR
  // ===========================
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mt-4">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">

        <h3 className="mb-3">Mi perfil</h3>

        {mensaje && (
          <div className="alert alert-info">{mensaje}</div>
        )}

        {!editando ? (
          <>
            <p><b>Nombre:</b> {usuario.nombre}</p>
            <p><b>Email:</b> {usuario.email}</p>
            <p>
              <b>Miembro desde:</b>{" "}
              {new Date(usuario.fecha_registro).toLocaleDateString()}
            </p>
            <p><b>Publicaciones creadas:</b> {usuario.postsCreados}</p>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setEditando(true)}
              >
                Editar perfil
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={() => (window.location.href = "/Cambiarpassword")}
              >
                Cambiar contraseña
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input
                className="form-control"
                value={nombreEdit}
                onChange={(e) => setNombreEdit(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={emailEdit}
                onChange={(e) => setEmailEdit(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={guardarCambios}
              >
                Guardar cambios
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditando(false);
                  setNombreEdit(usuario.nombre);
                  setEmailEdit(usuario.email);
                  setMensaje("");
                }}
              >
                Cancelar
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
