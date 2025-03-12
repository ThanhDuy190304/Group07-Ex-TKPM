import { useState, useReducer, useRef, useEffect, useCallback, memo } from "react";
import {
    MagnifyingGlassIcon, ListBulletIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon
} from "@heroicons/react/24/outline";
import Select from 'react-select'
import students from "../data/students";
import { validateEmail, validatePhone, validateBirthdate } from "../utils/validators";
import { useError } from "../utils/ErrorContext";
import { Tooltip } from 'react-tooltip';
/**
 * @typedef {Object} Student
 * @property {string} id - Mã số sinh viên (MSSV)
 * @property {string} name - Họ và tên đầy đủ
 * @property {string} birthdate - Ngày sinh (YYYY-MM-DD)
 * @property {string} sex - Giới tính ("Nam", "Nữ", "Khác")
 * @property {string} faculty - Khoa của sinh viên
 *     (Giá trị hợp lệ: "Khoa Luật", "Khoa Tiếng Anh thương mại", "Khoa Tiếng Nhật", "Khoa Tiếng Pháp")
 * @property {string} course - Khóa học (VD: "K16", "K17", ...)
 * @property {string} program - Chương trình đào tạo (VD: "Đại học", "Cao đẳng", "Thạc sĩ", ...)
 * @property {string} address - Địa chỉ sinh viên
 * @property {string} email - Email sinh viên
 * @property {string} phone - Số điện thoại sinh viên
 * @property {string} status - Trạng thái học tập
 *     (Giá trị hợp lệ: "Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học")
 */
const studentFields = {
    id: "MSSV",
    name: "Họ tên",
    birthdate: "Ngày sinh",
    sex: "Giới tính",
    faculty: "Khoa",
    course: "Khóa",
    program: "Chương trình",
    address: "Địa chỉ",
    email: "Email",
    phone: "SĐT",
    status: "Tình trạng",
};

const FACULTIES = [
    "Khoa Luật",
    "Khoa Tiếng Anh thương mại",
    "Khoa Tiếng Nhật",
    "Khoa Tiếng Pháp",
];
const STUDENT_STATUSES = [
    "Đang học",
    "Đã tốt nghiệp",
    "Đã thôi học",
    "Tạm dừng học",
];
const SEXS = ["Nam", "Nữ"];

// Hàm tìm kiếm sinh viên
function Search() {
    const [searchField, setSearchField] = useState({ value: "id", label: "MSSV" });
    const searchInput = useRef(null);
    const handleSearchFieldChange = (selectedOption) => {
        setSearchField(selectedOption);
    };
    const handleSearch = () => {
        const searchValue = searchInput.current.value; // Lấy giá trị input
        console.log("Tìm kiếm theo:", searchField.value, "Giá trị:", searchValue);
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
    const options = Object.entries(studentFields)
        .filter(([key]) => key === "id" || key === "name") // Chỉ lấy id và name
        .map(([key, label]) => ({
            value: key,
            label: label,
        }));

    return (
        <div className="flex flex-row rounded-sm">
            {/* Select a field */}
            <div className="flex flex-row items-center text-sm px-2 bg-gray-300 gap-2 border rounded-l-sm">
                <ListBulletIcon className="w-5 h-5 text-black" />
                <Select
                    options={options}
                    value={searchField}
                    onChange={handleSearchFieldChange}
                    isSearchable={false}
                    classNames={{
                        control: () => "!border-none !shadow-none !bg-transparent !cursor-pointer !w-32",
                        option: () => "!text-gray-700 hover:!bg-gray-100",
                        menu: () => "!mt-2",
                        placeholder: () => "!text-gray-400",
                        singleValue: () => "!text-black-700",
                        dropdownIndicator: () => "!text-slate-500"
                    }}
                    styles={{
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? "#e2e8f0" : "white", // Màu nền khi được chọn
                            color: state.isSelected ? "black" : "black", // Màu chữ khi được chọn
                            "&:hover": {
                                backgroundColor: "#f3f4f6",
                            },
                        }),
                    }}
                />
            </div>
            {/* Search input */}
            <div className="flex items-center p-2 bg-white rounded-r-sm border w-96">
                <input
                    ref={searchInput}
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full bg-transparent focus:outline-none"
                    onKeyDown={handleKeyDown}
                />
                <MagnifyingGlassIcon onClick={handleSearch} className="w-5 h-5 text-gray-400 hover:text-gray-500 cursor-pointer" />
            </div>
        </div>
    );
}

/**
 * Hàm để tạo sinh viên mới
 * @param {Student} newStudent - Thông tin sinh viên mới cần thêm
 */
function createAStudent(newStudent) {
    console.log("Lưu thông tin sinh viên", newStudent);
}

const TextInput = memo(({ name, value, onChange, onBlur, placeholder }) => {
    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="border p-2 rounded w-full"
        />
    );
});

const DateInput = memo(({ name, value, onChange, onBlur, placeholder }) => {
    return (
        <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="border p-2 rounded w-1/2"
        />
    );
});

