import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

useEffect(() => {
    // Lấy danh mục
    api.get('/products/categories')
        .then(res => setCategories(res.data))
        .catch(() => toast.error('Không tải được danh mục'));

    // Lấy sản phẩm
    fetchProducts();
}, []);

  const fetchProducts = (maLoai = '') => {
    api.get('/products', { params: { ma_loai: maLoai || undefined } })
        .then(res => setProducts(res.data))
        .catch(() => toast.error('Không tải được sản phẩm'));
    };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    fetchProducts(value);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">TẤT CẢ SẢN PHẨM</h1>

      {/* DROPDOWN LỌC LOẠI – ĐẸP NHƯ SHOPEE */}
      <div className="mb-8 flex justify-center">
        <select 
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-8 py-4 border-2 border-orange-500 rounded-xl text-lg font-medium focus:outline-none focus:border-orange-700"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.MaLoai} value={cat.MaLoai}>
              {cat.TenLoai}
            </option>
          ))}
        </select>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.ProductID} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-2xl text-gray-500 col-span-full mt-20">
          Không tìm thấy sản phẩm nào
        </p>
      )}
    </div>
  );
}