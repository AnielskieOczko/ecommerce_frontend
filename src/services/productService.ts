import api from './api';
import {
  ProductCreateDTO,
  ProductResponseDTO,
  ProductUpdateDTO,
  CategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/product';
import { PageRequest, PaginatedResponse } from '../types/common';

interface ProductFilters extends PageRequest {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

const BASE_URL = '/api/v1/products';
const CATEGORY_URL = '/api/v1/categories';

// Updated product methods with pagination and filters
export const getAllProducts = async (
  params: ProductFilters
): Promise<PaginatedResponse<ProductResponseDTO>> => {
  try {
    const response = await api.get<PaginatedResponse<ProductResponseDTO>>(BASE_URL, {
      params: {
        page: params.page - 1, // Convert to 0-based for backend
        size: params.size,
        sort: params.sort,
        search: params.search,
        categoryId: params.categoryId,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id: number): Promise<ProductResponseDTO> => {
  try {
    const response = await api.get<ProductResponseDTO>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Updated create product with form data for image upload
export const createProduct = async (product: ProductCreateDTO): Promise<ProductResponseDTO> => {
  try {
    // First upload all images
    const imagePromises = product.imageList.map((image) => uploadImage(image as unknown as File));

    const uploadedImageUrls = await Promise.all(imagePromises);

    // Create product with uploaded image URLs
    const productData = {
      ...product,
      imageList: uploadedImageUrls.map((url) => ({ url })),
    };

    const response = await api.post<ProductResponseDTO>(BASE_URL, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Updated update product with partial updates and image handling
export const updateProduct = async (
  id: number,
  product: ProductUpdateDTO
): Promise<ProductResponseDTO> => {
  try {
    const formData = new FormData();

    // Only append fields that are being updated
    if (product.name) formData.append('name', product.name);
    if (product.description) formData.append('description', product.description);
    if (product.price) formData.append('price', product.price.toString());
    if (product.currencyCode) formData.append('currencyCode', product.currencyCode);
    if (product.quantity) formData.append('quantity', product.quantity.toString());

    // Add category IDs if they're being updated
    if (product.categoryIds) {
      product.categoryIds.forEach((id, index) => {
        formData.append(`categoryIds[${index}]`, id.toString());
      });
    }

    // Add new images if they exist
    if (product.imageList) {
      product.imageList.forEach((image, index) => {
        if (image.path) {
          formData.append(`images[${index}]`, image.path);
        }
      });
    }

    const response = await api.put<ProductResponseDTO>(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};

// Add method to delete product image
export const deleteProductImage = async (productId: number, imageId: number): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${productId}/images/${imageId}`);
  } catch (error) {
    throw error;
  }
};

// search and filter methods
export const searchProducts = async (query: string): Promise<ProductResponseDTO[]> => {
  try {
    const response = await api.get<ProductResponseDTO[]>(`${BASE_URL}/search`, {
      params: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: number): Promise<ProductResponseDTO[]> => {
  try {
    const response = await api.get<ProductResponseDTO[]>(`${BASE_URL}/category/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Category methods
export const getAllCategories = async (params: PageRequest) => {
  try {
    const response = await api.get<PaginatedResponse<CategoryDTO>>('/api/v1/categories', {
      params: {
        page: params.page - 1, // API usually uses 0-based indexing
        size: params.size,
        sort: params.sort,
        search: params.search,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryById = async (id: number): Promise<CategoryDTO> => {
  try {
    const response = await api.get<CategoryDTO>(`${CATEGORY_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ADMIN methods
export const createCategory = async (category: CreateCategoryDTO): Promise<CategoryDTO> => {
  try {
    const response = await api.post<CategoryDTO>(CATEGORY_URL, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  category: UpdateCategoryDTO
): Promise<CategoryDTO> => {
  try {
    const response = await api.put<CategoryDTO>(`${CATEGORY_URL}/${id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`${CATEGORY_URL}/${id}`);
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<{ url: string }>('/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  } catch (error) {
    throw error;
  }
};

// You can export all functions as a single object if preferred
export const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  searchProducts,
  getProductsByCategory,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
};

export default productService;
