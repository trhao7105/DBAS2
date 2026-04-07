# BACKEND
## INSTALL ENVI
Đảm bảo đã cài: git, python, node.js
Tạo môi trường ảo: cd backend -> python -m venv venv
Kích hoạt môi trường ảo: venv\Scripts\activate (Windows)
                        source venv/bin/activate (Mac/Linux)
## Cài đặt thư viện backend
pip install -r requirements.txt

## Note
file database (sql) nằm trong backend -> store
để kết nối được database, thay đổi đường dẫn trong backend -> database.py

# FRONTEND
cd frontend
npm install

# RUN FRONTEND
cd frontend -> npm run dev
# RUN BACKEND
cd backend -> uvicorn main:app --reload
# 🛒 Shop Online Web - User Guide

Hướng dẫn cách sử dụng hệ thống website bán hàng online, bao gồm tài khoản người mua và người bán.

---

# 👤 1. Tài khoản người mua (Buyer)

## 🔐 Đăng ký tài khoản
- Người dùng có thể tạo tài khoản mới bằng chức năng **Đăng ký (Register)**.
- Nhập đầy đủ thông tin cần thiết:
  - Username
  - Mật khẩu

---

## 🔑 Đăng nhập

### 👉 Tài khoản mẫu:
- **Username:** `buyer1`  
- **Mật khẩu:** `654321`

---

## 🏠 Giao diện người mua
Sau khi đăng nhập thành công, người dùng sẽ vào giao diện mua sắm.

### Chức năng chính:
- Xem danh sách sản phẩm
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Tạo đơn hàng từ giỏ hàng

---

## 🖼️ Hình ảnh minh họa

### 📌 Trang danh sách sản phẩm
<img width="2498" height="1340" alt="image" src="https://github.com/user-attachments/assets/a8d8592e-9da9-45b0-97af-2e657e4ddd73" />
 
*Hiển thị tất cả sản phẩm có trong hệ thống.*

---

### 📌 Trang chi tiết sản phẩm
<img width="2523" height="1313" alt="image" src="https://github.com/user-attachments/assets/5f5c5a1d-b109-43e5-9760-3860c1d36070" />

*Mô tả: Hiển thị thông tin chi tiết và nút thêm vào giỏ hàng.*

---

### 📌 Giỏ hàng
<img width="2526" height="1287" alt="image" src="https://github.com/user-attachments/assets/696bb8ba-50a1-444f-95a9-355dc2f56c64" />

*Mô tả: Danh sách sản phẩm đã chọn.*

---

### 📌 Trang đặt hàng
<img width="2506" height="1197" alt="image" src="https://github.com/user-attachments/assets/d09c79e9-6707-4896-9912-2228185b6aac" />
 
*Xác nhận thông tin đơn hàng trước khi đặt.*

---

# 🏪 2. Tài khoản người bán (Seller)

## 🔑 Đăng nhập

### 👉 Tài khoản mẫu:
- **Username:** `seller1`  
- **Mật khẩu:** `123456`

---

## 🖥️ Giao diện người bán (Admin)
- Sau khi đăng nhập, người bán sẽ vào trang quản trị.

---

###  Chức năng chính:

- Đăng sản phẩm
- Cập nhật sản phẩm
- Xóa sản phẩm
---

## 🖼️ Hình ảnh minh họa

### 📌 Dashboard người bán
<img width="2509" height="1309" alt="image" src="https://github.com/user-attachments/assets/dcb32f00-1c40-4710-893b-648067a237ac" />

*Mô tả: Trang tổng quan quản lý sản phẩm.*

---

### 📌 Thêm sản phẩm
<img width="2505" height="1338" alt="image" src="https://github.com/user-attachments/assets/b1cf3292-8e4c-40ef-82f5-789059001d2e" />
 
*Form nhập thông tin sản phẩm mới.*

---

### 📌 Cập nhật sản phẩm
<img width="2518" height="1315" alt="image" src="https://github.com/user-attachments/assets/ddf09f67-f28b-47d3-b2b7-d68a3fa61352" />
 
*Mô tả: Chỉnh sửa thông tin sản phẩm.*

---

### 📌 Danh sách sản phẩm
<img width="2524" height="1339" alt="image" src="https://github.com/user-attachments/assets/30ff629a-5559-4624-a156-8fc4722a0534" />
 
*Danh sách các sản phẩm đã đăng.*

---







