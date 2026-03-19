# backend/routers/seller.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from database import get_db
from utils.security import get_current_user
from crud.product import create_product
import shutil
import os
from datetime import datetime
router = APIRouter(tags=["Seller"])

@router.post("/products")
async def create_product_route(
    TenSanPham: str = Form(...),
    MoTa: str = Form(None),
    Gia: float = Form(...),
    SoLuongTon: int = Form(...),
    MaLoai: int = Form(1),
    HinhAnh: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "seller":
        raise HTTPException(status_code=403, detail="Chỉ seller mới được đăng sản phẩm")

    image_filename = None
    if HinhAnh and HinhAnh.filename:
        timestamp = int(datetime.utcnow().timestamp())
        filename = f"{timestamp}_{HinhAnh.filename}"
        
        # ĐƯỜNG DẪN ĐẦY ĐỦ ĐỂ LƯU FILE
        os.makedirs("static/images", exist_ok=True)
        full_path = f"static/images/{filename}"
        
        with open(full_path, "wb") as f:
            shutil.copyfileobj(HinhAnh.file, f)
        
        # CHỈ LƯU TÊN FILE VÀO DB
        image_filename = filename
    else:
        image_filename = None

    product = create_product(
        db=db,
        seller_id=current_user["id"],
        ten_sp=TenSanPham,
        mo_ta=MoTa,
        gia=Gia,
        so_luong_ton=SoLuongTon,
        ma_loai=MaLoai,
        hinh_anh=image_filename  # ← CHỈ TÊN FILE!
    )

    return {
        "message": "Đăng sản phẩm thành công!",
        "product_id": product.ProductID,
        "image_url": f"https://dbas2.onrender.com/uploads/{image_filename}" if image_filename else None
    }

# CẬP NHẬT SẢN PHẨM
@router.put("/products/{product_id}")
async def update_product_route(
    product_id: int,
    TenSanPham: str = Form(...),
    MoTa: str = Form(None),
    Gia: float = Form(...),
    SoLuongTon: int = Form(...),
    MaLoai: int = Form(...),
    HinhAnh: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "seller":
        raise HTTPException(status_code=403, detail="Chỉ seller mới được sửa sản phẩm")

    from models import SanPham, DangLen

    # KIỂM TRA QUA DANGLEN
    dang_len_record = db.query(DangLen).filter(
        DangLen.ProductID == product_id,
        DangLen.SellerID == current_user["id"]
    ).first()

    if not dang_len_record:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại hoặc không phải của bạn")

    product = db.query(SanPham).filter(SanPham.ProductID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    # Cập nhật thông tin
    product.TenSanPham = TenSanPham
    product.MoTa = MoTa
    product.Gia = Gia
    product.SoLuongTon = SoLuongTon
    product.MaLoai = MaLoai

    # Cập nhật ảnh nếu có
    if HinhAnh and HinhAnh.filename:
        timestamp = int(datetime.utcnow().timestamp())
        filename = f"{timestamp}_{HinhAnh.filename}"
        os.makedirs("static/images", exist_ok=True)
        
        full_path = f"static/images/{filename}"
        with open(full_path, "wb") as f:
            shutil.copyfileobj(HinhAnh.file, f)
        
        # Xóa ảnh cũ
        if product.HinhAnh:
            old_path = f"static/images/{product.HinhAnh}"
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except:
                    pass
        
        product.HinhAnh = filename  # ← CHỈ LƯU TÊN FILE

    db.commit()
    db.refresh(product)

    return {
        "message": "Cập nhật sản phẩm thành công!",
        "product_id": product.ProductID,
        "image_url": f"https://dbas2.onrender.com/uploads/{product.HinhAnh}" if product.HinhAnh else None
    }


# XÓA SẢN PHẨM
@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_route(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "seller":
        raise HTTPException(status_code=403, detail="Chỉ seller mới được xóa sản phẩm")

    from models import SanPham, DangLen

    # KIỂM TRA QUA BẢNG DANGLEN (NHIỀU-NHIỀU)
    dang_len_record = db.query(DangLen).filter(
        DangLen.ProductID == product_id,
        DangLen.SellerID == current_user["id"]
    ).first()

    if not dang_len_record:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại hoặc không phải của bạn")

    # Xóa sản phẩm (có cascade hoặc xóa thủ công)
    product = db.query(SanPham).filter(SanPham.ProductID == product_id).first()
    if product:
        # Xóa ảnh nếu có
        if product.HinhAnh and os.path.exists(f"static/images/{product.HinhAnh}"):
            try:
                os.remove(f"static/images/{product.HinhAnh}")
            except:
                pass
        db.delete(product)

    # Xóa bản ghi trong danglen
    db.delete(dang_len_record)
    db.commit()

    return {"message": "Xóa sản phẩm thành công!"}