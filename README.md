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




