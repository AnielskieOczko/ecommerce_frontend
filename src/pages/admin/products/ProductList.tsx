import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductResponseDTO } from '../../../types/product';
import { CategoryDTO } from '../../../types/category';
import { PaginatedResponse, PageRequest } from '../../../types/common';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import debounce from 'lodash/debounce';
import { getImageUrl } from '../../../utils/imageUtils';

interface ProductFilters extends PageRequest {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

const ProductList = () => {
  // State
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination state
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    size: 10,
    search: '',
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 1,
    size: 10,
    search: '',
  });
  const [pagination, setPagination] = useState<PaginatedResponse<ProductResponseDTO> | null>(null);

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories({ page: 1, size: 100 });
        setCategories(response.content);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Debounced search
  const debouncedSearch = debounce((search: string) => {
    setFilters((prev) => ({ ...prev, page: 1, search }));
  }, 300);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(filters);
      setProducts(response.content);
      setPagination(response);
      console.log(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  console.log(products);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete product');
      }
    }
  };

  if (loading && !products.length) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <select
              value={filters.categoryId || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  categoryId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.imageList && product.imageList[0] ? (
                    <img
                      src={getImageUrl(product.imageList[0].path)}
                      alt={product.imageList[0].altText || product.name}
                      className="h-16 w-16 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.categories.map((category) => (
                      <span key={category.id} className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
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
          <div className="px-6 py-4 border-t">
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

export default ProductList;
