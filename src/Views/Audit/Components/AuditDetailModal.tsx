import { createPortal } from "react-dom";
import Button from "@/Components/Button";

interface Props {
  audit: any;
  onClose: () => void;
}

export default function AuditDetailModal({ audit, onClose }: Props) {
  const safeString = (val: any) => {
    try {
      return typeof val === "string" ? val : JSON.stringify(val, null, 2);
    } catch {
      return String(val ?? "");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        <h2 className="text-xl font-bold text-optimed-tiber mb-4">
          Detalle de auditoría
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Acción</p>
            <p className="font-semibold">
              {audit?.process || audit?.action || audit?.event || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Usuario</p>
            <p className="font-semibold">
              {audit?.userName ||
                audit?.user?.name ||
                [audit?.user?.name, audit?.user?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
                audit?.user ||
                "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Fecha</p>
            <p className="font-semibold">
              {audit?.dateReg
                ? new Date(audit.dateReg).toLocaleString()
                : audit?.createdAt
                ? new Date(audit.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Tipo</p>
            <p className="font-semibold">{String(audit?.type ?? "-")}</p>
          </div>
          <div>
            <p className="text-gray-500">ID Auditoría</p>
            <p className="font-semibold">
              {audit?.idAudit || audit?.id || audit?._id || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">IP</p>
            <p className="font-semibold">
              {audit?.ip || audit?.ipAddress || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-500 mb-1">Payload</p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-64 overflow-auto text-xs">
            {safeString(audit)}
          </pre>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button color="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
