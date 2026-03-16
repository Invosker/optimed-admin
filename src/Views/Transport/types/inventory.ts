// Asegúrate de que este archivo tenga todos los campos usados por la tabla y el modal.
export interface InventoryItem {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  photoUrl: string;
  category: string;
  subcategory: string | null;
  use: string;
  unitOfMeasure: string;
  batchNumber: string;
  supplier: string;
  manufacturer: string;
  presentation: string;
  composition: string;
  purchasePrice: number;
  salePrice: number;
  tax: number;                // normalizado
  discountPercentage: number;
  mainSupplier: string;
  minimumStock: number;
  stock: number;
  isActive: boolean;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  lowStockThreshold?: number;
}

export interface InventoryQueryParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  status?: "all" | "active" | "inactive";
}

export interface PaginatedInventory {
  docs: InventoryItem[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  _meta?: {
    page_size: number;
    page_number: number;
    total_elements: number;
    total_pages: number;
  };
  _links?: Record<string, string>;
  message?: string;
}

export interface InventoryUpdateRequest {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  photoUrl: string;
  category: string;
  subcategory: string | null;
  use: string;
  unitOfMeasure: string;
  batchNumber: string;
  supplier: string;
  manufacturer: string;
  presentation: string;
  composition: string;
  purchasePrice: string;
  salePrice: string;
  tax: string;
  discountPercentage: number;
  mainSupplier: string;
  minimumStock: number;
  stock: number;
  isActive: boolean;
  categoryId: number;
}

export interface DocPage {
  docs: Doc[]
  page: number
  limit: number
  totalDocs: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  prevPage: number
}

export interface Doc {
  createdBy: number
  updatedBy: number
  createdAt: string
  updatedAt: string
  id: number
  sku: string
  barcode: string
  name: string
  photoUrl: string
  category: string
  subcategory: string
  use: string
  unitOfMeasure: string
  batchNumber: string
  supplier: string
  manufacturer: string
  presentation: string
  composition: string
  purchasePrice: number
  salePrice: number
  tax: number
  discountPercentage: number
  mainSupplier: string
  minimumStock: number
  stock: number
  isActive: boolean
  categoryId: number
  lowStockThreshold?: number
}

export type InventoryEditableFields = Omit<
  InventoryUpdateRequest,
  "purchasePrice" | "salePrice" | "tax" | "discountPercentage"
> & {
  purchasePrice: number;
  salePrice: number;
  tax: number | string;
  discountPercentage: number;
};