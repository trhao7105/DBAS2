# backend/crud/order.py
from sqlalchemy.orm import Session
from models import DonHang, OrderDetails, OrderCartRelation, GioHangSanPham, SanPham, DangLen
from datetime import datetime

def create_order_from_cart(db: Session, buyer_id: int, ten_gio_hang: str = "default", phuong_thuc: str = "COD"):
    items = db.query(GioHangSanPham).filter(
        GioHangSanPham.id == buyer_id,
        GioHangSanPham.ten_gio_hang == ten_gio_hang
    ).all()

    if not items:
        raise ValueError("Giỏ hàng trống")

    tong_tien = 0
    for item in items:
        sp = db.query(SanPham).get(item.ProductID)
        tong_tien += float(sp.Gia) * item.SoLuong

    # Giả sử 1 đơn chỉ từ 1 seller → lấy seller đầu tiên
    seller_id = db.query(DangLen).filter(DangLen.ProductID == items[0].ProductID).first().SellerID

    order = DonHang(
        NgayDat=datetime.utcnow(),
        SoLuong=sum(i.SoLuong for i in items),
        PhuongThucThanhToan=phuong_thuc,
        TrangThaiDonHang="đã thanh toán" if phuong_thuc != "COD" else "chưa thanh toán",
        BuyerID=buyer_id,
        SellerID=seller_id,
        TongTien=tong_tien
    )
    db.add(order)
    db.flush()

    for item in items:
        db.add(OrderDetails(ProductID=item.ProductID, OrderID=order.OrderID))
        sp = db.query(SanPham).get(item.ProductID)
        sp.SoLuongTon -= item.SoLuong

    db.add(OrderCartRelation(OrderID=order.OrderID, CartName=ten_gio_hang, ScartID=buyer_id))
    db.commit()
    return order