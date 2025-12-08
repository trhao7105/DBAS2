// src/pages/BuyerDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => toast.error('Không tải được đơn hàng'));
  }, []);

  const statusColor = (status) => {
    if (status.includes('đã giao')) return 'bg-green-100 text-green-800';
    if (status.includes('đang')) return 'bg-blue-100 text-blue-800';
    if (status.includes('hủy')) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-5xl font-bold text-center text-blue-600 mb-12">
        ĐƠN HÀNG CỦA TÔI
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-8">Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-700">
            Mua sắm ngay!
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.OrderID} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="border-b pb-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Mã đơn: #{order.OrderID}</p>
                  <p className="text-gray-600">Ngày đặt: {new Date(order.NgayDat).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className={`px-6 py-3 rounded-full font-bold text-lg ${statusColor(order.TrangThai)}`}>
                  {order.TrangThai}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium">{item.TenSanPham}</span>
                    <span className="text-red-600 font-bold">
                      {Number(item.Gia).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t flex justify-between items-center">
                <p className="text-2xl font-bold">Tổng tiền:</p>
                <p className="text-3xl font-bold text-red-600">
                  {Number(order.TongTien).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}