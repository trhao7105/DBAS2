import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Package, Store, Shield, LogOut, User, Grid } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-3 rounded-xl group-hover:scale-110 transition">
            <Store className="w-8 h-8" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            AS2 SHOP
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-lg font-medium">

          {/* Luôn hiện */}
          <Link to="/" className="hover:text-red-600 transition flex items-center gap-2">
            Trang chủ
          </Link>

          <Link to="/products" className="hover:text-red-600 transition flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Sản phẩm
          </Link>

          {/* Giỏ hàng */}
          <Link to="/cart" className="hover:text-red-600 transition flex items-center gap-2 relative">
            <ShoppingCart className="w-6 h-6" />
            Giỏ hàng
          </Link>

          {/* SELLER – Quản lý cửa hàng + Đăng bán */}
          {user?.role === 'seller' && (
            <>
              <Link 
                to="/seller" 
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                Quản lý cửa hàng
              </Link>
              <Link 
                to="/seller/add-product" 
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
              >
                Đăng bán sản phẩm
              </Link>
            </>
          )}

          {/* BUYER – Trang cá nhân */}
          {user?.role === 'buyer' && (
            <Link 
              to="/buyer" 
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              Đơn hàng của tôi
            </Link>
          )}

          {/* ADMIN – Quản trị */}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Quản trị hệ thống
            </Link>
          )}

          {/* Đã đăng nhập */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl transition"
              >
                <User className="w-6 h-6 text-gray-700" />
                <div>
                  <p className="font-semibold text-gray-800">Hi, {user.ten || user.ten_dang_nhap}</p>
                  <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                </div>
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition hover:shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </div>
          ) : (
            /* Chưa đăng nhập */
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold transition hover:shadow-lg"
              >
                Đăng nhập
              </Link>
              <Link 
                to="/register" 
                className="bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl font-bold transition hover:shadow-lg"
              >
                Đăng ký
              </Link>
            </div>
          )}

        </nav>
      </div>
    </header>
  );
}
