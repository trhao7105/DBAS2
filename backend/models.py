
from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class NguoiDung(Base):
    __tablename__ = "nguoidung"
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    ten_dang_nhap = Column(String(50), unique=True, nullable=False, index=True)
    mat_khau = Column(String(255), nullable=False)
    ho_va_tendem = Column(String(100), nullable=False)
    ten = Column(String(50), nullable=False)
    so_dien_thoai = Column(String(15))
    ngay_tao = Column(DateTime, server_default=func.now(), nullable=False)


    admin = relationship("Admin", back_populates="user", uselist=False, cascade="all, delete-orphan")
    nguoiban = relationship("NguoiBan", back_populates="user", uselist=False, cascade="all, delete-orphan")
    nguoimua = relationship("NguoiMua", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, ForeignKey("nguoidung.id"), primary_key=True)
    role_admin = Column(String(50), default="admin")
    user = relationship("NguoiDung", back_populates="admin")


class NguoiBan(Base):
    __tablename__ = "nguoiban"
    id = Column(Integer, ForeignKey("nguoidung.id"), primary_key=True)
    role_nguoi_ban = Column(String(50), default="seller")
    user = relationship("NguoiDung", back_populates="nguoiban")


class NguoiMua(Base):
    __tablename__ = "nguoimua"
    id = Column(Integer, ForeignKey("nguoidung.id"), primary_key=True)
    role_nguoi_mua = Column(String(50), default="buyer")
    user = relationship("NguoiDung", back_populates="nguoimua")


class LoaiSanPham(Base):
    __tablename__ = "loaisanpham"
    MaLoai = Column(Integer, primary_key=True, autoincrement=True)
    TenLoai = Column(String(100), nullable=False)
    LoaiCha = Column(Integer, ForeignKey("loaisanpham.MaLoai"))


class SanPham(Base):
    __tablename__ = "sanpham"
    ProductID = Column(Integer, primary_key=True)
    HinhAnh = Column(String(255))
    TenSanPham = Column(String(150), nullable=False)
    MoTa = Column(Text)
    Gia = Column(DECIMAL(15,2), nullable=False)
    SoLuongTon = Column(Integer, default=0, nullable=False)
    MaLoai = Column(Integer, ForeignKey("loaisanpham.MaLoai"), nullable=False)
    danglen = relationship("DangLen", back_populates="sanpham", cascade="all, delete-orphan")


class DangLen(Base):
    __tablename__ = "danglen"
    ProductID = Column(Integer, ForeignKey("sanpham.ProductID"), primary_key=True)
    SellerID = Column(Integer, ForeignKey("nguoiban.id"), primary_key=True)
    NgayDang = Column(DateTime, server_default=func.now(), nullable=False)
    sanpham = relationship("SanPham", back_populates="danglen")


class GioHang(Base):
    __tablename__ = "giohang"
    id = Column(Integer, ForeignKey("nguoimua.id"), primary_key=True)
    ten_gio_hang = Column(String(100), primary_key=True)


class GioHangSanPham(Base):
    __tablename__ = "giohang_sanpham"
    ProductID = Column(Integer, ForeignKey("sanpham.ProductID"), primary_key=True)
    id = Column(Integer, primary_key=True)
    ten_gio_hang = Column(String(100), primary_key=True)
    SoLuong = Column(Integer, default=1, nullable=False)
    sanpham = relationship("SanPham", backref="cart_items")


class DonHang(Base):
    __tablename__ = "donhang"
    OrderID = Column(Integer, primary_key=True, autoincrement=True)
    NgayDat = Column(DateTime, server_default=func.now(), nullable=False)
    SoLuong = Column(Integer, nullable=False)
    PhuongThucThanhToan = Column(String(50), nullable=False)
    TrangThaiDonHang = Column(String(50), default="Chờ xác nhận", nullable=False)
    BuyerID = Column(Integer, ForeignKey("nguoimua.id"), nullable=False)
    SellerID = Column(Integer, ForeignKey("nguoiban.id"), nullable=False)
    TongTien = Column(DECIMAL(15,2), default=0.00)


class OrderDetails(Base):
    __tablename__ = "order_details"
    ProductID = Column(Integer, ForeignKey("sanpham.ProductID"), primary_key=True)
    OrderID = Column(Integer, ForeignKey("donhang.OrderID"), primary_key=True)
    Quantity = Column(Integer, default=1, nullable=False) 


class OrderCartRelation(Base):
    __tablename__ = "order_cart_relation"
    OrderID = Column(Integer, ForeignKey("donhang.OrderID"), primary_key=True)
    CartName = Column(String(255), primary_key=True)
    ScartID = Column(Integer, primary_key=True)
