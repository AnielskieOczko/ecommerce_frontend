import { Route } from 'react-router-dom';
import CustomerLayout from '../pages/customer/CustomerLayout';
import Orders from '../pages/customer/Orders';
import AccountOverview from '../pages/customer/account/AccountOverview';
import AccountEdit from '../pages/customer/account/AccountEdit';
import AccountSecurity from '../pages/customer/account/AccountSecurity';
import RouteGuard from '../components/guards/RouteGuard';

export const CustomerRoutes = (
  <Route
    path="/customer"
    element={
      <RouteGuard requiredRoles={['ROLE_USER']}>
        <CustomerLayout />
      </RouteGuard>
    }
  >
    <Route path="orders" element={<Orders />} />
    <Route path="account">
      <Route index element={<AccountOverview />} />
      <Route path="edit" element={<AccountEdit />} />
      <Route path="security" element={<AccountSecurity />} />
    </Route>
  </Route>
);
