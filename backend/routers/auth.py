from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas import UserRegister, Token   # THÊM DÒNG NÀY
from crud.user import get_user_by_username, create_user, get_role
from utils.security import verify_password, create_access_token
from database import get_db

router = APIRouter(tags=["Auth"])

@router.post("/register", response_model=dict)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if get_user_by_username(db, user_in.ten_dang_nhap):
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    user = create_user(
        db=db,
        ten_dang_nhap=user_in.ten_dang_nhap,
        mat_khau=user_in.mat_khau,
        ho_va_tendem=user_in.ho_va_tendem,
        ten=user_in.ten,
        so_dien_thoai=user_in.so_dien_thoai,
        role=user_in.role
    )
    return {"message": "Đăng ký thành công!", "user_id": user.id}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.mat_khau):
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập hoặc mật khẩu")
    
    role = get_role(db, user.id)

    access_token = create_access_token(data={"sub": str(user.id), "role": role})

    # Trả về thêm thông tin cần thiết cho frontend
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.ten_dang_nhap,
            "ho_ten": f"{user.ho_va_tendem} {user.ten}",
            "role": role
        }
    }