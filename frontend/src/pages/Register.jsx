// src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    ten_dang_nhap: '',
    mat_khau: '',
    ho_va_tendem: '',
    ten: '',
    so_dien_thoai: '',
    role: 'buyer'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // KIỂM TRA TẤT CẢ CÁC TRƯỜNG BẮT BUỘC
    if (!form.ten_dang_nhap || !form.mat_khau || !form.ho_va_tendem || !form.ten || !form.so_dien_thoai) {
      toast.error('Vui lòng điền đầy đủ tất cả thông tin!');
      return;
    }

    // KIỂM TRA SỐ ĐIỆN THOẠI 
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(form.so_dien_thoai)) {
      toast.error('Số điện thoại không hợp lệ! (VD: 0987654321)');
      return;
    }

    try {
      await register(form);
    } catch (err) {
      // lỗi đã được xử lý trong AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-red-100 py-12 px-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-white/30">
        
        <h2 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ĐĂNG KÝ TÀI KHOẢN
        </h2>
        <p className="text-center text-gray-600 mb-10">Chỉ mất 30 giây để tham gia AS2 Shop!</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input 
            type="text" 
            placeholder="Tên đăng nhập" 
            required
            value={form.ten_dang_nhap}
            onChange={(e) => setForm({ ...form, ten_dang_nhap: e.target.value })}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
          />

          <input 
            type="password" 
            placeholder="Mật khẩu" 
            required
            value={form.mat_khau}
            onChange={(e) => setForm({ ...form, mat_khau: e.target.value })}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
          />

          <input 
            type="text" 
            placeholder="Họ và tên đệm" 
            required
            value={form.ho_va_tendem}
            onChange={(e) => setForm({ ...form, ho_va_tendem: e.target.value })}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
          />

          <input 
            type="text" 
            placeholder="Tên" 
            required
            value={form.ten}
            onChange={(e) => setForm({ ...form, ten: e.target.value })}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
          />

          {/* SỐ ĐIỆN THOẠI BẮT BUỘC – GIỮ NGUYÊN GIAO DIỆN NHƯ CÁC Ô KHÁC */}
          <input
            type="tel"
            placeholder="Số điện thoại (bắt buộc)"
            value={form.so_dien_thoai}
            onChange={(e) => setForm({ ...form, so_dien_thoai: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
            required
            maxLength="10"
          />

          {/* Chọn vai trò */}
          <div className="flex gap-8 justify-center py-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="buyer" 
                checked={form.role === 'buyer'}
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
                className="w-6 h-6 text-purple-600" 
              />
              <span className="text-lg font-medium">Người mua</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="role" 
                value="seller" 
                checked={form.role === 'seller'}
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
                className="w-6 h-6 text-pink-600" 
              />
              <span className="text-lg font-bold text-pink-700">Người bán</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-300"
          >
            ĐĂNG KÝ NGAY
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-purple-600 font-bold hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
}