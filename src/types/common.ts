export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

export interface ImageDTO {
  id: number;
  path: string;
  altText: string;
  mimeType: string;
}

export interface AddressDTO {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface PhoneNumberDTO {
  value: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
  first: boolean;
  last: boolean;
}

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
  search?: string;
}
