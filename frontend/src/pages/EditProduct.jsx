import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    TenSanPham: '',
    MoTa: '',
    Gia: 0,
    SoLuongTon: 0,
    MaLoai: 1
  });
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProduct({
        TenSanPham: res.data.TenSanPham,
        MoTa: res.data.MoTa,
        Gia: res.data.Gia,
        SoLuongTon: res.data.SoLuongTon,
        MaLoai: res.data.MaLoai
      }))
      .catch(() => toast.error('Không tải được sản phẩm'));
  }, [id, token]);

  const handleChange = e => {
    setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("TenSanPham", product.TenSanPham);
    formData.append("MoTa", product.MoTa);
    formData.append("Gia", product.Gia);
    formData.append("SoLuongTon", product.SoLuongTon);
    formData.append("MaLoai", product.MaLoai);
    if (file) formData.append("HinhAnh", file);

    try {
      await api.put(`/products/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success('Cập nhật sản phẩm thành công');
      navigate(`/product/${id}`);
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Sửa sản phẩm</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="TenSanPham"
          value={product.TenSanPham}
          onChange={handleChange}
          placeholder="Tên sản phẩm"
          className="border p-2 rounded"
        />
        <input
          name="Gia"
          type="number"
          value={product.Gia}
          onChange={handleChange}
          placeholder="Giá"
          className="border p-2 rounded"
        />
        <input
          name="SoLuongTon"
          type="number"
          value={product.SoLuongTon}
          onChange={handleChange}
          placeholder="Số lượng tồn"
          className="border p-2 rounded"
        />
        <textarea
          name="MoTa"
          value={product.MoTa}
          onChange={handleChange}
          placeholder="Mô tả"
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}
