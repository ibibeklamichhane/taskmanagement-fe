export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  userId?: string;
  data:any
}

export interface RegisterResponse {
  token: string;
  userId: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
