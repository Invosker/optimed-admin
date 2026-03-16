import { useQueryClient } from "@tanstack/react-query";

interface Role {
  id: number;
  roleName: string;
  permissions: string;
  active: boolean;
}

// Estructura flexible: backend puede devolver { user: {...} } o { admin: {...} }
interface SessionShape {
  access_token: string;
  expires_in: number;
  user?: any;
  admin?: any;
}

const useUser = () => {
  const queryClient = useQueryClient();
  const root = queryClient.getQueryData<SessionShape>(["user"]);

  // root es ApiResponse: { status, message, data: { access_token, user/admin } }
  const session = (root as any)?.data ?? root;

  const account = session?.user ?? session?.admin ?? null;
  const token = session?.access_token ?? import.meta.env.VITE_TOKEN;

  return { user: account, token };
};

export default useUser;
