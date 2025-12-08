# backend/crud/cart.py
from sqlalchemy.orm import Session
from models import GioHang, GioHangSanPham, SanPham

def add_to_cart(db: Session, buyer_id: int, product_id: int, so_luong: int = 1, ten_gio_hang: str = "default"):
    # Tạo giỏ hàng nếu chưa có
    cart = db.query(GioHang).get((buyer_id, ten_gio_hang))
    if not cart:
        cart = GioHang(id=buyer_id, ten_gio_hang=ten_gio_hang)
        db.add(cart)

    item = db.query(GioHangSanPham).get((product_id, buyer_id, ten_gio_hang))
    if item:
        item.SoLuong += so_luong
    else:
        item = GioHangSanPham(ProductID=product_id, id=buyer_id, ten_gio_hang=ten_gio_hang, SoLuong=so_luong)
        db.add(item)
    db.commit()
    return item

def get_cart_items(db: Session, buyer_id: int, ten_gio_hang: str = "default"):
    return (
        db.query(GioHangSanPham)
        .join(SanPham, GioHangSanPham.ProductID == SanPham.ProductID) 
        .filter(
            GioHangSanPham.id == buyer_id,
            GioHangSanPham.ten_gio_hang == ten_gio_hang
        )
        .all()
    )