import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function ActionsMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Posicionar menú
  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 60,
      });
    }
  }, [open]);

  // Cerrar al hacer click afuera
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Opción rápida: abrir modal directamente sin menú:
  // return <button onClick={onEdit} className="p-2 text-blue-600">Editar</button>;

  return (
    <>
      <button
        ref={btnRef}
        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        type="button"
        aria-label="Acciones"
        title="Acciones"
      >
        •••
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
              minWidth: 160,
            }}
            className="bg-white border border-gray-200 rounded-md shadow-lg py-1 text-sm animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700"
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
            >
              Editar
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
            >
              Eliminar
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

export default ActionsMenu;
