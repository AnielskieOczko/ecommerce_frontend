import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductResponseDTO, CategoryDTO, ProductUpdateDTO } from '../../../types/product';
import { productService } from '../../../services/productService';
import ImageUpload from '../../../components/admin/ImageUpload';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [product, setProduct] = useState<ProductResponseDTO | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Fetch product and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, categoriesData] = await Promise.all([
          productService.getProductById(Number(id)),
          productService.getAllCategories({ page: 1, size: 100 }),
        ]);

        setProduct(productData);
        setCategories(categoriesData.content);
        setSelectedCategories(productData.categories.map((cat) => cat.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    try {
      const formData = new FormData(e.currentTarget);

      const updateData: ProductUpdateDTO = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        currencyCode: formData.get('currencyCode') as string,
        quantity: Number(formData.get('quantity')),
        categoryIds: selectedCategories,
        imageList: product.imageList, // Keep existing images
      };

      await productService.updateProduct(Number(id), updateData);
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleImageDelete = async (imageId: number) => {
    if (!product || !id) return;

    try {
      await productService.deleteProductImage(Number(id), imageId);
      setProduct({
        ...product,
        imageList: product.imageList.filter((img) => img.id !== imageId),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={product.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              defaultValue={product.price}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={product.description}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category.id]);
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Current Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
          <div className="grid grid-cols-4 gap-4">
            {product.imageList.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.path}
                  alt={image.altText}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
          <ImageUpload onImageSelect={() => {}} />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
