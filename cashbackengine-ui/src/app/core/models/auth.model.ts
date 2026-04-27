export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fname?: string;
  lname?: string;
  phone?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  username: string;
  role: string;
}

export interface UserProfile {
  userId: number;
  username: string;
  email: string;
  fname?: string;
  lname?: string;
  role: string;
  status: string;
  created: string;
}
