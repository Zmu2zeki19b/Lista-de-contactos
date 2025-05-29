import React, { useEffect, useState } from "react";
import { useStore } from "../hooks/useGlobalReducer";

const Home = () => {
  const { state, actions } = useStore();
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState("");
  const [newAgenda, setNewAgenda] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingContact, setEditingContact] = useState(null);
  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        const response = await fetch("https://playground.4geeks.com/contact/agendas?offset=0&limit=100");
        if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        const data = await response.json();
        const agendaNames = (data.agendas || [])
          .map(a => a.slug || a.name || a)
          .filter(name => name.startsWith("ezequiel_"));
        setAgendas(agendaNames);
        if (agendaNames.length > 0 && !selectedAgenda) {
          setSelectedAgenda(agendaNames[0]);
          actions.getContacts(agendaNames[0]);
        }
      } catch (error) {
        console.error("Error al obtener las agendas:", error);
      }
    };
    fetchAgendas();
  }, []);
  const handleAgendaChange = (e) => {
    const agenda = e.target.value;
    setSelectedAgenda(agenda);
    localStorage.setItem("lastAgenda", agenda);
    actions.getContacts(agenda);
  };
  const handleCreateAgenda = async (e) => {
    e.preventDefault();
    if (!newAgenda) return;
    if (!/^[a-zA-Z0-9_]+$/.test(newAgenda)) {
      alert("El nombre de la agenda solo puede contener letras, números y guiones bajos.");
      return;
    }
    await actions.createAgenda(newAgenda);
    setAgendas([...agendas, newAgenda]);
    setSelectedAgenda(newAgenda);
    actions.getContacts(newAgenda);
    setNewAgenda("");
  };
  const handleDeleteAgenda = async (agenda) => {
    if (!window.confirm(`¿Seguro que quieres borrar la agenda "${agenda}"?`)) return;
    await actions.deleteAgenda(agenda);
    const nuevasAgendas = agendas.filter(a => a !== agenda);
    setAgendas(nuevasAgendas);
    if (selectedAgenda === agenda) {
      setSelectedAgenda(nuevasAgendas[0] || "");
      if (nuevasAgendas[0]) actions.getContacts(nuevasAgendas[0]);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgenda) {
      alert("Selecciona una agenda válida antes de añadir un contacto.");
      return;
    }
    const contactoAEnviar = { ...form, agenda_slug: selectedAgenda };
    await actions.addContact(selectedAgenda, form);
    setForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
    });
    actions.getContacts(selectedAgenda);
  };
  return (
    <div>
      <h1>Lista de Contactos</h1>
      <form onSubmit={handleCreateAgenda} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Nombre de nueva agenda"
          value={newAgenda}
          onChange={e => setNewAgenda(e.target.value)}
        />
        <button type="submit">Crear Agenda</button>
      </form>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <select value={selectedAgenda} onChange={handleAgendaChange}>
          {agendas.map((agenda) => (
            <option key={agenda} value={agenda}>
              {agenda}
            </option>
          ))}
        </select>
        {agendas.map((agenda) => (
          <button
            key={agenda + "-delete"}
            style={{ background: "#dc3545", marginLeft: 4 }}
            onClick={() => handleDeleteAgenda(agenda)}
            type="button"
          >
            Borrar {agenda}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ margin: "1rem 0" }}>
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
        <button type="submit">Añadir contacto</button>
      </form>
      {state.contacts.length > 0 ? (
        state.contacts.map((contact) => (
          <div key={contact.id} style={{ display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.full_name || contact.name || "Contacto")}&background=random`}
              alt="avatar"
              width={48}
              height={48}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <h3>{contact.full_name || contact.name}</h3>
              <p>Email: {contact.email}</p>
              <p>Teléfono: {contact.phone}</p>
              <p>Dirección: {contact.address}</p>
              <button
                style={{ background: "#dc3545", marginTop: 8 }}
                onClick={() => actions.deleteContact(selectedAgenda, contact.id)}
              >
                Eliminar
              </button>
              <button
                style={{ background: "#ffc107", color: "#222", marginLeft: 8, marginTop: 8 }}
                onClick={() => setEditingContact(contact)}
              >
                Editar
              </button>
              {editingContact && editingContact.id === contact.id && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await actions.updateContact(
                      selectedAgenda,
                      editingContact.id,
                      {
                        ...editingContact,
                        name: editingContact.full_name,
                        agenda_slug: selectedAgenda,
                      }
                    );
                    await actions.getContacts(selectedAgenda);
                    setEditingContact(null);
                  }}
                  style={{ marginTop: "1rem", background: "#ffe", padding: "1rem", border: "1px solid #ccc" }}
                >
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Nombre completo"
                    value={editingContact.full_name}
                    onChange={e => setEditingContact({ ...editingContact, full_name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={editingContact.email}
                    onChange={e => setEditingContact({ ...editingContact, email: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={editingContact.phone}
                    onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Dirección"
                    value={editingContact.address}
                    onChange={e => setEditingContact({ ...editingContact, address: e.target.value })}
                    required
                  />
                  <button type="submit">Guardar cambios</button>
                  <button type="button" onClick={() => setEditingContact(null)} style={{ marginLeft: 8 }}>
                    Cancelar
                  </button>
                </form>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No hay contactos disponibles.</p>
      )}
    </div>
  );
};

export default Home;