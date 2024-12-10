

import axiosInstance from './axiosInstance';

export const login = async (credentials: { email: string; password: string }) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data;
};

export const register = async (user: { name: string; email: string; password: string }) => {
  const { data } = await axiosInstance.post('/auth/register', user);
  return data;
};
