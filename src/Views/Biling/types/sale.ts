export type SaleItem = {
  id?: number | string;
  name: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  subtotal?: number;
  price?: number;
  sku?: string;
};

export type Sale = {
  id: number | string;
  date: string;
  createdAt: string;
  updatedAt: string;
  client?: { id?: number | string; firstName?: string; lastName?: string; email?: string };
  clientName?: string;
  status: string;
  total: number | string;
  currency?: string;
  items?: SaleItem[];
};

export type SalesPage<T = Sale> = {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};
