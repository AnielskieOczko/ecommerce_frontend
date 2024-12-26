import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryDTO } from '../../../types/product';
import { PaginatedResponse, PageRequest } from '../../../types/common';
import { productService } from '../../../services/productService';
import debounce from 'lodash/debounce';

const CategoryList = () => {
  // State
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 1,
    size: 10,
    search: '',
  });
  const [pagination, setPagination] = useState<PaginatedResponse<CategoryDTO> | null>(null);

  // Debounced search function
  const debouncedSearch = debounce((search: string) => {
    setPageRequest((prev) => ({
      ...prev,
      page: 1, // Reset to first page on search
      search,
    }));
  }, 300);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllCategories(pageRequest);
      setCategories(response.content);
      setPagination(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pageRequest]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setPageRequest((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageRequest((prev) => ({ ...prev, page: 1, size }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await productService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete category');
      }
    }
  };

  if (loading && !categories.length) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link
          to="/admin/categories/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              defaultValue={pageRequest.search}
              onChange={handleSearchChange}
              placeholder="Search categories..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={pageRequest.size}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded p-2"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{category.id}</td>
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {(pageRequest.page - 1) * pageRequest.size + 1} to{' '}
              {Math.min(pageRequest.page * pageRequest.size, pagination.totalElements)} of{' '}
              {pagination.totalElements} entries
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pageRequest.page - 1)}
                disabled={pageRequest.page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const current = pageRequest.page;
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= current - 1 && page <= current + 1)
                  );
                })
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border ${
                      pageRequest.page === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() => handlePageChange(pageRequest.page + 1)}
                disabled={pageRequest.page === pagination.totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
