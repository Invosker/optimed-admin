
import { useRef, useMemo } from 'react';

import getMimeTypes from '@/lib/fileExtensions';
import { VscodeIconsFileTypeExcel } from '@/assets/icons/excel';
import { VscodeIconsFileTypePowerpoint } from '@/assets/icons/powerPoint';
import { VscodeIconsFileTypePdf2 } from '@/assets/icons/pdf';
import { VscodeIconsFileTypeImage } from '@/assets/icons/image';
import { VscodeIconsFileTypeVideo } from '@/assets/icons/video';
import { VscodeIconsFileTypeWord } from '@/assets/icons/word';
import toast from 'react-hot-toast';

const Dropzone = ({ typeFile = 'excel', validateFileName = false, onDrop, files = [], multiple = false, fileName = '' }) => {
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const dropArea = document.querySelector('.border-dashed');
        dropArea.classList.add('border-sigeBlue');
    };

    const handleDragLeave = () => {
        // Update styles if necessary when drag leaves
        const dropArea = document.querySelector('.border-dashed');
        dropArea.classList.remove('border-sigeBlue');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (multiple === false && files.length > 1) {
            toast.error("Sólo un archivo permitido");
            return;
        }
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const specialCharPattern = /[#=*+%_<;,>"'@!~`&:\-?^${}()|[\]\\\s]/g;;
        const validFiles = Array.from(files).filter(file => {
            const isValidType = getMimeTypes(typeFile).includes(file.type);
            const hasSpecialCharacters = validateFileName ? specialCharPattern.test(file.name.substring(0, file.name.lastIndexOf('.'))) : false;
            if (hasSpecialCharacters) {
                alert(`El archivo "${file.name}" contiene caracteres especiales y no será añadido.`);
            }
            if (!isValidType) {
                alert(`El archivo "${file.name}" no es un archivo válido.`);
            }
            return isValidType && !hasSpecialCharacters
        });

        if (validFiles.length > 0) {
            // setSelectedFiles(validFiles);
            if (multiple === false && validFiles.length > 1) {
                toast.error("Sólo un archivo permitido");
                return;
            }
            onDrop(validFiles);
        }
        const dropArea = document.querySelector('.border-dashed');
        dropArea.classList.remove('border-sigeBlue');
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        handleFiles(files);
    };

    const handleFileRemove = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        onDrop(updatedFiles);
    };

    const currentIcon = useMemo(() => {
        switch (typeFile) {
            case 'excel':
                return <VscodeIconsFileTypeExcel />;
            case 'powerpoint':
                return <VscodeIconsFileTypePowerpoint />;
            case 'pdf':
                return <VscodeIconsFileTypePdf2 />;
            case 'image':
                return <VscodeIconsFileTypeImage />;
            case 'video':
                return <VscodeIconsFileTypeVideo />;
            case 'word':
                return <VscodeIconsFileTypeWord />;
            default:
                return <VscodeIconsFileTypeExcel />;
        }
    }, [typeFile]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{`Arrastre ${fileName !== '' ? fileName : multiple ? 'sus archivos' : 'su archivo'} aquí o haga clic ${multiple ? 'para subirlos' : 'para subir un archivo'}`}</h2>
            {/* <p className="mb-6 text-gray-600">Drag and drop your files here or click to upload.</p> */}
            <div
                className="border-4 border-dashed border-primary rounded-lg p-10 cursor-pointer hover:bg-primary hover:bg-opacity-10 transition duration-300"
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={getMimeTypes(typeFile)}
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center">
                    {/* <img src="https://www.tailwindai.dev/placeholder.svg" alt="Dropzone" className="mb-4 w-16 h-16" /> */}
                    {currentIcon}
                    <span className="text-gray-500">Arrastre Aquí</span>
                </div>
            </div>
            <div className="mt-4" id="file-info">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center mt-2">
                        <span>{file.name}</span>
                        <button
                            type='button'
                            className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleFileRemove(index)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dropzone;