const SelectInput = memo(({ name, value, onChange, options, placeholder }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="border p-2 rounded w-full"
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
});

const CreateAStudent_Button = () => {
    const { showError } = useError();

    const [errors, setErrors] = useState({});
    useEffect(() => {
        Object.entries(errors).forEach(([field, errorMessage]) => {
            if (errorMessage) {
                showError(errorMessage);
            }
        });
    }, [errors]);

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    function createNewStudent(state, action) {
        switch (action.type) {
            case "CHANGE":
                return { ...state, [action.field]: action.value };
            case "VALIDATE":
                let errorMessage = "";
                if (action.field === "email") {
                    errorMessage = validateEmail(action.value);
                } else if (action.field === "phone") {
                    errorMessage = validatePhone(action.value);
                } else if (action.field === "birthdate") {
                    errorMessage = validateBirthdate(action.value);
                }
                // Lưu lỗi vào state errors
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [action.field]: errorMessage,
                }));
                return state;
            default:
                return state;
        }
    }
    const initialStudent = {
        id: "", name: "", birthdate: "", sex: "", faculty: "", course: "", program: "", address: "", phone: "", status: "", email: ""
    };
    const [student, studentDispatch] = useReducer(createNewStudent, initialStudent);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        studentDispatch({ type: "CHANGE", field: name, value });
    }, []);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        studentDispatch({ type: "VALIDATE", field: name, value });
    }, []);

    function validateStudentInfo(student) {
        const missingFields = [];
        // Kiểm tra từng trường trong studentFields
        for (const [field, displayName] of Object.entries(studentFields)) {
            if (field !== 'id' && !student[field]) { // Kiểm tra nếu trường không phải 'id' và giá trị là empty
                missingFields.push(displayName); // Thêm tên trường thiếu vào mảng
            }
        }
        // Nếu có trường thiếu, hiển thị thông báo lỗi
        if (missingFields.length > 0) {
            const errorMessage = `Vui lòng nhập đầy đủ thông tin: ${missingFields.join(", ")}`;
            showError(errorMessage);
            return false;
        }
        return true; // Tất cả thông tin đầy đủ
    }
    const handleSave = () => {
        if (!validateStudentInfo(student)) return;
        createAStudent(student);
        closeModal();
    };

    return (
        <>
            <button onClick={openModal} className="px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md">
                Thêm 1 sinh viên
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white border-6 border-double border-green-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm sinh viên</h2>
                        <div className="flex flex-col gap-3">
                            <TextInput name="name" value={student.name} onChange={handleChange} placeholder={studentFields.name} />
                            <div className="flex gap-2">
                                <DateInput name="birthdate" value={student.birthdate} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.birthdate} />
                                <SelectInput name="sex" value={student.sex} onChange={handleChange} options={SEXS} placeholder="Chọn giới tính" />
                            </div>
                            <div className="flex gap-2">
                                <SelectInput name="faculty" value={student.faculty} onChange={handleChange} options={FACULTIES} placeholder="Chọn khoa" />
                                <TextInput name="course" value={student.course} onChange={handleChange} placeholder={studentFields.course} />
                            </div>
                            <TextInput name="program" value={student.program} onChange={handleChange} placeholder={studentFields.program} />
                            <div className="flex flex-col gap-2">
                                <TextInput name="address" value={student.address} onChange={handleChange} placeholder={studentFields.address} />
                                <div className="flex gap-2">
                                    <TextInput name="email" value={student.email} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.email} />
                                    <TextInput name="phone" value={student.phone} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.phone} />
                                </div>
                            </div>
                            <SelectInput name="status" value={student.status} onChange={handleChange} options={STUDENT_STATUSES} placeholder="Chọn tình trạng" />
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md cursor-pointer">
                                Đóng
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md cursor-pointer">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

