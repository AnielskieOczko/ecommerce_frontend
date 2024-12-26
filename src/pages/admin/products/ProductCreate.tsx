import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import ImageUpload from '../../../components/admin/ImageUpload';
import { ProductCreateDTO } from '../../../types/product';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const handleImageSelect = (files: FileList) => {
    setImages(Array.from(files));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const productData: ProductCreateDTO = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        currencyCode: formData.get('currencyCode') as string,
        quantity: Number(formData.get('quantity')),
        categoryIds: [Number(formData.get('categoryId'))],
        imageList: images.map((file) => ({
          id: 0,
          url: URL.createObjectURL(file),
          path: file.name,
          altText: file.name,
          mimeType: file.type,
        })),
      };

      await productService.createProduct(productData);
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      <div className="mb-4">
        <label className="block mb-2">Product Images</label>
        <ImageUpload onImageSelect={handleImageSelect} />
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
      {/* Other form fields */}
    </form>
  );
};

export default ProductCreate;
