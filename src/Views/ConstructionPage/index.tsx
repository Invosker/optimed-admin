import Construction from '@/icons/construction';
import { Link } from 'react-router-dom';

const UnderConstructionPage = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
                <Construction />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    En construción
                </h1>
                <p className="text-lg md:text-xl text-gray-600 text-center mb-8">
                    Estamos trabajando en esta funcionalidad, por favor, intente
                    nuevamente más tarde.
                </p>
                {/* Optionally, you can add a link back to the homepage */}
                {/* Assuming you are using React Router */}

                <Link
                    to={`${import.meta.env.VITE_BASE_URL}Home`}
                    className="px-4 py-2 text-white bg-sigeBlue rounded hover:bg-blue-700 transition-colors duration-200"
                >
                    Volver a pagina de inicio
                </Link>

                {/* Or a regular anchor tag */}
                {/*
        <a
          href="/"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Homepage
        </a>
        */}
            </div>
        </div>
    );
};

export default UnderConstructionPage;