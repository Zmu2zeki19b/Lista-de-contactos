import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

const Single = () => {
  const { id } = useParams();
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: ""
  });
  useEffect(() => {
    const contact = state.contacts.find(c => c.id === parseInt(id));
    if (contact) {
      setForm(contact);
    }
  }, [id, state.contacts]);
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://playground.4geeks.com/apis/fake/contact/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...form, agenda_slug: "my_agenda"})
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE_CONTACT", payload: data });
        navigate("/");
      })
      .catch(err => console.error(err));
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Contacto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="full_name" value={form.full_name} placeholder="Nombre Completo" onChange={handleChange} required className="border p-2" />
        <input name="email" value={form.email} placeholder="Email" onChange={handleChange} required className="border p-2" />
        <input name="phone" value={form.phone} placeholder="Teléfono" onChange={handleChange} required className="border p-2" />
        <input name="address" value={form.address} placeholder="Dirección" onChange={handleChange} required className="border p-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
      </form>
    </div>
  );
};
export default Single;


