export interface ProductFormValues {
  sku: string;
  barcode: string;
  name: string;
  photo?: string;
  category: string;
  subcategory?: string;
  use?: string;
  unit?: string;
  lotNumber?: string;
  provider?: string;
  manufacturer?: string;
  presentation: string;
  composition?: string;
  purchasePrice: number;
  salePrice: number;
  tax?: number;
  discount?: number;
  mainProvider?: string;
  minStock?: number;
  stock?: number;
  categoryId?: number;
  isActive: boolean;
}

export interface ProductApiPayload {
  sku: string;
  barcode: string;
  name: string;
  photoUrl?: string | null;
  category: string;
  subcategory?: string | null;
  use?: string | null;
  unitOfMeasure?: string | null;
  batchNumber?: string | null;
  supplier?: string | null;
  manufacturer?: string | null;
  presentation: string;
  composition?: string | null;
  purchasePrice: string; // En backend ejemplo viene como string
  salePrice: string; // Igual que arriba
  tax?: string | null;
  discountPercentage?: number;
  mainSupplier?: string | null;
  minimumStock?: number;
  stock?: number;
  categoryId?: number | null;
  isActive?: boolean;
}

export const mapFormToApi = (f: ProductFormValues): ProductApiPayload => {
  return {
    sku: f.sku,
    barcode: f.barcode,
    name: f.name,
    photoUrl: f.photo || null,
    category: f.category,
    subcategory: f.subcategory || null,
    use: f.use || null,
    unitOfMeasure: f.unit || null,
    batchNumber: f.lotNumber || null,
    supplier: f.provider || null,
    manufacturer: f.manufacturer || null,
    presentation: f.presentation,
    composition: f.composition || null,
    purchasePrice: Number(f.purchasePrice).toFixed(2),
    salePrice: Number(f.salePrice).toFixed(2),
    tax: f.tax !== undefined ? String(f.tax) : null,
    discountPercentage: f.discount === undefined ? 0 : f.discount,
    mainSupplier: f.mainProvider || null,
    minimumStock: f.minStock ?? 0,
    stock: f.stock ?? 0,
    categoryId: f.categoryId ?? null,
    isActive: f.isActive,
  };
};
