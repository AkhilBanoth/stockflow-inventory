import api from "./client";

export interface Product {
  id: number;
  organization_id: number;
  name: string;
  sku: string;
  description: string | null;
  quantity_on_hand: number;
  cost_price: number | null;
  selling_price: number | null;
  low_stock_threshold: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
  description?: string | null;
  quantity_on_hand: number;
  cost_price?: number | null;
  selling_price?: number | null;
  low_stock_threshold?: number | null;
}

export const getProducts = async (search = "") => {
  const response = await api.get<Product[]>("/products/", {
    params: search ? { search } : {},
  });

  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductCreate) => {
  const response = await api.post<Product>("/products/", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<ProductCreate>
) => {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  await api.delete(`/products/${id}`);
};

export const updateStock = async (
  id: number,
  quantity: number
) => {
  const response = await api.patch<Product>(
    `/products/${id}/stock`,
    null,
    { params: { quantity } }
  );

  return response.data;
};