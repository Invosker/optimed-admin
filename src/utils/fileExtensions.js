const getMimeTypes = (fileType) => {
    const mimeTypes = {
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
        ]
    };

    return mimeTypes[fileType.toLowerCase()] || [];

};

export default getMimeTypes;