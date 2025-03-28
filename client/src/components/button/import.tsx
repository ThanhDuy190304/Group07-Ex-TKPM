import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import { importStudents } from "../../api/apiStudents"; // Đường dẫn đến file API của bạn
import { toast } from "react-toastify"; // Thư viện thông báo

enum FileType {
    CSV = 'CSV',
}

const FILE_EXTENSIONS = {
    [FileType.CSV]: '.csv',
} as const;

function ImportButton() {
    const [selectedFileType, setSelectedFileType] = useState<FileType>(FileType.CSV);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = FILE_EXTENSIONS[selectedFileType];
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const selectedFile = files[0];

        // Kiểm tra định dạng file
        const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
        if (fileExtension !== FILE_EXTENSIONS[selectedFileType]) {
            toast.error(`Vui lòng chọn file ${selectedFileType}`);
            return;
        }

        setIsLoading(true);
        try {
            const result = await importStudents(selectedFile);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Import ${selectedFileType} file thành công!`);
                // Có thể thêm callback để reload danh sách sinh viên
            }
        } catch (error) {
            toast.error("Lỗi khi import file");
            console.error("Lỗi:", error);
        } finally {
            setIsLoading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="relative inline-block text-left">
            {/* File input ẩn */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="flex items-center space-x-2">
                {/* Dropdown button */}
                <div>
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isLoading}
                    >
                        {selectedFileType}
                        <svg
                            className="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu">
                                {Object.values(FileType).map((type) => (
                                    <button
                                        key={type}
                                        className={`block w-full text-left px-4 py-2 text-sm ${selectedFileType === type
                                            ? 'bg-indigo-100 text-indigo-900'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        onClick={() => {
                                            setSelectedFileType(type);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Import button */}
                <button
                    onClick={handleFileSelect}
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5" />
                            Nhập file
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ImportButton;