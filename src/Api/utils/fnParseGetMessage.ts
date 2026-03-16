import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export const fnParseGetMessage = (error: AxiosError) => {
  const responseData = (error as AxiosError).response?.data as ApiResponse;
  const detail = responseData?.errors?.[0]?.detail;
  const message = detail?.message;
  //   const internalCode = responseData?.errors?.[0]?.internal_code;
  const detailMessage = Array.isArray(message) ? message[0] : detail?.message;
  const newMessage = `${
    typeof detailMessage === "string" && detailMessage ? detailMessage : "Error"
  }`;

  return newMessage;
};

export default fnParseGetMessage;