function Pagination({ totalPages, currentPage, onPageChange }) {
    const visiblePages = 5; // Số trang hiển thị trước & sau trang hiện tại
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-2">
            <ChevronDoubleLeftIcon
                onClick={() => onPageChange(1)}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />
            <ChevronLeftIcon
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />
            {pages.map((page) => (
                <div
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 text-sm rounded-full cursor-pointer select-none ${page === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}`}
                >
                    {page}
                </div>
            ))}
            <ChevronRightIcon
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />
            <ChevronDoubleRightIcon
                onClick={() => onPageChange(totalPages)}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />
        </div>
    );
}

function deleteStudent(id) {
    console.log("Xóa sinh viên có mã số", id);
}

function editStudent(student) {
    console.log("Lưu thông tin sinh viên", student);
    return true;
}

function StudentList() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;
    const handlePageChange = (page) => {
        console.log("Chuyển đến trang", page);
        setCurrentPage(page); // Cập nhật state
    };
    const { showError } = useError();

    const columns = [
        { key: "id", label: studentFields.id, width: "w-16" },
        { key: "name", label: studentFields.name, width: "w-24" },
        { key: "birthdate", label: studentFields.birthdate, width: "w-28" },
        { key: "sex", label: studentFields.sex, width: "w-20" },
        { key: "faculty", label: studentFields.faculty, width: "w-36" },
        { key: "course", label: studentFields.course, width: "w-12" },
        { key: "program", label: studentFields.program, width: "w-24" },
        { key: "address", label: studentFields.address, width: "w-40" },
        { key: "email", label: studentFields.email, width: "w-40" },
        { key: "phone", label: studentFields.phone, width: "w-28" },
        { key: "status", label: studentFields.status, width: "w-24" },
        { key: "action", label: "", width: "w-20" },
    ];

    function editStudentReducer(state, action) {
        switch (action.type) {
            case "START_EDIT":
                return { ...action.data }; // Gán trực tiếp student     vào state
            case "EDIT_FIELD":
                return { ...state, [action.field]: action.value }; // Gán giá trị mới vào field
            default:
                return state;
        }
    }
    const [editStudentState, updateStudentState] = useReducer(editStudentReducer, {});
    const [checkEditingRow, setCheckEditingRow] = useState(null);

    const startEdit = (student) => {
        setCheckEditingRow(student.id);
        updateStudentState({ type: "START_EDIT", data: student });
    };

    const handleEditChange = (field, value) => {
        updateStudentState({ type: "EDIT_FIELD", field, value });
    };

    const saveEdit = () => {
        let emailError = validateEmail(editStudentState.email);
        let phoneError = validatePhone(editStudentState.phone);
        let birthdateError = validateBirthdate(editStudentState.birthdate);
        if (emailError) {
            showError(emailError);
            return;
        }
        if (phoneError) {
            showError(phoneError);
            return;
        }
        if (birthdateError) {
            showError(birthdateError);
            return;
        }
        editStudent(editStudentState);
        setCheckEditingRow(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-fixed bg-white border border-gray-300">
                <thead className="bg-gray-200 text-xs font-bold">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={`${col.width} box-border px-2 py-2 text-left whitespace-pre-line`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index} className="bg-white hover:bg-gray-100 text-xs">
                            {columns.map((col) => (
                                <td key={col.key} className={`px-2 py-2 text-left whitespace-pre-line ${col.width} box-border`}>
                                    {col.key === "action" ? (
                                        <div className="flex gap-2">
                                            {checkEditingRow === null ? (
                                                <PencilSquareIcon
                                                    onClick={() => startEdit(student)}
                                                    className="w-5 h-5 text-blue-500 cursor-pointer"
                                                />
                                            ) : checkEditingRow === student.id ? (
                                                <CheckIcon
                                                    onClick={() => saveEdit()}
                                                    className="w-5 h-5 text-green-500 cursor-pointer"
                                                />
                                            ) : (
                                                <div >
                                                    <PencilSquareIcon
                                                        id="edit-icon" // Đặt id cho PencilSquareIcon
                                                        className="w-5 h-5 text-gray-400 cursor-not-allowed  focus:outline-none"
                                                    />
                                                    {/* Tooltip sẽ gắn vào icon có id="edit-icon" */}
                                                    <Tooltip className="" anchorSelect="#edit-icon" content="Vui lòng hoàn thành chỉnh sửa trước" />
                                                </div>
                                            )}
                                            <TrashIcon onClick={() => deleteStudent(student.id)} className="w-5 h-5 text-red-500 cursor-pointer" />
                                        </div>
                                    ) : checkEditingRow === student.id ? (
                                        col.key === "sex" ? (
                                            // Chọn giới tính
                                            <select
                                                value={editStudentState[col.key] || ""}
                                                onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                            >
                                                {SEXS.map((sex) => (
                                                    <option key={sex} value={sex}>
                                                        {sex}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : col.key === "birthdate" ? (
                                            // Chọn ngày sinh
                                            <input
                                                type="date"
                                                value={editStudentState[col.key] || ""}
                                                onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                            />
                                        ) : col.key === "faculty" ? (
                                            // Chọn Khoa
                                            <select
                                                value={editStudentState[col.key] || ""}
                                                onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                            >
                                                {FACULTIES.map((faculty) => (
                                                    <option key={faculty} value={faculty}>
                                                        {faculty}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : col.key === "status" ? (
                                            // Chọn tình trạng sinh viên
                                            <select
                                                value={editStudentState[col.key] || ""}
                                                onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                            >
                                                {STUDENT_STATUSES.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            // Các trường khác vẫn dùng input bình thường
                                            <input
                                                type="text"
                                                value={editStudentState[col.key] || ""}
                                                onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                                readOnly={col.key === "id"}
                                            />
                                        )
                                    ) : (
                                        student[col.key]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mx-auto w-fit mt-4">
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}

function Student() {
    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold">
                Quản lý sinh viên
            </h2>
            <div className="flex flex-row mt-4 justify-between">
                <Search />
                <CreateAStudent_Button />
            </div>
            <div className="mt-6" >
                <StudentList />
            </div>
        </div>
    );
}


export default Student;
