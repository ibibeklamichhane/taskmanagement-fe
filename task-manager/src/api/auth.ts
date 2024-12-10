import axiosInstance from './axiosInstance';

// Define interfaces for login and registration
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Define return type for login
interface LoginResponse {
  token: string;
  userId?: string;
}

// Define return type for registration
interface RegisterResponse {
  token: string;
  userId: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
  return data;
};

export const register = async (user: RegisterCredentials): Promise<RegisterResponse> => {
  const { data } = await axiosInstance.post<RegisterResponse>('/auth/signup', user);
  return data;
};