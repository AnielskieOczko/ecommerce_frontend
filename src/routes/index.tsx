import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from './adminRoutes';
// Import your other routes

export const router = createBrowserRouter([
  // Your existing public routes
  adminRoutes,
]);
