// src/contexts/AuthContext.jsx
import { createContext, useState, useContext } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null);
  // Coba ambil token dari localStorage saat pertama kali aplikasi dimuat
  const [user, _setUser] = useState(JSON.parse(localStorage.getItem("USER")));
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setToken = (newToken) => {
    // console.log("Mencoba menyimpan token baru:", newToken);
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setUser = (newUser) => {
    _setUser(newUser);
    if (newUser) {
      localStorage.setItem("USER", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("USER");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Buat custom hook agar lebih mudah digunakan
export const useAuth = () => {
  return useContext(AuthContext);
};
