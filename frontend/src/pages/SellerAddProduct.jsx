import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SellerAddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  // Danh sách danh mục (có thể fetch từ API sau)
  const categories = [
    { id: 1, name: "Điện thoại & Phụ kiện" },
    { id: 2, name: "Điện tử - Điện lạnh" },
    { id: 3, name: "Thời trang nam" },
    { id: 4, name: "Thời trang nữ" },
    { id: 5, name: "Mẹ và bé" },
    { id: 6, name: "Nhà cửa & Đời sống" },
    { id: 7, name: "Sức khỏe & Làm đẹp" },
    { id: 8, name: "Thể thao & Dã ngoại" },
    { id: 9, name: "Sách & Văn phòng phẩm" },
    { id: 10, name: "Ô tô & Xe máy" },
  ];

  const [form, setForm] = useState({
    TenSanPham: '',
    MoTa: '',
    Gia: '',
    SoLuongTon: '',
    MaLoai: '1' // mặc định là 1
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm({ ...form, HinhAnh: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Chưa đăng nhập!');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('TenSanPham', form.TenSanPham);
    formData.append('MoTa', form.MoTa || '');
    formData.append('Gia', form.Gia);
    formData.append('SoLuongTon', form.SoLuongTon);
    formData.append('MaLoai', form.MaLoai); // ← ĐÃ CÓ MÃ LOẠI
    if (form.HinhAnh) formData.append('HinhAnh', form.HinhAnh);

    try {
      await axios.post(
        'https://dbas2.onrender.com/seller/products',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('ĐĂNG SẢN PHẨM THÀNH CÔNG!');
      setTimeout(() => navigate('/seller'), 2000);
    } catch (err) {
      setMessage(`Lỗi: ${err.response?.data?.detail || 'Không thể đăng sản phẩm'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-10 border border-gray-100">
      <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-10">
        Đăng bán sản phẩm mới
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tên sản phẩm */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-3">Tên sản phẩm *</label>
          <input
            name="TenSanPham"
            placeholder="Nhập tên sản phẩm..."
            value={form.TenSanPham}
            onChange={handleChange}
            required
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition"
          />
        </div>

        {/* Danh mục – Dropdown đẹp lung linh */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-3">Danh mục sản phẩm *</label>
          <select
            name="MaLoai"
            value={form.MaLoai}
            onChange={handleChange}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition bg-white"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-3">Mô tả sản phẩm</label>
          <textarea
            name="MoTa"
            placeholder="Mô tả chi tiết sản phẩm..."
            value={form.MoTa}
            onChange={handleChange}
            rows="5"
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition resize-none"
          />
        </div>

        {/* Giá + Số lượng */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-3">Giá bán (VNĐ) *</label>
            <input
              name="Gia"
              type="number"
              placeholder="Ví dụ: 1500000"
              value={form.Gia}
              onChange={handleChange}
              required
              min="1000"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-gray-800 mb-3">Số lượng tồn kho *</label>
            <input
              name="SoLuongTon"
              type="number"
              placeholder="Ví dụ: 100"
              value={form.SoLuongTon}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block text-xl font-bold text-gray-800 mb-3">Hình ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-lg file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
          />
          {preview && (
            <div className="mt-6">
              <p className="text-lg font-medium text-gray-700 mb-3">Xem trước:</p>
              <img src={preview} alt="Preview" className="max-w-full h-96 object-contain rounded-2xl shadow-lg" />
            </div>
          )}
        </div>

        {/* Nút đăng bán */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-6 text-2xl font-bold text-white rounded-2xl transition transform hover:scale-105 ${
            loading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-2xl'
          }`}
        >
          {loading ? 'ĐANG ĐĂNG BÁN...' : 'ĐĂNG BÁN NGAY'}
        </button>
      </form>

      {message && (
        <div className={`text-center mt-8 text-2xl font-bold p-6 rounded-xl ${
          message.includes('THÀNH CÔNG') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}