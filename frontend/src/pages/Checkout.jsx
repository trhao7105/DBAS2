import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [cart, setCart] = useState([]); // ← Mảng sản phẩm
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        setCart(res.data.items || []); 
      })
      .catch(() => toast.error('Không tải được giỏ hàng'));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.Gia * item.SoLuong, 0);

  const handleOrder = async () => {
    if (!address.trim()) return toast.error('Vui lòng nhập địa chỉ');

    try {
      await api.post('/orders/create', 
        { PhuongThucThanhToan: 'COD' },  // ← GỬI JSON TRONG BODY!
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Đặt hàng thành công! Đơn hàng đang được xử lý');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Lỗi đặt hàng');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500 mb-8">Giỏ hàng trống</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600">
        XÁC NHẬN ĐƠN HÀNG
      </h1>

      <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản phẩm</h2>
          {cart.map(item => (
            <div key={item.ProductID} className="flex justify-between items-center py-4 border-b">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://dbas2.onrender.com/static/images/${item.HinhAnh}`} 
                  className="w-16 h-16 object-cover rounded-lg"
                  alt={item.TenSanPham}
                />
                <div>
                  <p className="font-medium">{item.TenSanPham}</p>
                  <p className="text-gray-600 text-sm">{item.SoLuong} × {Number(item.Gia).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
              <p className="font-bold text-red-600">
                {(item.Gia * item.SoLuong).toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
        </div>

        <div className="text-right text-3xl font-bold text-red-600 py-6 border-t-2 border-gray-200">
          Tổng tiền: {total.toLocaleString('vi-VN')}đ
        </div>

        <div>
          <label className="block text-xl font-bold mb-3">Địa chỉ giao hàng</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-6 py-4 border-2 rounded-xl text-lg focus:border-red-500 outline-none"
            rows="3"
            placeholder="số nhà, đường, tỉnh, Việt Nam"
            required
          />
        </div>

        <button
          onClick={handleOrder}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-6 rounded-2xl text-3xl font-bold hover:shadow-2xl transform hover:scale-105 transition"
        >
          XÁC NHẬN ĐẶT HÀNG
        </button>
      </div>
    </div>
  );
}