export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <img
        src={`https://dbas2.onrender.com/uploads/${product.HinhAnh}`}
        alt=""
        className="w-24 h-24 object-cover rounded"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{item.TenSanPham}</h4>
        <p className="text-red-600 font-bold">{Number(item.Gia).toLocaleString('vi-VN')}đ</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onUpdate(item.ProductID, item.SoLuong - 1)} className="px-3 py-1 bg-gray-200 rounded">-</button>
        <span className="w-12 text-center">{item.SoLuong}</span>
        <button onClick={() => onUpdate(item.ProductID, item.SoLuong + 1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
      </div>
      <button onClick={() => onRemove(item.ProductID)} className="text-red-600">Xóa</button>
    </div>
  );
}