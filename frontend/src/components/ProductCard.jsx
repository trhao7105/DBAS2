import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.ProductID}`} className="bg-white rounded-lg shadow hover:shadow-2xl transition-shadow">
      {product.HinhAnh ? (
        <img src={`https://dbas2.onrender.com/uploads/${product.HinhAnh}`} className="w-full h-64 object-cover rounded-t-lg" alt={product.TenSanPham} />
      ) : (
        <div className="bg-gray-200 h-64 rounded-t-lg flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{product.TenSanPham}</h3>
        <p className="text-2xl font-bold text-red-600 mt-2">
          {Number(product.Gia).toLocaleString('vi-VN')}đ
        </p>
      </div>
    </Link>
  );
}