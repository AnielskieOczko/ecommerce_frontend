import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import { CategoryList, CategoryCreate, CategoryEdit } from './pages/admin/categories';
import PublicLayout from './layouts/PublicLayout';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import BlogSection from './components/BlogSection';
import Reviews from './components/Reviews';
import ProductList from './pages/admin/products/ProductList';
import ProductCreate from './pages/admin/products/ProductCreate';

function App() {
  return (
    <Router>
      <Routes>
        {/* Your existing public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route
            index
            element={
              <>
                <Hero />
                <ProductSection title="Kosmetyki z Serii Białej" bgColor="bg-white" />
                <ProductSection title="Kosmetyki z Serii Białej" bgColor="bg-white" />
                <BlogSection />
                <Reviews />
              </>
            }
          />
          {/* Add other public routes here */}
        </Route>
        {/* Admin routes */}
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
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
