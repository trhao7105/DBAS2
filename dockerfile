# Dùng Python nhẹ
FROM python:3.12-slim

# Tạo thư mục app
WORKDIR /app

# Copy requirements trước (tối ưu build)
COPY backend/requirements.txt .

# Cài thư viện
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ backend
COPY backend/ .

# Port Render sử dụng
ENV PORT=10000

# Chạy FastAPI
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]