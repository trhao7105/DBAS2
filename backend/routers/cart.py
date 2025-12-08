from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from crud.cart import add_to_cart, get_cart_items
from crud.user import get_role
from utils.security import get_current_user
from pydantic import BaseModel
router = APIRouter(tags=["Cart"])  # ← Thêm prefix để gọi /cart/

class CartAddRequest(BaseModel):
    ProductID: int
    SoLuong: int = 1
    ten_gio_hang: str = "default"

@router.post("/add")
def add_to_cart_route(
    request: CartAddRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(status_code=403, detail="Chỉ người mua mới được thêm vào giỏ hàng")

    add_to_cart(
        db=db,
        buyer_id=current_user["id"],
        product_id=request.ProductID,
        so_luong=request.SoLuong,
        ten_gio_hang=request.ten_gio_hang
    )
    return {"message": "Đã thêm vào giỏ hàng thành công!"}


# XEM GIỎ HÀNG
@router.get("/")
def view_cart(
    ten_gio_hang: str = Query("default", description="Tên giỏ hàng"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = get_role(db, current_user["id"])
    if role != "buyer":
        raise HTTPException(status_code=403, detail="Chỉ người mua mới xem được giỏ hàng")

    items = get_cart_items(db, current_user["id"], ten_gio_hang)

    cart_data = []
    total_price = 0

    for item in items:
        product = item.sanpham  # relationship đã load
        if not product:
            continue

        price = float(product.Gia)
        subtotal = price * item.SoLuong
        total_price += subtotal

        cart_data.append({
            "ProductID": product.ProductID,
            "TenSanPham": product.TenSanPham,
            "HinhAnh": product.HinhAnh or "/static/default.jpg",
            "Gia": price,
            "SoLuong": item.SoLuong,
            "ThanhTien": subtotal
        })

    return {
        "items": cart_data,
        "total_items": len(cart_data),
        "total_price": round(total_price, 2),
        "ten_gio_hang": ten_gio_hang
    }


# XÓA KHỎI GIỎ HÀNG (BONUS – NÊN CÓ)
@router.delete("/remove/{ProductID}")
def remove_from_cart(
    ProductID: int,
    ten_gio_hang: str = Query("default"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from crud.cart import remove_from_cart_item
    remove_from_cart_item(db, current_user["id"], ProductID, ten_gio_hang)
    return {"message": "Đã xóa sản phẩm khỏi giỏ hàng"}


# CẬP NHẬT SỐ LƯỢNG (BONUS)
@router.put("/update/{ProductID}")
def update_cart_quantity(
    ProductID: int,
    SoLuong: int,
    ten_gio_hang: str = Query("default"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from crud.cart import update_cart_quantity
    update_cart_quantity(db, current_user["id"], ProductID, SoLuong, ten_gio_hang)
    return {"message": "Đã cập nhật số lượng"}