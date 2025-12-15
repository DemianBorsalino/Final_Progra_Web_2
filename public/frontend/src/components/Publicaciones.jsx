// src/components/Publicaciones.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../services/authServices";
import PostCard from "./PostCard";

export default function Publicaciones() {
  const [posts, setPosts] = useState([]);

  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    titulo: "",
    contenido: "",
  });

  // Estado para manejar el modal
  const [mostrarModal, setMostrarModal] = useState(false);

  // Cargar publicaciones al inicio
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = getToken();

        const res = await axios.get("http://localhost:3000/api/publicaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data || []);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      }
    };

    fetchPosts();
  }, []);

  // Manejar inputs del form
  const handleChange = (e) => {
    setNuevaPublicacion({
      ...nuevaPublicacion,
      [e.target.name]: e.target.value,
    });
  };

  // Crear publicación
  const crearPublicacion = async () => {
    if (!nuevaPublicacion.titulo.trim() || !nuevaPublicacion.contenido.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const token = getToken();

      const res = await axios.post(
        "http://localhost:3000/api/publicaciones",
        {
          titulo: nuevaPublicacion.titulo,
          contenido: nuevaPublicacion.contenido,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const nueva = res.data;

      // Agrega la publicación nueva al principio
      setPosts([nueva, ...posts]);

      // Limpiar los campos
      setNuevaPublicacion({ titulo: "", contenido: "" });

      // Cerrar el modal
      setMostrarModal(false);

    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("No se pudo crear la publicación");
    }
  };

  return (
    <div className="container mt-4">

      {/* Botón que abre el modal */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setMostrarModal(true)}
        >
          Crear publicación
        </button>
      </div>

      {/* Modal controlado por React */}
      {mostrarModal && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Nueva publicación</h5>
                <button className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="titulo"
                    value={nuevaPublicacion.titulo}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contenido</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="contenido"
                    value={nuevaPublicacion.contenido}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={crearPublicacion}
                >
                  Publicar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Lista de publicaciones */}
      <div className="mt-4">
        {posts.length === 0 && (
          <p className="text-muted text-center">No hay publicaciones aún.</p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            titulo={post.titulo}
            contenido={post.contenido}
            autorNombre={post.autorNombre}
            autorId={post.autorId}
            fecha={post.fecha_publicacion}
            onDelete={(idEliminado) => {
              setPosts(posts.filter((p) => p.id !== idEliminado));
            }}
          />
        ))}
      </div>
    </div>
  );
}
