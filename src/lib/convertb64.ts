const convertFilesToBase64 = (files: File[]) => {
    const fileArray = Array.from(files);
    const filePromises = fileArray.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    fileName: file.name,
                    base64: reader.result // Remove the "data:<type>;base64," prefix
                });
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    });

    return Promise.all(filePromises);
};

export default convertFilesToBase64;