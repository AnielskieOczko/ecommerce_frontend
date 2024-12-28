import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
