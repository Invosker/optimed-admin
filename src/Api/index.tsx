import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { QueryClient } from "@tanstack/react-query";

class ApiClient {
  private axiosInstance: AxiosInstance;
  private queryClient: QueryClient;

  constructor(client: QueryClient, otherUrl?: string, otherToken?: string) {
    this.queryClient = client;

    this.axiosInstance = axios.create({
      baseURL: otherUrl ?? import.meta.env.VITE_API_URLBASE,
      headers: {
        "Content-Type": "application/json",
      },
      // auth: {  
      //   username: "",
      //   password: "",
      // },
    });

    // Apply the latest token to every request
    this.axiosInstance.interceptors.request.use((config) => {
      const token = otherToken ?? this.queryClient.getQueryData<{ access_token: string }>(["user"])?.access_token;
      //   if (token) {
      config.headers.Authorization = `Bearer ${token ?? import.meta.env.VITE_TOKEN}`;
      // config.headers.Authorization = `Basic ${token ?? import.meta.env.VITE_TOKEN}`;
      // config.auth = {
      //   username: import.meta.env.VITE_TOKEN,
      //   password: "",
      // };
      //   }
      return config;
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  async patch<T>(url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

}

export default ApiClient;
