import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';
const AuthCtx = createContext(null as any);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('nimbus_token');
    const u = localStorage.getItem('nimbus_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('nimbus_token', data.token);
    localStorage.setItem('nimbus_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name: string, email: string, password: string, phone: string) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    localStorage.setItem('nimbus_token', data.token);
    localStorage.setItem('nimbus_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nimbus_token');
    localStorage.removeItem('nimbus_user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}