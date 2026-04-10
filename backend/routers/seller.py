from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from database import get_db
from utils.security import get_current_user
from crud.product import create_product
import cloudinary
import cloudinary.uploader
from datetime import datetime

router = APIRouter(tags=["Seller"])

# -------------------- TẠO SẢN PHẨM --------------------
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

    image_url = None
    if HinhAnh:
        try:
            result = cloudinary.uploader.upload(
                HinhAnh.file,
                folder="ecommerce_products"
            )
            image_url = result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi upload ảnh: {str(e)}")

    product = create_product(
        db=db,
        seller_id=current_user["id"],
        ten_sp=TenSanPham,
        mo_ta=MoTa,
        gia=Gia,
        so_luong_ton=SoLuongTon,
        ma_loai=MaLoai,
        hinh_anh=image_url  # ← TRUYỀN URL CLOUDINARY VÀO ĐÂY
    )

    return {
        "message": "Đăng sản phẩm thành công!",
        "product_id": product.ProductID,
        "image_url": image_url
    }


# -------------------- CẬP NHẬT SẢN PHẨM --------------------
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

    # Cập nhật ảnh lên Cloudinary nếu có ảnh mới
    if HinhAnh:
        try:
            result = cloudinary.uploader.upload(
                HinhAnh.file,
                folder="ecommerce_products"
            )
            product.HinhAnh = result.get("secure_url")  # ← CẬP NHẬT URL MỚI
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi upload ảnh: {str(e)}")

    db.commit()
    db.refresh(product)

    return {
        "message": "Cập nhật sản phẩm thành công!",
        "product_id": product.ProductID,
        "image_url": product.HinhAnh
    }


# -------------------- XÓA SẢN PHẨM --------------------
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

    product = db.query(SanPham).filter(SanPham.ProductID == product_id).first()
    
    # Xóa sản phẩm
    if product:
        db.delete(product)

    # Xóa bản ghi trong danglen
    db.delete(dang_len_record)
    db.commit()

    return {"message": "Xóa sản phẩm thành công!"}