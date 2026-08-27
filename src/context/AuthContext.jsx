import { createContext, useContext, useState } from "react";
import { apiLogin, apiSignup, clearSession, getStoredUser } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const login = async (email, password, role) => {
    const loggedInUser = await apiLogin({ email, password });
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (email, name, role, password) => {
    const newUser = await apiSignup({ name, email, password, role });
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
