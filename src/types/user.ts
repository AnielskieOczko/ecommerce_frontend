import { AddressDTO, PhoneNumberDTO } from './common';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: AddressDTO;
  phoneNumber: PhoneNumberDTO;
  dateOfBirth: string;
  authorities: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  address?: AddressDTO;
  phoneNumber?: PhoneNumberDTO;
  dateOfBirth?: string;
}

export interface UserResponseDTO {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  address: AddressDTO;
  phoneNumber: PhoneNumberDTO;
  dateOfBirth: string;
  authorities: string[];
}