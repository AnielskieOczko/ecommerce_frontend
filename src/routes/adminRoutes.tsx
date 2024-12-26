import { RouteObject } from 'react-router-dom';
import AdminLayout from '../pages/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
// import {
//   ProductList,
//   ProductCreate,
//   ProductEdit,
// } from '../pages/admin/products';

import { CategoryList, CategoryCreate, CategoryEdit } from '../pages/admin/categories';
// import {
//   UserList,
//   UserEdit,
// } from '../pages/admin/users';
// import {
//   OrderList,
//   OrderEdit,
// } from '../pages/admin/orders';

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    // Products
    // {
    //   path: 'products',
    //   children: [
    //     { index: true, element: <ProductList /> },
    //     { path: 'create', element: <ProductCreate /> },
    //     { path: ':id/edit', element: <ProductEdit /> },
    //   ],
    // },
    // Categories
    {
      path: 'categories',
      children: [
        { index: true, element: <CategoryList /> },
        { path: 'create', element: <CategoryCreate /> },
        { path: ':id/edit', element: <CategoryEdit /> },
      ],
    },
    // Users
    // {
    //   path: 'users',
    //   children: [
    //     { index: true, element: <UserList /> },
    //     { path: ':id/edit', element: <UserEdit /> },
    //   ],
    // },
    // Orders
    // {
    //   path: 'orders',
    //   children: [
    //     { index: true, element: <OrderList /> },
    //     { path: ':id/edit', element: <OrderEdit /> },
    //   ],
    // },
  ],
};
