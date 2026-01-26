import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin!', {
        style: { background: '#f97316', color: '#fff', fontWeight: 'bold' },
      });
      return;
    }

    setLoading(true);
    try {
      const userData = await login(username, password);
      toast.success(`Chào mừng ${userData.ho_ten || username} quay lại!`);
      navigate('/'); // redirect khi login thành công
    } catch (err) {
      // Xử lý mọi trường hợp lỗi
      let message = 'Đăng nhập thất bại!';
      if (err.response) {
        message =
          err.response.data?.detail ||
          err.response.data?.error ||
          `Lỗi ${err.response.status}: ${err.response.statusText}`;
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '18px',
          borderRadius: '12px',
          padding: '16px',
        },
        icon: '⚠️',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 px-4">
      <Toaster position="top-right" reverseOrder={false} /> {/* Hiển thị toast */}
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ĐĂNG NHẬP AS2 SHOP
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-8 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-purple-500 focus:outline-none transition-all"
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-5 border-2 border-gray-300 rounded-2xl text-lg focus:border-purple-500 focus:outline-none transition-all"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-2xl text-2xl font-bold text-white transition-all flex items-center justify-center gap-4 transform hover:scale-105 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-8 h-8" />
                ĐANG ĐĂNG NHẬP...
              </>
            ) : (
              'ĐĂNG NHẬP NGAY'
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-600 text-lg">
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="text-purple-600 font-bold hover:underline text-xl"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
