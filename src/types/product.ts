import { ImageDTO } from './common';

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name: string;
}

export interface ProductCreateDTO {
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  quantity: number;
  categoryIds: number[];
  imageList: ImageDTO[];
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: CategoryDTO[];
  imageList: ImageDTO[];
}

export interface ProductUpdateDTO {
  name?: string;
  description?: string;
  price?: number;
  currencyCode?: string;
  quantity?: number;
  categoryIds?: number[];
  imageList?: ImageDTO[];
}