import { useCallback, useRef, useState, type ChangeEvent, type DragEvent, type InputHTMLAttributes } from "react";
import React from "react"; // Import React itself for React.Ref

// --- Type Definitions ---

// Define the structure for files passed in the initialFiles array
// Added name, size, and type as they are used elsewhere when checking state files
interface InitialFile {
    id: string | number; // Initial files might have server-generated IDs
    url: string;       // Initial files need a URL for preview
    name: string;      // Required for duplicate checks and error messages
    size: number;      // Required for duplicate checks and size validation
    type: string;      // Required for type checks in removeFile/cleanup
}

// Define the structure of the file object stored in the hook's state
interface UploadedFile {
    // file can be a browser File object OR the initial file object structure
    file: File | InitialFile;
    id: string | number; // Generated ID or initial ID
    preview: string;    // Object URL or initial URL
}

// Define the shape of the hook's state
interface FileUploadState {
    files: UploadedFile[];
    isDragging: boolean;
    errors: string[];
}

// Define the shape of the options object passed to the hook
interface FileUploadOptions {
    maxFiles?: number; // Use number type, Infinity is a number
    maxSize?: number;  // Use number type, Infinity is a number
    accept?: string;
    multiple?: boolean;
    initialFiles?: InitialFile[];
    onFilesChange?: (files: UploadedFile[]) => void;
    onFilesAdded?: (files: UploadedFile[]) => void; // Callback for newly added files
}

// Define the shape of the actions object returned by the hook
interface FileUploadActions {
    addFiles: (newFiles: FileList | File[] | null | undefined) => void;
    removeFile: (id: string | number) => void;
    clearFiles: () => void;
    clearErrors: () => void;
    handleDragEnter: (e: DragEvent<HTMLElement>) => void;
    handleDragLeave: (e: DragEvent<HTMLElement>) => void;
    handleDragOver: (e: DragEvent<HTMLElement>) => void;
    handleDrop: (e: DragEvent<HTMLElement>) => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    openFileDialog: () => void;
    // Updated return type to include the 'ref' property
    getInputProps: (props?: InputHTMLAttributes<HTMLInputElement>) => InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> };
}

// --- Helper Function ---

/**
 * Formats bytes into a human-readable string.
 * @param bytes The number of bytes.
 * @param decimals The number of decimal places (default 2).
 * @returns A formatted string (e.g., "10.5 KB").
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Use Number.parseFloat to handle potential floating point issues before toFixed
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// --- Hook Definition ---

/**
 * A React hook for managing file uploads, including drag-and-drop and validation.
 * @param options - Configuration options for the hook.
 * @returns A tuple containing the state and an object of action functions.
 */
