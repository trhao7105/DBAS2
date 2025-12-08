
from sqlalchemy.orm import Session
from models import NguoiDung, Admin, NguoiBan, NguoiMua  # Import từ models.py (1 file duy nhất)
from utils.security import get_password_hash

# Lấy user theo ID
def get_user(db: Session, user_id: int):
    return db.query(NguoiDung).filter(NguoiDung.id == user_id).first()

# Lấy user theo tên đăng nhập
def get_user_by_username(db: Session, username: str):
    return db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == username).first()

# Tạo user mới + tự động thêm role (buyer/seller/admin)
def create_user(
    db: Session,
    ten_dang_nhap: str,
    mat_khau: str,
    ho_va_tendem: str,
    ten: str,
    so_dien_thoai: str = None,
    role: str = "buyer"
):
    # Mã hóa mật khẩu
    hashed_password = get_password_hash(mat_khau)

    # Tạo user chính
    new_user = NguoiDung(
        ten_dang_nhap=ten_dang_nhap,
        mat_khau=hashed_password,
        ho_va_tendem=ho_va_tendem,
        ten=ten,
        so_dien_thoai=so_dien_thoai
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Tự động thêm vào bảng role tương ứng
    if role == "admin":
        db.add(Admin(id=new_user.id))
    elif role == "seller":
        db.add(NguoiBan(id=new_user.id))
    else:  # buyer là mặc định
        db.add(NguoiMua(id=new_user.id))
    
    db.commit()
    return new_user

# Lấy role của user (admin / seller / buyer)
def get_role(db: Session, user_id: int) -> str:
    if db.query(Admin).filter(Admin.id == user_id).first():
        return "admin"
    if db.query(NguoiBan).filter(NguoiBan.id == user_id).first():
        return "seller"
    return "buyer"