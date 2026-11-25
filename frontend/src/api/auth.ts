import api from "./client";

export interface SignupData {
  email: string;
  password: string;
  organization_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    organization_id: number;
  };
  organization: {
    id: number;
    name: string;
  };
}

export const signup = async (data: SignupData) => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  localStorage.setItem("stockflow_token", response.data.access_token);

  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  localStorage.setItem("stockflow_token", response.data.access_token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("stockflow_token");
};