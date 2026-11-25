import api from "./client";
import type { Product } from "./products";

export interface DashboardSummary {
  total_products: number;
  total_quantity: number;
  low_stock_count: number;
  low_stock_products: Product[];
}

export const getDashboardSummary = async () => {
  const response = await api.get<DashboardSummary>(
    "/dashboard/summary"
  );

  return response.data;
};