from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from models import Base
from routers import auth, product, cart, order, admin, user, seller  
from utils.security import get_password_hash
from models import NguoiDung, Admin
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles


# Tạo tất cả bảng nếu chưa có (chỉ chạy lần đầu)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AS2 E-commerce – Database gốc của bạn", version="1.0")
app.add_middleware(
   CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   
        "http://localhost:3000",   
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="static/images"), name="uploads")
# Include tất cả routers
app.include_router(auth.router, prefix="/auth")          # ĐĂNG KÝ, ĐĂNG NHẬP
app.include_router(user.router, prefix="/user")          # Thông tin user
app.include_router(product.router, prefix="/products")   # Sản phẩm
app.include_router(cart.router, prefix="/cart")          # Giỏ hàng
app.include_router(order.router, prefix="/orders")       # Đơn hàng
app.include_router(admin.router, prefix="/admin")        # Admin
app.include_router(seller.router, prefix="/seller")      # Seller
@app.get("/")
def home():
    return {"message": "Chào mừng đến AS2 Shop – Assignment 2!", "docs": "/docs"}

# Tạo tài khoản admin mặc định nếu chưa có
@app.on_event("startup")
def create_default_admin():
    db: Session = next(get_db())
    if not db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == "admin").first():
        admin_user = NguoiDung(
            ten_dang_nhap="admin",
            mat_khau=get_password_hash("admin123"),   # mật khẩu: admin123
            ho_va_tendem="Quản Trị",
            ten="Viên"
        )
        db.add(admin_user)
        db.flush()  # để lấy được id

        db.add(Admin(id=admin_user.id))
        db.commit()
        print("ĐÃ TẠO TÀI KHOẢN ADMIN:")
        print("→ Username: admin")
        print("→ Password : admin123")