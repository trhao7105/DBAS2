from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import DonHang, OrderDetails, OrderCartRelation, GioHangSanPham, SanPham, DangLen
from datetime import datetime

def create_order_from_cart(db: Session, buyer_id: int, ten_gio_hang: str = "default", phuong_thuc: str = "COD"):
    # 1. LẤY TẤT CẢ SẢN PHẨM TRONG GIỎ
    items = db.query(GioHangSanPham).filter(
        GioHangSanPham.id == buyer_id,
        GioHangSanPham.ten_gio_hang == ten_gio_hang
    ).all()

    if not items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống!")

    # 2. TÍNH TỔNG TIỀN + LẤY SELLER (hỗ trợ nhiều seller)
    tong_tien = 0
    seller_ids = set()

    for item in items:
        sp = db.query(SanPham).get(item.ProductID)
        if not sp:
            continue
        tong_tien += float(sp.Gia) * item.SoLuong

        # Lấy SellerID từ bảng DangLen
        dang_len = db.query(DangLen).filter(DangLen.ProductID == item.ProductID).first()
        if dang_len:
            seller_ids.add(dang_len.SellerID)

    if not seller_ids:
        raise HTTPException(status_code=400, detail="Không tìm thấy người bán cho sản phẩm trong giỏ!")

    # Nếu có nhiều seller → tạm lấy 1 (hoặc sau này tách đơn)
    seller_id = seller_ids.pop()

    # 3. TẠO ĐƠN HÀNG
    order = DonHang(
        NgayDat=datetime.utcnow(),
        SoLuong=sum(i.SoLuong for i in items),
        PhuongThucThanhToan=phuong_thuc,
        TrangThaiDonHang="Đã thanh toán" if phuong_thuc != "COD" else "Chờ thanh toán",
        BuyerID=buyer_id,
        SellerID=seller_id,
        TongTien=tong_tien
    )
    db.add(order)
    db.flush()  # để lấy OrderID

    # 4. TẠO CHI TIẾT ĐƠN HÀNG + TRỪ KHO
    for item in items:
        db.add(OrderDetails(
            ProductID=item.ProductID,
            OrderID=order.OrderID,
            Quantity=item.SoLuong
        ))
        sp = db.query(SanPham).get(item.ProductID)
        if sp:
            sp.SoLuongTon -= item.SoLuong

    # 5. GHI LẠI LIÊN KẾT GIỎ HÀNG (nếu cần)
    db.add(OrderCartRelation(
        OrderID=order.OrderID,
        CartName=ten_gio_hang,
        ScartID=buyer_id
    ))

    # 6. XÓA HẾT SẢN PHẨM KHỎI GIỎ HÀNG
    for item in items:
        db.delete(item)

    db.commit()
    return order