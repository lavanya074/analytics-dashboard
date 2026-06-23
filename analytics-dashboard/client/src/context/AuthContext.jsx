import { createContext, useContext, useState } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On page refresh, restore the session from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const name  = localStorage.getItem('name');
    return token ? { token, role, name } : null;
  });

  const register = async (orgName, name, email, password) => {
    const { data } = await api.post('/auth/register', {
      orgName, name, email, password
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role);
    localStorage.setItem('name',  data.name);
    setUser({ token: data.token, role: data.role, name: data.name });
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role);
    localStorage.setItem('name',  data.name);
    setUser({ token: data.token, role: data.role, name: data.name });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
