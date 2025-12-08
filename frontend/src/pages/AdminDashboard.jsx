import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
    api.get('/admin/orders').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-red-600">TRANG QUẢN TRỊ</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex justify-between border-b py-2">
                <span>{u.username}</span>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${u.role === 'admin' ? 'bg-red-600' : u.role === 'seller' ? 'bg-blue-600' : 'bg-green-600'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Đơn hàng mới nhất</h2>
          <div className="space-y-3">
            {orders.slice(0, 10).map(o => (
              <div key={o.OrderID} className="border-b pb-3">
                <p>Đơn #{o.OrderID} - {new Date(o.NgayDat).toLocaleDateString('vi-VN')}</p>
                <p className="text-red-600 font-bold">{Number(o.TongTien).toLocaleString('vi-VN')}đ</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}