from pydantic import BaseModel
from typing import Optional

class UserRegister(BaseModel):
    ten_dang_nhap: str
    mat_khau: str
    ho_va_tendem: str
    ten: str
    so_dien_thoai: Optional[str] = None
    role: str = "buyer"

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str