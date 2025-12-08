from sqlalchemy import text
from database import engine

with engine.connect() as conn:
    rs = conn.execute(text("SELECT * FROM loaisanpham WHERE MaLoai = 1"))
    print(rs.fetchall())
