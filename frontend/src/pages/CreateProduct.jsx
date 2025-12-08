import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateProduct() {
  const [form, setForm] = useState({
    TenSanPham: '', MoTa: '', Gia: '', SoLuongTon: '', MaLoai: '1'
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (image) formData.append("HinhAnh", image);

    try {
      await api.post('/products/create', formData);
      toast.success('Đăng sản phẩm thành công!');
    } catch (err) {
      toast.error('Lỗi rồi!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20">
      <h1 className="text-4xl font-bold text-center mb-10">ĐĂNG BÁN SẢN PHẨM</h1>
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl space-y-6">
        <input placeholder="Tên sản phẩm" required onChange={e => setForm({...form, TenSanPham: e.target.value})}
          className="w-full px-6 py-4 border rounded-2xl text-lg" />
        <input placeholder="Giá" type="number" required onChange={e => setForm({...form, Gia: e.target.value})}
          className="w-full px-6 py-4 border rounded-2xl text-lg" />
        <input placeholder="Số lượng" type="number" required onChange={e => setForm({...form, SoLuongTon: e.target.value})}
          className="w-full px-6 py-4 border rounded-2xl text-lg" />
        <textarea placeholder="Mô tả" onChange={e => setForm({...form, MoTa: e.target.value})}
          className="w-full px-6 py-4 border rounded-2xl text-lg h-32"></textarea>

        <div className="border-2 border-dashed border-purple-400 rounded-2xl p-8 text-center">
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
            className="hidden" id="upload" />
          <label htmlFor="upload" className="cursor-pointer">
            {image ? <img src={URL.createObjectURL(image)} className="mx-auto h-64 object-cover rounded-xl" /> 
              : <div className="text-6xl text-purple-400">+</div>}
            <p className="mt-4 text-purple-600 font-bold">Click để chọn ảnh</p>
          </label>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl text-xl font-bold hover:scale-105 transition">
          ĐĂNG BÁN NGAY
        </button>
      </form>
    </div>
  );
}