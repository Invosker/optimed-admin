export type ApiResponse = {
  errors: ApiResponseError[];
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export type ApiResponseError = {
  internal_code: string;
  title: string;
  detail: Detail;
};

export type Detail = {
  error: string;
  message: string[];
};