export const useFileUpload = (options: FileUploadOptions = {}): [FileUploadState, FileUploadActions] => {
    const {
        maxFiles = Infinity,
        maxSize = Infinity,
        accept = "*",
        multiple = false,
        initialFiles = [],
        onFilesChange,
        onFilesAdded,
    } = options;

    const [state, setState] = useState<FileUploadState>({
        files: initialFiles.map((file) => ({
            // Map initial files to UploadedFile structure
            file: file, // Store the initial file object
            id: file.id,
            preview: file.url,
        })),
        isDragging: false,
        errors: [],
    });

    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Validates a file based on size and accepted types.
     * This function is expected to receive a File object from user input (drag/drop or input change).
     * @param file The File object to validate.
     * @returns An error message string if validation fails, otherwise null.
     */
    const validateFile = useCallback((file: File): string | null => {
        // File size check
        if (file.size > maxSize) {
            return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
        }

        // File type/extension check
        if (accept !== "*") {
            const acceptedTypes = accept.split(",").map((type) => type.trim());
            const fileType = file.type || ""; // Use file.type for MIME type
            const fileExtension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`; // Get extension, handle missing extension

            const isAccepted = acceptedTypes.some((type) => {
                if (type.startsWith(".")) {
                    // Check by extension
                    return fileExtension === type.toLowerCase();
                }
                if (type.endsWith("/*")) {
                    // Check by base MIME type (e.g., image/*)
                    const baseType = type.split("/")[0];
                    return fileType.startsWith(`${baseType}/`);
                }
                // Check by full MIME type (e.g., image/jpeg)
                return fileType === type;
            });

            if (!isAccepted) {
                return `File "${file.name}" is not an accepted file type.`;
            }
        }

        // If all checks pass
        return null;
     // ESLint false positive: maxSize and accept are options that can change,
     // so including them as dependencies ensures the validator function updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accept, maxSize]);


    /**
     * Creates a preview URL for a file.
     * Handles both browser File objects and initial file objects.
     * @param file The File or InitialFile object.
     * @returns A string URL for the preview.
     */
    const createPreview = useCallback((file: File | InitialFile): string => {
        if (file instanceof File) {
            // Create object URL for browser File objects
             // Check if file type is suitable for createObjectURL preview
            if (file.type && (file.type.startsWith("image/") || file.type === 'application/pdf' || file.type.startsWith('video/'))) {
                 try {
                     return URL.createObjectURL(file);
                 } catch (error) {
                    console.error("Error creating object URL:", error);
                    return ""; // Return empty string or a placeholder if URL creation fails
                 }
            }
            return ""; // Return empty string for types not suitable for standard previews
        }
        // Return the existing URL for initial files
        return file.url;
    }, []); // Dependencies not strictly needed, as logic relies on input 'file' and built-ins

    /**
     * Generates a unique ID for a file.
     * Handles both browser File objects (generating a new ID) and initial file objects (using existing ID).
     * @param file The File or InitialFile object.
     * @returns A unique ID string or number.
     */
    const generateUniqueId = useCallback((file: File | InitialFile): string | number => {
        if (file instanceof File) {
            // Generate a unique ID based on file properties for browser File objects
            // Added size and lastModified for better uniqueness
            return `${file.name}-${file.size}-${file.lastModified}`;
        }
        // Return the existing ID for initial files
        return file.id;
    }, []); // Dependencies not strictly needed

    /**
     * Clears all files from the state and revokes object URLs.
     */
    const clearFiles = useCallback((): void => {
        setState((prev) => {
            // Clean up object URLs created for previews
            prev.files.forEach((uploadedFile) => {
                // Only revoke URLs for File objects (not initial files) that have a preview URL
                 // Add type check on uploadedFile.file.type
                if (uploadedFile.file instanceof File && uploadedFile.preview && uploadedFile.file.type) {
                     // Optional: Refine this check if you only created previews for specific types in createPreview
                    URL.revokeObjectURL(uploadedFile.preview);
                }
            });

            // Reset the file input element value
            if (inputRef.current) {
                inputRef.current.value = "";
            }

            const newState = {
                ...prev,
                files: [],
                errors: [], // Also clear errors when clearing files
            };

            // Call the optional callback
            onFilesChange?.(newState.files);
            return newState;
        });
    }, [onFilesChange]); // Dependency: onFilesChange callback

    /**
     * Adds new files to the state after validation.
     * @param newFiles - A FileList or array of File objects.
     */
    const addFiles = useCallback((newFiles: FileList | File[] | null | undefined): void => {
        // Ensure newFiles is valid and not empty
        if (!newFiles || newFiles.length === 0) return;

        // Convert FileList to Array if necessary
        const newFilesArray = Array.from(newFiles);
        const currentErrors: string[] = [];

        // Clear existing errors when new files are added
        setState((prev) => ({ ...prev, errors: [] }));

        // Determine the starting files based on 'multiple' option
        let filesToProcess: File[] = [];
        let existingFilesForCheck: UploadedFile[] = state.files; // Use current state files for duplicate/maxFiles check

        if (!multiple) {
             // In single file mode, clear existing files and only process the first new file
            if (state.files.length > 0) {
                 // Clear existing files and revoke URLs *synchronously* within this logic block
                 state.files.forEach(uploadedFile => {
                     if (uploadedFile.file instanceof File && uploadedFile.preview) {
                         URL.revokeObjectURL(uploadedFile.preview);
                     }
                 });
            }
             // We will process only the first file from newFilesArray below
             filesToProcess = newFilesArray.slice(0, 1);
             existingFilesForCheck = []; // No existing files to check against in single mode after conceptual clearing
        } else {
             // In multiple mode, process all new files
             filesToProcess = newFilesArray;
        }


        // Check if adding these files would exceed maxFiles (only in multiple mode)
        if (
            multiple &&
            maxFiles !== Infinity &&
            existingFilesForCheck.length + filesToProcess.length > maxFiles
        ) {
            currentErrors.push(`You can only upload a maximum of ${maxFiles} files.`);
             // Update state with errors and return early
             setState((prev) => ({ ...prev, errors: currentErrors }));
             if (inputRef.current) inputRef.current.value = ""; // Reset input value
            return;
        }

        const validFilesToAdd: UploadedFile[] = [];

        filesToProcess.forEach((file) => {
            // Type guard to ensure 'file' is a File object here, as validate/create/generate expect it
            // This check handles potential non-File objects in the input (though unlikely from drag/drop or input)
            if (!(file instanceof File)) {
                 currentErrors.push(`Invalid item provided: ${typeof file}`);
                 return; // Skip processing this item
            }

            // Check for duplicates among *existing* files in state (using name and size)
             // Now using file.name and file.size which are guaranteed on both File and the updated InitialFile
            const isDuplicate = existingFilesForCheck.some((existingUploadedFile) =>
                existingUploadedFile.file.name === file.name &&
                existingUploadedFile.file.size === file.size
            );

            // Skip duplicate files silently
            if (isDuplicate) {
                return;
            }

            // Validate the file using the memoized validator (which expects a File)
            const validationError = validateFile(file);

            if (validationError) {
                currentErrors.push(validationError);
            } else {
                // File is valid, prepare to add it
                validFilesToAdd.push({
                    file, // Store the actual File object
                    id: generateUniqueId(file), // Generate a new ID (string or number)
                    preview: createPreview(file), // Create a preview URL (string)
                });
            }
        });

         // Only update state if we have valid files to add or new errors occurred
        if (validFilesToAdd.length > 0 || currentErrors.length > 0) {

             // Call the onFilesAdded callback with the newly added valid files *before* updating main state
            if (validFilesToAdd.length > 0) {
                 onFilesAdded?.(validFilesToAdd);
            }

            setState((prev) => {
                // Combine existing files (if multiple) with newly valid files
                const nextFiles = !multiple
                    ? validFilesToAdd // In single mode, replace with the new file(s)
                    : [...prev.files, ...validFilesToAdd]; // In multiple mode, append new files

                // Call the onFilesChange callback with the new total list of files
                onFilesChange?.(nextFiles);

                // Update state with the new files and collected errors
                return {
                    ...prev,
                    files: nextFiles,
                    errors: currentErrors, // Set all collected errors
                };
            });
        }


        // Reset input value after handling files (whether valid or not)
        if (inputRef.current) {
            inputRef.current.value = "";
        }

    }, [
        state.files, // Dependency needed to check duplicates and current file count
        maxFiles,
        multiple,
        // maxSize, // maxSize is used by validateFile, which is a dependency
        validateFile, // Dependency for useCallback
        createPreview, // Dependency for useCallback
        generateUniqueId, // Dependency for useCallback
        onFilesChange, // Dependency for useCallback
        onFilesAdded, // Dependency for useCallback
    ]);


    /**
     * Removes a file from the state based on its ID and revokes its object URL.
     * @param id The ID of the file to remove.
     */
    const removeFile = useCallback((id: string | number): void => {
        setState((prev) => {
            // Find the file to remove
            const fileToRemove = prev.files.find((file) => file.id === id);

            // If found and it's a browser File with a preview, revoke the URL
             // Added check for file.file.type as it's used below
            if (fileToRemove && fileToRemove.file instanceof File && fileToRemove.preview && fileToRemove.file.type) {
                 // Refined check based on common preview types (or remove if revoking all)
                 // if (fileToRemove.file.type.startsWith("image/") || fileToRemove.file.type === 'application/pdf' || fileToRemove.file.type.startsWith('video/')) {
                    URL.revokeObjectURL(fileToRemove.preview);
                 // }
            }

            // Filter out the file to create the new files array
            const newFiles = prev.files.filter((file) => file.id !== id);

            // Call the optional callback with the updated list of files
            onFilesChange?.(newFiles);

            // Update state
            return {
                ...prev,
                files: newFiles,
                errors: [], // Clear errors when a file is removed (optional logic)
            };
        });
    }, [onFilesChange]); // Dependency: onFilesChange callback

    /**
     * Clears all current validation errors.
     */
    const clearErrors = useCallback((): void => {
        setState((prev) => ({
            ...prev,
            errors: [],
        }));
    }, []); // No dependencies

    /**
     * Handles drag enter event.
     * @param e The drag event.
     */
    const handleDragEnter = useCallback((e: DragEvent<HTMLElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setState((prev) => ({ ...prev, isDragging: true }));
    }, []); // No dependencies

    /**
     * Handles drag leave event.
     * Checks if the drag is leaving the element itself or a child element.
     * @param e The drag event.
     */
    const handleDragLeave = useCallback((e: DragEvent<HTMLElement>): void => {
        e.preventDefault();
        e.stopPropagation();

        // Check if the drag is leaving the element or just moving within children
        if (e.currentTarget.contains(e.relatedTarget as Node)) { // Type assertion needed for relatedTarget
            return;
        }

        setState((prev) => ({ ...prev, isDragging: false }));
    }, []); // No dependencies

    /**
     * Handles drag over event (prevents default to allow drop).
     * @param e The drag event.
     */
    const handleDragOver = useCallback((e: DragEvent<HTMLElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        // Optional: Add effectAllowed/dropEffect logic here if needed
        // e.dataTransfer.dropEffect = 'copy';
    }, []); // No dependencies

    /**
     * Handles drop event. Processes dropped files.
     * @param e The drag event.
     */
    const handleDrop = useCallback((e: DragEvent<HTMLElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setState((prev) => ({ ...prev, isDragging: false }));

        // Don't process files if the input element is disabled
        if (inputRef.current?.disabled) {
            return;
        }

        // Get files from the drop event
        const droppedFiles = e.dataTransfer.files;

        if (droppedFiles && droppedFiles.length > 0) {
            if (!multiple) {
                // In single file mode, only add the first file
                const file = droppedFiles[0];
                addFiles([file]); // Pass as an array to match addFiles expected type
            } else {
                // In multiple file mode, add all dropped files
                addFiles(droppedFiles); // Pass FileList directly
            }
        }
    }, [addFiles, multiple, inputRef]); // Dependencies: addFiles, multiple option, inputRef (as it's checked for disabled)

    /**
     * Handles file selection from an input element.
     * @param e The change event from an input element.
     */
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        // Get files from the input change event
        const selectedFiles = e.target.files;

        if (selectedFiles && selectedFiles.length > 0) {
            addFiles(selectedFiles); // Pass FileList directly
        }
         // Note: addFiles already handles resetting e.target.value = ""
    }, [addFiles]); // Dependency: addFiles action

    /**
     * Programmatically triggers the file input dialog.
     */
    const openFileDialog = useCallback((): void => {
        // Trigger click on the hidden file input
        inputRef.current?.click(); // Use optional chaining for nullability
    }, []); // No dependencies

    /**
     * Returns props to spread onto a file input element.
     * Includes necessary input attributes and the ref.
     * @param props - Optional additional props to include.
     * @returns Input element props including the ref.
     */
    const getInputProps = useCallback((props: InputHTMLAttributes<HTMLInputElement> = {}): InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> } => {
        return {
            ...props, // Spread any provided props first
            type: "file", // Ensure type is file
            onChange: handleFileChange, // Set our change handler
            // Use provided accept/multiple props if they exist, otherwise use hook options
            accept: props.accept !== undefined ? props.accept : accept,
            multiple: props.multiple !== undefined ? props.multiple : multiple,
            ref: inputRef, // Assign the ref - Included in the return type
        };
    }, [accept, multiple, handleFileChange, inputRef]); // Dependencies: options, change handler, inputRef

    // Return the state and actions as a tuple
    return [
        state,
        {
            addFiles,
            removeFile,
            clearFiles,
            clearErrors,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            handleFileChange,
            openFileDialog,
            getInputProps,
        },
    ];
};