import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

const Single = () => {
  const { state, actions } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const agenda =
      state.selectedAgenda ||
      (Array.isArray(state.agendas) && state.agendas[0]) ||
      localStorage.getItem("lastAgenda") ||
      "";

    if (!state.contacts.length && agenda) {
      actions.getContacts(agenda);
      return;
    }

    const found = state.contacts.find(c => String(c.id) === String(id));
    if (found) {
      setContact(found);
      setForm({
        full_name: found.full_name || found.name || "",
        email: found.email || "",
        phone: found.phone || "",
        address: found.address || "",
      });
    }
  }, [id, state.contacts, state.selectedAgenda]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!contact) {
      console.log("No hay contacto para actualizar");
      return;
    }
    console.log("Actualizando contacto:", contact, form);
    let agenda =
      contact.agenda_slug ||
      state.selectedAgenda ||
      (Array.isArray(state.agendas) && state.agendas[0]) ||
      localStorage.getItem("lastAgenda") ||
      "";
    if (!agenda) {
      alert("No se puede determinar la agenda para actualizar el contacto.");
      return;
    }
    await actions.updateContact(
      agenda,
      id,
      {
        ...form,
        name: form.full_name,
        agenda_slug: agenda,
      }
    );
    await actions.getContacts(agenda);
    navigate("/");
  };

  if (!contact) return <p>Cargando contacto...</p>;

  return (
    <div>
      <h2>Editar Contacto</h2>
      <form onSubmit={handleUpdate}>
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
        <button type="submit" disabled={!contact}>Actualizar</button>
      </form>
    </div>
  );
};

export default Single;

