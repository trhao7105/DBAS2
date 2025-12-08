# backend/routers/user.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud.user import get_user, get_role
from utils.security import get_current_user
from models import NguoiDung
router = APIRouter(tags=["user"])

@router.get("/me")
async def read_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(NguoiDung).filter(NguoiDung.id == current_user["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User không tồn tại")
    return {
        "id": user.id,
        "ten_dang_nhap": user.ten_dang_nhap,
        "ho_va_tendem": user.ho_va_tendem,
        "ten": user.ten,
        "so_dien_thoai": user.so_dien_thoai,
        "role": current_user["role"]
    }