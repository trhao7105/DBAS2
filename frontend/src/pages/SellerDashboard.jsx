import React from 'react';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Quản lý cửa hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800">156</h2>
          <p className="text-gray-600">Sản phẩm đang bán</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-600">₫24,580,000</h2>
          <p className="text-gray-600">Doanh thu tháng này</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-blue-600">89</h2>
          <p className="text-gray-600">Đơn hàng đang xử lý</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm của bạn</h2>
          <Link to="/seller/add-product">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition">
              ĐĂNG BÁN NGAY
            </button>
          </Link>
        </div>
        
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Chưa có sản phẩm nào</p>
          <Link to="/seller/add-product" className="text-orange-600 hover:underline">
            Bấm đây để đăng bán sản phẩm đầu tiên!
          </Link>
        </div>
      </div>
    </div>
  );
}