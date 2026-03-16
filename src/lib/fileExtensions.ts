const getMimeTypes = (fileTypes: string): string => {
    // If the input is '*', return it directly.
    if (fileTypes === '*') {
        return fileTypes;
    }

    // Split the input string into an array of accepted type keys.
    const acceptedTypeKeys = fileTypes.split(',');

    // Define the mapping from type keys to MIME type arrays.
    const mimeTypes: Record<string, string[]> = {
        word: [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        excel: [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        powerpoint: [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        pdf: [
            'application/pdf'
        ],
        image: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/bmp',
            'image/webp',
            'image/tiff',
            'image/svg+xml'
        ],
        video: [
            'video/mp4',
            'video/mpeg',
            'video/ogg',
            'video/quicktime',
            'video/webm',
            'video/x-ms-wmv',
            'video/x-flv',
            'video/3gpp'
        ],
        rar: [
            'application/x-rar-compressed',
            'application/x-rar',
            'application/vnd.rar',
            'application/rar',
        ],
        zip: [
            'application/x-zip-compressed',
            'application/x-zip',
            'application/zip',
            'application/x-zip-compressed-sfx',
        ]
    };

    // Map over the requested type keys.
    // If a key is found in the mimeTypes map, return its corresponding MIME types joined by a comma.
    // If a key is not found, return the original key string (allowing custom or direct MIME types).
    return acceptedTypeKeys.map((typeKey) => {
        const lowerCaseTypeKey = typeKey.toLowerCase();
        const correspondingMimeTypes = mimeTypes[lowerCaseTypeKey];

        if (correspondingMimeTypes) {
            return correspondingMimeTypes.join(',');
        }
        // If the key isn't found in our map, return the original key
        return typeKey;
    }).join(','); // Join the results of the map operation with commas.
};

export default getMimeTypes;