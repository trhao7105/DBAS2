from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import NguoiDung

# JWT settings
SECRET_KEY = "your-secret-key-123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# TẮT HOÀN TOÀN HASH – MẬT KHẨU LƯU NGUYÊN VĂN
def get_password_hash(password: str) -> str:
    return password  # ← Không hash nữa, trả về luôn mật khẩu gốc

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return plain_password == hashed_password  # ← So sánh trực tiếp

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_id(db: Session, user_id: int):
    return db.query(NguoiDung).filter(NguoiDung.id == user_id).first()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")      # ← Dùng "sub" từ token
        role: str = payload.get("role")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token không hợp lệ")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    
    user = get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User không tồn tại")
    
    # TRẢ VỀ CẢ "sub" ĐỂ KHỚP VỚI TOKEN (tránh KeyError)
    return {"id": user.id, "sub": str(user.id), "ten_dang_nhap": user.ten_dang_nhap, "role": role}