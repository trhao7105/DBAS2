# backend/routers/product.py
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File, status
from sqlalchemy.orm import Session
from database import get_db
from crud.product import create_product, get_all_products, get_my_products
from crud.user import get_role
from utils.security import get_current_user
from datetime import datetime
from models import SanPham, DangLen, GioHangSanPham, LoaiSanPham, NguoiDung

router = APIRouter(tags=["products"])

# -------------------- CATEGORIES --------------------
@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Lấy tất cả danh mục sản phẩm
    """
    return db.query(LoaiSanPham).order_by(LoaiSanPham.MaLoai).all()


# -------------------- LIST / FILTER --------------------
@router.get("/")
def list_products(ma_loai: int | None = None, db: Session = Depends(get_db)):
    """
    Lấy tất cả sản phẩm, có thể lọc theo ma_loai
    """
    query = db.query(SanPham)
    if ma_loai:
        query = query.filter(SanPham.MaLoai == ma_loai)
    products = query.all()

    return [
        {
            "ProductID": p.ProductID,
            "HinhAnh": p.HinhAnh,
            "TenSanPham": p.TenSanPham,
            "Gia": float(p.Gia),
            "SoLuongTon": p.SoLuongTon,
            "MoTa": p.MoTa,
            "MaLoai": p.MaLoai,
            "TenLoai": p.loaisanpham.TenLoai if hasattr(p, "loaisanpham") and p.loaisanpham else "Khác"
        }
        for p in products
    ]


# -------------------- MY PRODUCTS --------------------
@router.get("/my")
def my_products(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if get_role(db, int(current_user["id"])) != "seller":
        raise HTTPException(403, "Chỉ người bán mới xem được sản phẩm của họ")
    return get_my_products(db, int(current_user["id"]))


# -------------------- DETAIL --------------------
@router.get("/{product_id}")
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    product = db.query(SanPham).filter(SanPham.ProductID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    danglen = db.query(DangLen).filter(DangLen.ProductID == product_id).first()
    seller_id = danglen.SellerID if danglen else None

    return {
        "ProductID": product.ProductID,
        "TenSanPham": product.TenSanPham,
        "MoTa": product.MoTa,
        "Gia": float(product.Gia),
        "SoLuongTon": product.SoLuongTon,
        "HinhAnh": product.HinhAnh,
        "MaLoai": product.MaLoai,
        "NgayTao": getattr(product, 'NgayTao', None),
        "SellerID": seller_id
    }


# -------------------- CREATE --------------------
@router.post("/create")
async def create(
    TenSanPham: str = Form(...),
    MoTa: str = Form(None),
    Gia: float = Form(...),
    SoLuongTon: int = Form(...),
    MaLoai: int = Form(...),
    HinhAnh: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if get_role(db, int(current_user["id"])) != "seller":
        raise HTTPException(403, "Chỉ người bán mới được đăng sản phẩm")

    filename = None
    if HinhAnh:
        filename = f"uploads/{datetime.now().strftime('%Y%m%d%H%M%S')}_{HinhAnh.filename}"
        with open(f"static/{filename}", "wb") as f:
            f.write(await HinhAnh.read())

    product = create_product(
        db=db,
        seller_id=int(current_user["id"]),
        ten_sp=TenSanPham,
        mo_ta=MoTa,
        gia=Gia,
        so_luong_ton=SoLuongTon,
        ma_loai=MaLoai,
        hinh_anh=filename
    )
    return {"msg": "Đăng sản phẩm thành công", "product_id": product.ProductID}


# -------------------- UPDATE --------------------
@router.put("/update/{product_id}")
async def update_product(
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
    if get_role(db, int(current_user["id"])) != "seller":
        raise HTTPException(status_code=403, detail="Chỉ người bán mới được sửa sản phẩm")

    product = (
        db.query(SanPham)
        .join(DangLen, DangLen.ProductID == SanPham.ProductID)
        .filter(SanPham.ProductID == product_id, DangLen.SellerID == int(current_user["sub"]))
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại hoặc bạn không có quyền")

    product.TenSanPham = TenSanPham
    product.MoTa = MoTa
    product.Gia = Gia
    product.SoLuongTon = SoLuongTon
    product.MaLoai = MaLoai

    if HinhAnh:
        filename = f"uploads/{datetime.now().strftime('%Y%m%d%H%M%S')}_{HinhAnh.filename}"
        with open(f"static/{filename}", "wb") as f:
            f.write(await HinhAnh.read())
        product.HinhAnh = filename

    db.commit()
    db.refresh(product)
    return {"msg": "Cập nhật sản phẩm thành công", "product_id": product.ProductID}


# -------------------- DELETE --------------------
@router.delete("/delete/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if get_role(db, int(current_user["id"])) != "seller":
        raise HTTPException(status_code=403, detail="Chỉ người bán mới được xóa sản phẩm")

    product = (
        db.query(SanPham)
        .join(DangLen, DangLen.ProductID == SanPham.ProductID)
        .filter(SanPham.ProductID == product_id, DangLen.SellerID == int(current_user["sub"]))
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại hoặc bạn không có quyền")

    db.query(GioHangSanPham).filter(GioHangSanPham.ProductID == product_id).delete()
    db.delete(product)
    db.commit()
    return {"msg": "Xóa sản phẩm thành công"}

# -------------------SELLER /GET------------------#
@router.get("/my")
def get_my_products_api(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    products = get_my_products(db, current_user.id)

    return [
        {
            "ProductID": p.ProductID,
            "TenSanPham": p.TenSanPham,
            "Gia": float(p.Gia),
            "SoLuongTon": p.SoLuongTon,
            "HinhAnh": p.HinhAnh,
            "MaLoai": p.MaLoai
        }
        for p in products
    ]