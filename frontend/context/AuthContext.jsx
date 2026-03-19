import { createContext, useContext, useState, useEffect } from 'react';
import api from '../src/api/axios'; 
import toast from 'react-hot-toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const res = await api.post(
        '/auth/login',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { access_token, user: userData } = res.data;
      localStorage.setItem('token', access_token);
      setUser(userData);

      return userData; // Trả về dữ liệu user để component tự xử lý redirect
    } catch (err) {
      // Luôn throw lỗi có message hợp lệ
      const message =
        err.response?.data?.detail || err.message || 'Đăng nhập thất bại';
      throw new Error(message);
    }
  };

  const register = async (data) => {
    try {
          await api.post('/auth/register', JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json"
      }
    });
      toast.success('Đăng ký thành công! Hãy đăng nhập');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Đăng xuất thành công!');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
