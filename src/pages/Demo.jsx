import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

const Demo = () => {
  const { actions } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const agendaSlug = "my_agenda"; 
    await actions.addContact(agendaSlug, form);
    navigate("/"); 
  };
  return (
    <div>
      <h1>Añadir Contacto</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Añadir Contacto</button>
      </form>
    </div>
  );
};
export default Demo;