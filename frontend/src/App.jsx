import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import SellerAddProduct from './pages/SellerAddProduct';
import EditProduct from './pages/EditProduct';
import BuyerDashboard from './pages/BuyerDashboard';
import Products from './pages/Products';
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-2xl">Loading...</div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/seller" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
            <Route 
              path="/seller/add-product" 
              element={<ProtectedRoute role="seller"><SellerAddProduct /></ProtectedRoute>} 
            />
            <Route
              path="/seller/edit-product/:id"
              element={
                <ProtectedRoute role="seller">
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/buyer" 
              element={
                <ProtectedRoute role="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;