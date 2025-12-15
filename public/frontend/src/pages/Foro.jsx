// src/pages/Foro.jsx
/*import PostCard from "../components/PostCard";
import "./foro.css";

export default function Foro() {
  // Publicaciones de prueba (dummy data)
  const posts = [
    {
      id: 1,
      titulo: "Primer post del foro!",
      contenido: "Esta es una publicación de prueba para ver cómo se ve el diseño.",
      autor: "DemoUser",
      fecha: "hace 2 horas"
    },
    {
      id: 2,
      titulo: "Ideas para mejorar el foro",
      contenido: "Me gustaría agregar un sistema de likes y comentarios!",
      autor: "Demian",
      fecha: "hace 1 día"
    }
  ];

  return (
    <div>
      <h2 className="mb-4">Foro</h2>

      {posts.map(post => (
        <PostCard
          key={post.id}
          titulo={post.titulo}
          contenido={post.contenido}
          autor={post.autor}
          fecha={post.fecha}
        />
      ))}
    </div>
  );
}*/

import Publicaciones from "../components/Publicaciones";
import "./foro.css";

export default function Foro() {
  return (
    <div>
      <h2 className="mb-4 text-light">Foro</h2>
      <Publicaciones />
    </div>
  );
}