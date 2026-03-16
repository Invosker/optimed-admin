// Common date range parameters
export interface DateRangeParams {
  from?: string; // ISO date string
  to?: string; // ISO date string
}

// Payment stats by type response
export interface PaymentStatByType {
  type: string;
  count: number;
  total: number;
}

export type PaymentStatsByTypeResponse = PaymentStatByType[];

// Payment stats by origin response
export interface PaymentStatByOrigin {
  origin: string;
  count: number;
  total: number;
}

export type PaymentStatsByOriginResponse = PaymentStatByOrigin[];

// Payment stats by date response
export interface PaymentStatByDate {
  date: string;
  count: number;
  total: number;
}

export type PaymentStatsByDateResponse = PaymentStatByDate[];

// Payment stats by date range response
export interface PaymentStatByDateRange {
  date: string;
  count: number;
  total: number;
}

export type PaymentStatsByDateRangeResponse = PaymentStatByDateRange[];

// Payment stats sum by type response
export interface PaymentStatSumByType {
  type: string;
  sum: number;
}

export type PaymentStatsSumByTypeResponse = PaymentStatSumByType[];

// Payment stats by month response
export interface PaymentStatByMonth {
  month: string; // e.g., "2024-01"
  count: number;
  total: number;
}

export type PaymentStatsByMonthResponse = PaymentStatByMonth[];

// Payment stats by year response
export interface PaymentStatByYear {
  year: string; // e.g., "2024"
  count: number;
  total: number;
}

export type PaymentStatsByYearResponse = PaymentStatByYear[];
