// import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ApiClient from "@/Api";

interface Options {
  otherUrl?: string;
  otherToken?: string;
}

export const useApiClient = (opts?: Options) => {
  const qc = useQueryClient();
  const { otherUrl, otherToken } = opts || {};

  // const client = useMemo(() => {
  return new ApiClient(qc, otherUrl, otherToken);
  // }, [qc, otherUrl, otherToken]);

  // return client;
};
