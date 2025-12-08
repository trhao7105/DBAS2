import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">TRANG CÁ NHÂN</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <p><strong>Họ tên:</strong> {user?.ho_va_tendem} {user?.ten}</p>
        <p><strong>Tên đăng nhập:</strong> {user?.ten_dang_nhap}</p>
        <p><strong>Vai trò:</strong> {user?.role === 'buyer' ? 'Người mua' : user?.role === 'seller' ? 'Người bán' : 'Quản trị viên'}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.OrderID} className="bg-white p-6 rounded-lg shadow">
              <p><strong>Đơn hàng #{order.OrderID}</strong> - {new Date(order.NgayDat).toLocaleString('vi-VN')}</p>
              <p>Trạng thái: <span className="font-bold text-green-600">{order.TrangThaiDonHang}</span></p>
              <p>Tổng tiền: <span className="text-xl text-red-600 font-bold">{Number(order.TongTien).toLocaleString('vi-VN')}đ</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}