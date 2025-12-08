# backend/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud.user import get_role
from utils.security import get_current_user
from models import NguoiDung, DonHang, SanPham

router = APIRouter(prefix="/admin", tags=["admin"])

def admin_only(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if get_role(db, int(current_user["sub"])) != "admin":
        raise HTTPException(403, "Chỉ admin mới được truy cập")
    return True

@router.get("/users")
def list_users(_ = Depends(admin_only), db: Session = Depends(get_db)):
    users = db.query(NguoiDung).all()
    return [{"id": u.id, "username": u.ten_dang_nhap, "role": get_role(db, u.id)} for u in users]

@router.get("/orders")
def list_orders(_ = Depends(admin_only), db: Session = Depends(get_db)):
    return db.query(DonHang).all()