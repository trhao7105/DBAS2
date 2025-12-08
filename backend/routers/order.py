# backend/routers/order.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud.order import create_order_from_cart
from crud.user import get_role
from utils.security import get_current_user

router = APIRouter(tags=["orders"])

@router.post("/create")
def create_order(
    ten_gio_hang: str = "default",
    PhuongThucThanhToan: str = "COD",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if get_role(db, int(current_user["sub"])) != "buyer":
        raise HTTPException(403)

    order = create_order_from_cart(db, int(current_user["sub"]), ten_gio_hang, PhuongThucThanhToan)
    return {
        "msg": "Đặt hàng thành công!",
        "order_id": order.OrderID,
        "tong_tien": float(order.TongTien),
        "trang_thai": order.TrangThaiDonHang
    }

@router.get("/my")
def my_orders(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import DonHang, OrderDetails, SanPham
    orders = db.query(DonHang).filter(DonHang.BuyerID == int(current_user["sub"])).all()
    return [
        {
            "OrderID": o.OrderID,
            "NgayDat": o.NgayDat,
            "TongTien": float(o.TongTien),
            "TrangThai": o.TrangThaiDonHang,
            "items": [
                {"TenSanPham": p.TenSanPham, "Gia": float(p.Gia)}
                for p in db.query(SanPham).join(OrderDetails).filter(OrderDetails.OrderID == o.OrderID).all()
            ]
        } for o in orders
    ]