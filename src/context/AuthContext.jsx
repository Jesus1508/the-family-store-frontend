import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { login as loginRequest } from "../services/APIservice";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = Cookies.get("tfs_admin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await loginRequest(email, password);
    Cookies.set("tfs_token", data.token, { expires: 1 / 3 });
    Cookies.set("tfs_admin", JSON.stringify(data.admin), { expires: 1 / 3 });
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = () => {
    Cookies.remove("tfs_token");
    Cookies.remove("tfs_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
