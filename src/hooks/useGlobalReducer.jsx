import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  contacts: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_CONTACTS":
      return { ...state, contacts: action.payload };
    default:
      return state;
  }
};

const Context = createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getContacts = async (agendaName) => {
  try {
    const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}/contacts`);
    if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    const data = await response.json();
    dispatch({ type: "GET_CONTACTS", payload: data.contacts || [] });
  } catch (error) {
    console.error("Error al obtener los contactos:", error);
    dispatch({ type: "GET_CONTACTS", payload: [] });
  }
};

  const addContact = async (agendaName, contactData) => {
  try {
    const contactoAEnviar = { 
      ...contactData, 
      name: contactData.full_name, 
      agenda_slug: agendaName 
    };
    console.log("Contacto que se enviará a la API:", contactoAEnviar);

    const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactoAEnviar),
    });

    const respuestaTexto = await response.text();
    console.log("Respuesta de la API:", respuestaTexto);

    if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    await getContacts(agendaName);
  } catch (error) {
    console.error("Error al añadir contacto:", error);
  }
};

  const updateContact = async (agendaName, contactId, contactData) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      await getContacts(agendaName);
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
    }
  };

  const deleteContact = async (agendaName, contactId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}/contacts/${contactId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      await getContacts(agendaName);
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  };

  const createAgenda = async (agendaName) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}`, {
        method: "POST"
      });
      if (!response.ok) throw new Error(`Error al crear agenda: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Error al crear agenda:", error);
    }
  };

  const deleteAgenda = async (agendaName) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/${agendaName}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error(`Error al borrar agenda: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error("Error al borrar agenda:", error);
    }
  };

  return (
    <Context.Provider
      value={{
        state,
        actions: { getContacts, addContact, updateContact, deleteContact, createAgenda, deleteAgenda },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStore = () => useContext(Context);

export default StoreProvider;
  