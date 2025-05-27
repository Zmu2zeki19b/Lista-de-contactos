export const initialStore = () => {
    return {
      message: null,
      contacts: [],
    };
  };
  
  export default function storeReducer(store, action = {}) {
    switch (action.type) {
      case "ADD_CONTACT":
        return {
          ...store,
          contacts: [...store.contacts, action.payload],
        };
      case "GET_CONTACTS":
        return {
          ...store,
          contacts: action.payload,
        };
      default:
        throw Error("Unknown action.");
    }
  }