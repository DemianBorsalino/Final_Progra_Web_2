//frontend/src/components/PostCard.jsx
import { useState, useEffect } from "react";
import "./post-card.css";
import { getUser, getToken } from "../services/authServices";

export default function PostCard({ id, titulo, contenido, autorNombre, autorId, fecha, onDelete, onUpdate }) {

  const user = getUser();

  // ------------------- ESTADOS -------------------
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  // --- edición de publicación ---
  const [editModal, setEditModal] = useState(false);
  const [tituloEdit, setTituloEdit] = useState(titulo);
  const [contenidoEdit, setContenidoEdit] = useState(contenido);

  // --- LIKES ---
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);

  const puedeEliminar =
    user && (Number(user.id) === Number(autorId) || user.rol === "admin");

  const puedeEditarPublicacion =
    user && Number(user.id) === Number(autorId);


  // ============================================================
  // ======================== LIKES ===============================
  // ============================================================

  const cargarLikes = async () => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:3000/api/publicaciones/${id}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      setLikes(data.likes);
      setLikedByUser(data.likedByUser);

    } catch (err) {
      console.error("Error obteniendo likes:", err);
    }
  };

  const toggleLike = async () => {
    try {
      const token = getToken();

      const res = await fetch(`http://localhost:3000/api/publicaciones/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setLikes(data.likes);
      setLikedByUser(data.likedByUser);

    } catch (err) {
      console.error("Error al dar/quitar like:", err);
    }
  };

  // cargar likes al montar
  useEffect(() => {
    cargarLikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ============================================================
  // =================== PUBLICACIÓN =============================
  // ============================================================

  const eliminarPublicacion = async () => {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;

    try {
      const token = getToken();

      await fetch(`http://localhost:3000/api/publicaciones/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (onDelete) onDelete(id);

    } catch (error) {
      console.error("Error eliminando publicación:", error);
      alert("No se pudo eliminar la publicación");
    }
  };


  const guardarEdicion = async () => {
    try {
      const token = getToken();

      const res = await fetch(`http://localhost:3000/api/publicaciones/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: tituloEdit,
          contenido: contenidoEdit
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Publicación actualizada ✔");
        setEditModal(false);

        if (onUpdate) onUpdate();  
      } else {
        alert(data.msg || "Error editando publicación");
      }

    } catch (err) {
      console.error("Error editando:", err);
      alert("No se pudo editar la publicación");
    }
  };


  // ============================================================
  // ======================= COMENTARIOS =========================
  // ============================================================

  const cargarComentarios = async () => {
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:3000/api/comentarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setComentarios(data);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
    }
  };

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);

    if (!mostrarComentarios) cargarComentarios();
  };

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    try {
      const token = getToken();

      await fetch("http://localhost:3000/api/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: nuevoComentario,
          publicacion_id: id
        })
      });

      setNuevoComentario("");
      cargarComentarios();

    } catch (err) {
      console.error("Error comentando:", err);
    }
  };

  const eliminarComentario = async (idComentario) => {
    if (!window.confirm("¿Eliminar comentario?")) return;

    try {
      const token = getToken();

      await fetch(`http://localhost:3000/api/comentarios/${idComentario}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setComentarios(comentarios.filter(c => c.id !== idComentario));

    } catch (err) {
      console.error("Error eliminando comentario:", err);
    }
  };

  const editarComentario = async (idComentario, contenidoActual) => {
    const nuevoTexto = prompt("Editar comentario:", contenidoActual);
    if (!nuevoTexto || !nuevoTexto.trim()) return;

    try {
      const token = getToken();

      await fetch(`http://localhost:3000/api/comentarios/${idComentario}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ contenido: nuevoTexto })
      });

      setComentarios(
        comentarios.map(c =>
          c.id === idComentario ? { ...c, contenido: nuevoTexto } : c
        )
      );

    } catch (err) {
      console.error("Error editando comentario:", err);
    }
  };


  // ============================================================
  // ======================== RENDER =============================
  // ============================================================

  return (
    <div className="post-card shadow-sm p-3 mb-3 bg-white rounded">

      <h5 className="mb-2">{titulo}</h5>

      <p className="text-muted small mb-2">
        Publicado por <b>{autorNombre}</b> • {fecha}
      </p>

      <p>{contenido}</p>

      <div className="d-flex gap-3 mt-3">
        
        {/* 👍 LIKE */}
        <button
          className={`btn btn-sm ${likedByUser ? "btn-primary" : "btn-outline-primary"}`}
          onClick={toggleLike}
        >
          👍 {likes}
        </button>

        <button
          className="btn btn-outline-dark btn-sm"
          onClick={toggleComentarios}
        >
          {mostrarComentarios ? "Ocultar" : "Ver comentarios"}
        </button>

        {puedeEditarPublicacion && (
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => setEditModal(true)}
          >
            ✏ Editar
          </button>
        )}

        {puedeEliminar && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={eliminarPublicacion}
          >
            🗑 Eliminar
          </button>
        )}
      </div>


      {/* MODAL EDITAR */}
      {editModal && (
        <div className="modal-backdrop">
          <div className="modal-content p-3 border rounded bg-white">

            <h5 className="mb-3">Editar publicación</h5>

            <input
              className="form-control mb-2"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              rows="4"
              value={contenidoEdit}
              onChange={(e) => setContenidoEdit(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setEditModal(false)}>
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={guardarEdicion}>
                Guardar cambios
              </button>
            </div>

          </div>
        </div>
      )}


      {/* COMENTARIOS */}
      {mostrarComentarios && (
        <div className="mt-3 border-top pt-3">

          <h6>Comentarios</h6>

          {comentarios.length === 0 ? (
            <p className="text-muted small">No hay comentarios aún.</p>
          ) : (
            comentarios.map((c) => {
              const puedeEditar = user && (Number(user.id) === Number(c.autorId));

              return (
                <div key={c.id} className="mb-2 p-2 border rounded">

                  <b>{c.autorNombre}</b> – <span className="text-muted small">{c.fecha}</span>
                  <br />
                  <span>{c.contenido}</span>

                  <div className="mt-2 d-flex gap-2">
                  {puedeEditar && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => editarComentario(c.id, c.contenido)}
                    >
                      Editar
                    </button>
                  )}

                  {puedeEliminar && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarComentario(c.id)}
                    >
                      Eliminar
                    </button>
                  )}
                  </div>

                </div>
              );
            })
          )}

          <div className="mt-3">
            <textarea
              className="form-control mb-2"
              placeholder="Escribí un comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
            />

            <button
              className="btn btn-primary btn-sm"
              onClick={enviarComentario}
            >
              Comentar
            </button>
          </div>

        </div>
      )}

    </div>
  );
}