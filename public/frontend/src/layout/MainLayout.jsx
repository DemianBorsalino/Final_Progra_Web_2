// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./layout.css";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <Outlet />
      </div>
    </div>
  );
}