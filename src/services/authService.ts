import api from './api';
import { LoginRequest, AuthResponse } from '../types/auth';
import { CreateUserRequest } from '../types/user';

export const authService = {
  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', loginRequest);
    console.log(response.data);
    return response.data;
  },

  register: async (registerRequest: CreateUserRequest): Promise<void> => {
    await api.post('/api/v1/auth/register', registerRequest);
    console.log('register');
  },

  logout: async (): Promise<void> => {
    console.log('logout');
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem('token');
  },
};
