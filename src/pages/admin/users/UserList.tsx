import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminUserService } from '../../../services/adminUserService';
import { UserResponseDTO } from '../../../types/user';
import { PageRequest, PaginatedResponse } from '../../../types/common';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState<PaginatedResponse<UserResponseDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 1,
    size: 10,
    sort: 'id',
  });

  useEffect(() => {
    loadUsers();
  }, [pageRequest]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading users with request:', pageRequest);
      const response = await adminUserService.getAllUsers(pageRequest);
      console.log('Received users response:', response);
      setUsers(response);
    } catch (error) {
      console.error('Error loading users:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    try {
      setLoading(true);
      await adminUserService.updateAccountStatus(userId, { active: !isActive });
      await loadUsers();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await adminUserService.deleteUser(userId);
        await loadUsers();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPageRequest({ ...pageRequest, page: newPage });
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        <p>Error: {error}</p>
        <button
          onClick={loadUsers}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!users?.content?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <Link
            to="/admin/users/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create User
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center">No users found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Link
          to="/admin/users/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create User
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.content.map((user) => (
              <tr key={user.userId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.authorities.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/users/${user.userId}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleStatusChange(user.userId, user.isActive)}
                      className={`${
                        user.isActive
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {(pageRequest.page - 1) * pageRequest.size + 1} to{' '}
            {Math.min(pageRequest.page * pageRequest.size, users.totalElements)} of{' '}
            {users.totalElements} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pageRequest.page - 1)}
              disabled={pageRequest.page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pageRequest.page + 1)}
              disabled={pageRequest.page >= users.totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
