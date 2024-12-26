import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/orders', label: 'Orders', icon: '🛍️' },
  ];

  return (
    <nav className="py-6">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin'}
          className={({ isActive }) =>
            `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-gray-100 font-medium' : ''
            }`
          }
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminSidebar; 