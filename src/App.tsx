import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import { CategoryList, CategoryCreate, CategoryEdit } from './pages/admin/categories';
import { ProductList, ProductCreate, ProductEdit } from './pages/admin/products';
import { UserList, UserCreate, UserEdit } from './pages/admin/users';

// Route Configurations
import { CustomerRoutes } from './routes/customerRoutes';
import RouteGuard from './components/guards/RouteGuard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* Customer Routes */}
          {CustomerRoutes}

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <RouteGuard requiredRoles={['ROLE_ADMIN']}>
                <AdminLayout />
              </RouteGuard>
            }
          >
            <Route index element={<Dashboard />} />

            {/* User Management */}
            <Route path="users">
              <Route index element={<UserList />} />
              <Route path="create" element={<UserCreate />} />
              <Route path=":userId/edit" element={<UserEdit />} />
            </Route>

            {/* Category Management */}
            <Route path="categories">
              <Route index element={<CategoryList />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path=":categoryId/edit" element={<CategoryEdit />} />
            </Route>

            {/* Product Management */}
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="create" element={<ProductCreate />} />
              <Route path=":productId/edit" element={<ProductEdit />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
