export interface SubcategoryFormValues {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  categoryId?: number; // seleccionado desde un select
}

export interface SubcategoryApiPayload {
  name: string;
  description?: string | null;
  code: string;
  isActive: boolean;
  categoryId: number;
}

export const mapSubcategoryFormToApi = (f: SubcategoryFormValues): SubcategoryApiPayload => ({
  name: f.name.trim(),
  description: f.description?.trim() || null,
  code: f.code.trim().toUpperCase(),
  isActive: f.isActive,
  categoryId: Number(f.categoryId),
});