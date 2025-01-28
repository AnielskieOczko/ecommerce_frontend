import { createBrowserRouter, Route } from 'react-router-dom';
import { adminRoutes } from './adminRoutes';
import { CustomerRoutes } from './customerRoutes';
import HomePage from '../pages/HomePage';
import { ProductList as PublicProductList } from '../pages/customer/products';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/products',
    element: <PublicProductList />,
  },
  CustomerRoutes,
  adminRoutes,
]);
