import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import { CategoryList, CategoryCreate, CategoryEdit } from './pages/admin/categories';
import HomePage from './pages/HomePage';
import { ProductCreate, ProductEdit, ProductList } from './pages/admin/products';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerLayout from './pages/customer/CustomerLayout';
import Orders from './pages/customer/Orders';
import Settings from './pages/customer/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - No header/footer */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Public Routes - With header/footer */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            {/* other public routes */}
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories">
              <Route index element={<CategoryList />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path=":id/edit" element={<CategoryEdit />} />
            </Route>
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="create" element={<ProductCreate />} />
              <Route path=":id/edit" element={<ProductEdit />} />
            </Route>
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
