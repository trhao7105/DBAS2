import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetail() {
  const { user: currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập!');
      navigate('/login');
      return;
    }

    api.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setProduct(res.data);
        if (currentUser?.role === 'seller' && 
            Number(currentUser.id) === Number(res.data.SellerID)) {
          setIsSeller(true);
        }
      })
      .catch(err => {
        toast.error('Không tìm thấy sản phẩm');
        navigate('/');
      });
  }, [id, currentUser, token, navigate]);

  const addToCart = async () => {
    try {
      await api.post('/cart/add', 
        { ProductID: parseInt(id), SoLuong: 1 },
        { headers: { Authorization: `Bearer ${token}`} }
      );
      toast.success('Đã thêm vào giỏ hàng!');
    } catch {
      toast.error('Thêm thất bại!');
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    
    try {
      await api.delete(`/seller/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa sản phẩm!');
      navigate('/seller');
    } catch {
      toast.error('Xóa thất bại!');
    }
  };

  if (!product) return <div className="text-center py-32 text-2xl">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Ảnh – ĐÃ FIX 100% */}
        <div className="relative">
          <img
            src={`http://localhost:8000/uploads/${product.HinhAnh}`}
            alt={product.TenSanPham}
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = "/placeholder.jpg"}
          />
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold">
            -{Math.round((product.GiamGia || 0) * 100)}%
          </div>
        </div>

        {/* Thông tin */}
        <div className="p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {product.TenSanPham}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-bold text-red-600">
                {Number(product.Gia).toLocaleString('vi-VN')}đ
              </span>
              {product.GiaGoc && (
                <span className="text-2xl text-gray-500 line-through">
                  {Number(product.GiaGoc).toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.MoTa || 'Sản phẩm chất lượng cao, giao hàng nhanh chóng!'}
            </p>
            <div className="flex items-center gap-6 text-lg mb-8">
              <span className="text-green-600 font-bold">Còn {product.SoLuongTon} sản phẩm</span>
              <span className="text-gray-600">Đã bán: {product.DaBan || 0}</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="space-y-4">
            <button
              onClick={addToCart}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-5 rounded-2xl text-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition"
            >
              THÊM VÀO GIỎ HÀNG
            </button>

            {isSeller && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/seller/edit-product/${id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-xl transition"
                >
                  SỬA SẢN PHẨM
                </button>
                <button
                  onClick={deleteProduct}
                  className="bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-bold text-xl transition"
                >
                  XÓA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}