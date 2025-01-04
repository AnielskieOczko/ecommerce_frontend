import api from './api';
import { CategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';
import { PageRequest, PaginatedResponse } from '../types/common';

const CATEGORY_URL_PUBLIC = '/api/v1/public/categories';
const CATEGORY_URL_ADMIN = '/api/v1/admin/categories';

export const getAllCategories = async (params: PageRequest) => {
  try {
    const response = await api.get<PaginatedResponse<CategoryDTO>>('/api/v1/admin/categories', {
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
    const response = await api.get<CategoryDTO>(`${CATEGORY_URL_PUBLIC}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ADMIN methods
export const createCategory = async (category: CreateCategoryDTO): Promise<CategoryDTO> => {
  try {
    const response = await api.post<CategoryDTO>(CATEGORY_URL_ADMIN, category);
    console.log(response.data);
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
    const response = await api.put<CategoryDTO>(`${CATEGORY_URL_ADMIN}/${id}`, category);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`${CATEGORY_URL_ADMIN}/${id}`);
  } catch (error) {
    throw error;
  }
};

// You can export all functions as a single object if preferred
export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
