// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../src/api/axios'; // sửa đúng đường dẫn
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN – SỬA ĐÚNG THEO BACKEND DÙNG OAuth2PasswordRequestForm
  const login = async (username, password) => {
  try {
    const res = await api.post('/auth/login', 
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = res.data;
    localStorage.setItem('token', access_token);

    // Lấy thông tin user hiện tại từ /user/me
    const meRes = await api.get('/user/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    setUser(meRes.data); // meRes.data phải có id, role, ...
    toast.success('Đăng nhập thành công!');
    window.location.href = '/';
  } catch (err) {
    toast.error('Sai tên đăng nhập hoặc mật khẩu');
  }
};

  // REGISTER 
  const register = async (data) => {
  try {
    await api.post('/auth/register', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    toast.success('Đăng ký thành công! Hãy đăng nhập');
    window.location.href = '/login';
  } catch (err) {
    const msg = err.response?.data?.detail || 'Đăng ký thất bại';
    toast.error(msg);
  }
};

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Đăng xuất thành công');
    window.location.href = '/';
  };

  // KIỂM TRA TOKEN KHI LOAD TRANG
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/user/me'); // endpoint lấy thông tin user hiện tại
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
    <AuthContext.Provider value={{ 
      user, 
      login, register, logout, loading, checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};