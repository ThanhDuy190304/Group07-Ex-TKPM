import { createContext, useContext, useState, useMemo } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

// Tạo Context
const ErrorContext = createContext();

//Component ToastMessage (Hiển thị lỗi)
function ToastMessage({ message }) {
    return (
        <div className="fixed bottom-4 right-4 bg-white text-black border border-red-500 p-2 rounded-md flex items-center gap-2 shadow-md">
            <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
            <span>{message}</span>
        </div>
    );
}

// Tạo Provider để bọc toàn bộ app
export function ErrorProvider({ children }) {
    const [error, setError] = useState("");
    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(""), 3000); // Tự động ẩn sau 3 giây
    };
    const memoizedChildren = useMemo(() => children, [children]);
    return (
        <ErrorContext.Provider value={{ error, showError }}>
            {memoizedChildren}
            {error && <ToastMessage message={error} />} {/* Hiển thị lỗi nếu có */}
        </ErrorContext.Provider>
    );
}

//Tạo hook để dễ dùng hơn
export function useError() {
    return useContext(ErrorContext);
}

