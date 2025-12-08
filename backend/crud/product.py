# backend/crud/product.py
from sqlalchemy.orm import Session
from models import SanPham, DangLen
from datetime import datetime

def create_product(db: Session, seller_id: int, ten_sp: str, mo_ta: str | None, gia: float, 
                   so_luong_ton: int, ma_loai: int, hinh_anh: str | None):
    product = SanPham(
        TenSanPham=ten_sp,
        MoTa=mo_ta,
        Gia=gia,
        SoLuongTon=so_luong_ton,
        MaLoai=ma_loai,
        HinhAnh=hinh_anh
    )
    db.add(product)
    db.flush()
    db.refresh(product)   

    dang_len = DangLen(
        ProductID=product.ProductID,
        SellerID=seller_id,
        NgayDang=datetime.utcnow()
    )
    db.add(dang_len)
    db.commit()         
    db.refresh(product)
    return product

def get_all_products(db: Session):
    return db.query(SanPham).all()

def get_my_products(db: Session, seller_id: int):
    return db.query(SanPham).join(DangLen).filter(DangLen.SellerID == seller_id).all()