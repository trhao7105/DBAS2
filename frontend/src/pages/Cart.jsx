import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
  api.get('/cart').then(res => {
    setCart(res.data.items || []);
  });
}, []);

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    api.post('/cart/add', null, { params: { ProductID: id, SoLuong: qty - cart.find(i => i.ProductID === id).SoLuong }})
      .then(() => {
        setCart(cart.map(i => i.ProductID === id ? {...i, SoLuong: qty} : i));
        toast.success('Cập nhật số lượng');
      });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Giỏ hàng trống</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.ProductID} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <img 
                    src={
                      item.HinhAnh?.startsWith('http') 
                        ? item.HinhAnh 
                        : `https://dbas2.onrender.com/uploads/${item.HinhAnh}`
                    } 
                    className="w-20 h-20 object-cover" 
                  />
                  <div>
                    <h3 className="font-semibold">{item.TenSanPham}</h3>
                    <p className="text-red-600 font-bold">{(item.Gia * item.SoLuong).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.ProductID, item.SoLuong - 1)} className="w-8 h-8 bg-gray-200 rounded">-</button>
                  <span className="w-12 text-center">{item.SoLuong}</span>
                  <button onClick={() => updateQuantity(item.ProductID, item.SoLuong + 1)} className="w-8 h-8 bg-gray-200 rounded">+</button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-right mt-8">
            <Link to="/checkout" className="bg-red-600 text-white px-8 py-4 rounded-lg rounded-lg text-xl">
              Thanh toán ngay
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}