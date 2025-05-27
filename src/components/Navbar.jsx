import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          marginRight: "10px",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Inicio
      </NavLink>
      <NavLink
        to="/add"
        style={({ isActive }) => ({
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Añadir Contacto
      </NavLink>
    </nav>
  );
}