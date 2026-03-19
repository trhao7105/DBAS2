from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, NguoiDung, Admin
from routers import auth, product, cart, order, admin, user, seller
from utils.security import get_password_hash

app = FastAPI(title="AS2 E-commerce", version="1.0")

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://dbas2-1.onrender.com", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/uploads", StaticFiles(directory="static/images"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/auth")
app.include_router(user.router, prefix="/user")
app.include_router(product.router, prefix="/products")
app.include_router(cart.router, prefix="/cart")
app.include_router(order.router, prefix="/orders")
app.include_router(admin.router, prefix="/admin")
app.include_router(seller.router, prefix="/seller")

# Home
@app.get("/")
def home():
    return {"message": "AS2 Shop API running!", "docs": "/docs"}


# FIX QUAN TRỌNG: DB + admin init
@app.on_event("startup")
def startup():
    # Tạo bảng (chỉ khi start server)
    Base.metadata.create_all(bind=engine)

    # Tạo admin mặc định
    db: Session = next(get_db())
    try:
        if not db.query(NguoiDung).filter(NguoiDung.ten_dang_nhap == "admin").first():
            admin_user = NguoiDung(
                ten_dang_nhap="admin",
                mat_khau=get_password_hash("admin123"),
                ho_va_tendem="Quản Trị",
                ten="Viên"
            )
            db.add(admin_user)
            db.flush()

            db.add(Admin(id=admin_user.id))
            db.commit()

            print("Admin created: admin / admin123")
    finally:
        db.close()