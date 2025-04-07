import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";

import { importStudents } from "../../api/apiStudents";
import { useError } from "../../context/ErrorContext";
import { toast } from "react-toastify";
import Button from '@mui/joy/Button';


interface ImportButtonProps {
    label?: string;
    isLoading: boolean;
    onClick: () => void;
}
function ImportButton({ label = 'Chọn file CSV hoặc XLSX', isLoading, onClick }: ImportButtonProps) {
    return (
        <>
            <Button
                onClick={onClick}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 text-sm rounded-md shadow-sm text-white 
                ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang xử lý...
                    </>
                ) : (
                    <>
                        <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5" />
                        {label}
                    </>
                )}
            </Button>
        </>
    );
}



export function ImportButtonStudent() {
    const [isLoading, setIsLoading] = useState(false);
    const { showError } = useError();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const response = await importStudents(file);
                toast.success(
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <div className="font-bold mb-1">✅ Import thành công!</div>
                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response, null, 2)}</pre>
                    </div>,
                    { autoClose: false }
                );
            } catch (error: any) {
                showError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };
    const onClick = () => {
        fileInputRef.current?.click(); // Triggers file input click
    };

    return (
        <form className="flex items-center space-x-2">
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="hidden"
            />
            <ImportButton label="Chọn file CSV hoặc XLSX" isLoading={isLoading} onClick={onClick} />
        </form>
    )

}



