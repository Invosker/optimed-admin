import { useRouteError } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

export default function GlobalErrorBoundary() {
    const error = useRouteError();
    const { handleLogOut } = useAuth();


    const copyError = () => {
        const errorString =
            error instanceof Error
                ? `${error.message}\n${error.stack}`
                : JSON.stringify(error, null, 2);
        navigator.clipboard.writeText(errorString);
        toast.success("Error copiado al portapapeles");
    };


    const goHome = () => {
        handleLogOut();
    };


    console.error("Caught by global error boundary:", error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4 w-screen">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Algo salió mal.
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    Ocurrió un error inesperado en la aplicación.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-left overflow-auto max-h-60 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Detalles del Error:
                    </h2>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                        {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                    </pre>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={copyError}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        Copiar Error
                    </button>
                    <button
                        onClick={goHome}
                        className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
