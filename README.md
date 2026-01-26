# BACKEND
## INSTALL ENVI
Đảm bảo đã cài: git, python, node.js
Tạo môi trường ảo: cd backend -> python -m venv venv
Kích hoạt môi trường ảo: venv\Scripts\activate (Windows)
                        source venv/bin/activate (Mac/Linux)
## Cài đặt thư viện backend
pip install -r requirements.txt

## Có thể có 1 vài yêu cầu môi trường cần cài đặt mà lâu quá tui ko nhớ, các bạn có thể cài khi compile ra lỗi

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




