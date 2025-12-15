import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../services/authServices";   // <-- IMPORTANTE
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();          // elimina token del localStorage
    navigate("/");          // redirige al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/foro">MiForo</Link>

      <button 
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/foro">Foro</Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/usuario">Usuario</Link>
          </li>

          {/* Cerrar sesión */}
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link btn btn-link text-danger"
              style={{ textDecoration: "none" }}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
