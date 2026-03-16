export interface CategoryFormValues {
  name: string;
  code: string;
  description?: string;
}

export interface CategoryApiPayload {
  name: string;
  code: string;
  description?: string | null;
}

export const mapCategoryFormToApi = (f: CategoryFormValues): CategoryApiPayload => ({
  name: f.name.trim(),
  code: f.code.trim(),
  description: f.description?.trim() || null,
});