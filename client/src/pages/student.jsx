import { useState, useReducer, useRef, useEffect, useCallback, memo } from "react";
import {
    MagnifyingGlassIcon, ListBulletIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import Select from 'react-select'
import { getStudents, putStudent, deleteStudent, postStudent } from "../api/useStudents";
import { getFaculties } from "../api/useFalcuties";
import { getPrograms } from "../api/usePrograms";
import { getCourses } from "../api/useCoures";

import { validateEmail, validatePhone, validateBirthdate } from "../utils/validators";
import { useError } from "../utils/ErrorContext";
import { Tooltip } from 'react-tooltip';
import lodash from "lodash";


/**
 * @typedef {Object} Student
 * @property {string} studentId - Mã số sinh viên (MSSV)
 * @property {string} fullName - Họ và tên đầy đủ
 * @property {Date} dateOfBirth - Ngày sinh (YYYY-MM-DD)
 * @property {string} gender - Giới tính ("Nam", "Nữ", "Khác")
 * @property {string} facultyId - Khoa của sinh viên
 * @property {string} courseId - Khóa học (VD: "K16", "K17", ...)
 * @property {string} programId - Chương trình đào tạo (VD: "Đại học", "Cao đẳng", "Thạc sĩ", ...)
 * @property {string} address - Địa chỉ sinh viên
 * @property {string} email - Email sinh viên
 * @property {string} phoneNumber - Số điện thoại sinh viên
 * @property {string} status - Trạng thái học tập
 *     (Giá trị hợp lệ: "Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học")
 */

/**
 * @typedef {Object} Faculty
 * @property {number} facultyId - Mã khoa
 * @property {string} name - Tên khoa
 */

/**
 * @typedef {Object} Program
 * @property {number} programId - Mã chương trình
 * @property {string} name - Tên chương trình
 * @property {string} short_name - Tên viết tắt
 */


const studentFields = {
    studentId: "MSSV",
    fullName: "Họ tên",
    dateOfBirth: "Ngày sinh",
    gender: "Giới tính",
    facultyId: "Khoa",
    courseId: "Khóa",
    programId: "Chương trình",
    address: "Địa chỉ",
    email: "Email",
    phoneNumber: "SĐT",
    status: "Tình trạng",
};

const STUDENT_STATUSES = [
    "Đang học",
    "Đã tốt nghiệp",
    "Đã thôi học",
    "Tạm dừng học",
];
const GENDERS = ["Nam", "Nữ", "Khác"];

// Hàm tìm kiếm sinh viên
function Search({ setSearchQuery }) {
    const [searchField, setSearchField] = useState({ value: "studentId", label: "MSSV" });
    const searchInput = useRef(null);
    const handleSearchFieldChange = (selectedOption) => {
        setSearchField(selectedOption);
    };
    const handleSearch = () => {
        const searchValue = searchInput.current.value.trim();
        if (!searchValue) return;
        console.log("Tìm kiếm theo:", searchField.value, "Giá trị:", searchValue);
        setSearchQuery((prev) => {
            if (prev[searchField.value] === searchValue) return prev;
            return { [searchField.value]: searchValue };
        });
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };
    const options = Object.entries(studentFields)
        .filter(([key]) => key === "studentId" || key === "fullName") // Chỉ lấy id và name
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
async function createAStudent(newStudent) {
    try {
        console.log("Lưu thông tin sinh viên", newStudent);
        const result = await postStudent(newStudent);
        if (result.error) {
            alert(`❌${result.error}`);
            return false;
        }
        alert(`✅ Thêm sinh viên thành công! ID: ${result.studentId}`);
        return true;
    } catch (error) {
        console.error("Lỗi khi lưu sinh viên:", error);
        return false;
    }
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

const CreateAStudent_Button = ({ faculties, courses, programs }) => {
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
                } else if (action.field === "phoneNumber") {
                    errorMessage = validatePhone(action.value);
                } else if (action.field === "dateOfBirth") {
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
        studentId: "", fullName: "", dateOfBirth: "", gender: "", facultyId: "", courseId: "", programId: "", address: "", phoneNumber: "", status: "", email: ""
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
            if (field !== 'studentId' && !student[field]) { // Kiểm tra nếu trường không phải 'id' và giá trị là empty
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
    const handleSave = async () => {
        if (!validateStudentInfo(student)) return;
        const success = await createAStudent(student);
        if (success) {
            closeModal();
        }
    };
    return (
        <>
            <button onClick={openModal} className="px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded-md cursor-pointer w-40 mt-4">
                Thêm 1 sinh viên
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white border-6 border-double border-green-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Thêm sinh viên</h2>
                        <div className="flex flex-col gap-3">
                            <TextInput name="fullName" value={student.fullName} onChange={handleChange} placeholder={studentFields.fullName} />
                            <div className="flex gap-2">
                                <DateInput name="dateOfBirth" value={student.dateOfBirth} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.dateOfBirth} />
                                <SelectInput name="gender" value={student.gender} onChange={handleChange} options={GENDERS} placeholder="Chọn giới tính" />
                            </div>
                            <div className="flex gap-2">
                                <select className="flex-1 border p-2 rounded" name="facultyId" value={student.facultyId} onChange={handleChange}>
                                    <option value="" className="disabled hidden">Chọn khoa</option>
                                    {faculties.map(faculty => (
                                        <option key={faculty.facultyId} value={faculty.facultyId}>
                                            {faculty.name}
                                        </option>
                                    ))}
                                </select>
                                <select className="flex-2 border p-2 rounded" name="courseId" value={student.courseId} onChange={handleChange}>
                                    <option value="" className="disabled hidden">Chọn khóa học</option>
                                    {courses.map(course => (
                                        <option key={course.courseId} value={course.courseId}>
                                            {course.courseId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <select className="border p-2 rounded" name="programId" value={student.programId} onChange={handleChange}>
                                <option value="" className="disabled hidden">Chọn chương trình học</option>
                                {programs.map(program => (
                                    <option key={program.programId} value={program.programId}>
                                        {program.name}
                                    </option>
                                ))}
                            </select>                            <div className="flex flex-col gap-2">
                                <TextInput name="address" value={student.address} onChange={handleChange} placeholder={studentFields.address} />
                                <div className="flex gap-2">
                                    <TextInput name="email" value={student.email} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.email} />
                                    <TextInput name="phoneNumber" value={student.phoneNumber} onChange={handleChange} onBlur={handleBlur} placeholder={studentFields.phoneNumber} />
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

function Pagination({ total, limit, currentPage, onPageChange }) {

    const totalPages = Math.ceil(total / limit);// Tính số trang dựa trên tổng số phần tử và giới hạn
    const visiblePages = 5; // Số trang hiển thị trước & sau trang hiện tại

    // Tính toán trang bắt đầu và trang kết thúc để hiển thị
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Đảm bảo luôn hiển thị đủ số trang
    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    // Tạo danh sách các trang cần hiển thị
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-2">
            {/* Nút về trang đầu tiên */}
            <ChevronDoubleLeftIcon
                onClick={() => onPageChange(1)}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />

            {/* Nút về trang trước */}
            <ChevronLeftIcon
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />

            {/* Hiển thị các trang */}
            {pages.map((page) => (
                <div
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 text-sm rounded-full cursor-pointer select-none ${page === currentPage ? "bg-black text-white" : "hover:bg-gray-200"}`}
                >
                    {page}
                </div>
            ))}

            {/* Nút đến trang tiếp theo */}
            <ChevronRightIcon
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />

            {/* Nút đến trang cuối cùng */}
            <ChevronDoubleRightIcon
                onClick={() => onPageChange(totalPages)}
                className="w-5 h-5 text-gray-500 cursor-pointer select-none"
            />
        </div>
    );
}

async function editStudent(studentId, updateData) {
    const result = await putStudent(studentId, updateData);
    if (result.error) {
        return false;
    }
    return true;
}

function StudentInf({ student, onClose, facultyMap }) {
    return (
        <div className="relative p-4 min-w-80 bg-white rounded-md shadow-md">
            <XMarkIcon
                onClick={onClose}
                className="absolute top-2 right-2 w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
            />
            <h2 className="text-lg font-bold mb-2">Thông tin sinh viên</h2>
            <div className="grid grid-cols-2 gap-4">
                <div><span className="font-bold">MSSV:</span> <span className="break-words">{student.studentId}</span></div>
                <div><span className="font-bold">Họ tên:</span> <span className="break-words">{student.fullName}</span></div>
                <div><span className="font-bold">Ngày sinh:</span> <span className="break-words">{student.dateOfBirth}</span></div>
                <div><span className="font-bold">Giới tính:</span> <span className="break-words">{student.gender}</span></div>
                <div className="col-span-2"><span className="font-bold">SĐT:</span> <span className="break-words">{student.phoneNumber}</span></div>
                <div className="col-span-2"><span className="font-bold">Địa chỉ:</span> <span className="break-words">{student.address}</span></div>
                <div className="col-span-2"><span className="font-bold">Email:</span> <span className="break-words">{student.email}</span></div>
                <div><span className="font-bold">Khoa:</span> <span className="break-words">{facultyMap[student.facultyId]?.name || "Không xác định"}</span></div>
                <div><span className="font-bold">Khóa:</span> <span className="break-words">{student.courseId}</span></div>
                <div><span className="font-bold">Chương trình:</span> <span className="break-words">{student.programId}</span></div>
                <div><span className="font-bold">Trạng thái:</span> <span className="break-words">{student.status}</span></div>
            </div>


        </div >
    );
}




/**
 * Component hiển thị danh sách sinh viên
 * @param {Object} props - Các props truyền vào component
 * @param {Student[]} pros.students - Danh sách sinh viên
 * @param {Array} props.faculties - Danh sách khoa
 * @param {number} props.faculties[].facultyId - ID của khoa
 * @param {string} props.faculties[].name - Tên khoa
 */
function StudentList({ students, setStudents, faculties, courses, programs }) {
    const { showError } = useError();
    const [showStudentInf, setShowStudentInf] = useState(false);
    const columns = [
        { key: "studentId", label: studentFields.studentId, width: "w-16" },
        { key: "fullName", label: studentFields.fullName, width: "w-24" },
        { key: "facultyId", label: studentFields.facultyId, width: "w-36" },
        { key: "courseId", label: studentFields.courseId, width: "w-12" },
        { key: "programId", label: studentFields.programId, width: "w-24" },
        { key: "status", label: studentFields.status, width: "w-24" },
        { key: "action", label: "", width: "w-20" },
    ];

    function editStudentReducer(state, action) {
        switch (action.type) {
            case "START_EDIT":
                return { ...action.data };
            case "EDIT_FIELD":
                return { ...state, [action.field]: action.value }; // Gán giá trị mới vào field
            default:
                return state;
        }
    }
    const [editStudentState, updateStudentState] = useReducer(editStudentReducer, {});
    const [checkEditingRow, setCheckEditingRow] = useState(null); //Save Editing studentId

    const startEdit = useCallback((student) => {
        setCheckEditingRow(student.studentId);
        updateStudentState({ type: "START_EDIT", data: student });
    }, []);

    const handleEditChange = useCallback((field, value) => {
        updateStudentState({ type: "EDIT_FIELD", field, value });
    }, []);

    const saveEdit = useCallback(async () => {
        let emailError = validateEmail(editStudentState.email);
        let phoneError = validatePhone(editStudentState.phoneNumber);
        let birthdateError = validateBirthdate(editStudentState.dateOfBirth);
        if (emailError) return showError(emailError);
        if (phoneError) return showError(phoneError);
        if (birthdateError) return showError(birthdateError);
        // Gọi hàm editStudent và đợi kết quả
        const { studentId, ...studentData } = editStudentState;  // Loại bỏ studentId
        const updateData = { ...studentData };
        const success = await editStudent(checkEditingRow, updateData);
        if (!success) {
            showError("Update fail!");
        }
        else {
            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.studentId === checkEditingRow ? { ...student, ...editStudentState } : student
                )
            );
        }
        setCheckEditingRow(null);
    }, [checkEditingRow, editStudentState, setStudents, showError]);

    const handleDeleteStudent = useCallback(async (studentId) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
        if (!confirmDelete) return;
        const success = await deleteStudent(studentId);
        if (success) {
            setStudents((prevStudents) => prevStudents.filter((s) => s.studentId !== studentId));
        } else {
            showError("Xóa sinh viên thất bại!");
        }
    }, []);

    students = lodash.orderBy(students, ["studentId"], ["asc"]);
    const facultyMap = lodash.keyBy(faculties, "facultyId");
    const programMap = lodash.keyBy(programs, "programId");
    console.log(programMap);
    return (
        <div className="flex gap-4">
            <div className={`overflow-x-auto ${showStudentInf ? "w-3/5" : "w-full"}`}>
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
                            <tr key={index} className="bg-white hover:bg-gray-100 text-xs cursor-pointer"
                                onClick={() => setShowStudentInf(student)}>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-2 py-2 text-left whitespace-pre-line ${col.width} box-border`}
                                    >
                                        {col.key === "action" ? (
                                            <div className="flex gap-2">
                                                {checkEditingRow === null ? (
                                                    <PencilSquareIcon
                                                        onClick={() => startEdit(student)}
                                                        className="w-5 h-5 text-blue-500 cursor-pointer"
                                                    />
                                                ) : checkEditingRow === student.studentId ? (
                                                    <CheckIcon
                                                        onClick={() => saveEdit()}
                                                        className="w-5 h-5 text-green-500 cursor-pointer"
                                                    />
                                                ) : (
                                                    <div>
                                                        <PencilSquareIcon
                                                            id="edit-icon"
                                                            className="w-5 h-5 text-gray-400 cursor-not-allowed focus:outline-none"
                                                        />
                                                        <Tooltip className="" anchorSelect="#edit-icon" content="Vui lòng hoàn thành chỉnh sửa trước" />
                                                    </div>
                                                )}
                                                {checkEditingRow === null ? (
                                                    <TrashIcon
                                                        onClick={() => handleDeleteStudent(student.studentId)}
                                                        className="w-5 h-5 text-red-500 cursor-pointer"
                                                    />
                                                ) : (
                                                    <div>
                                                        <TrashIcon
                                                            id="delete-icon"
                                                            className="w-5 h-5 text-gray-400 cursor-not-allowed"
                                                        />
                                                        <Tooltip anchorSelect="#delete-icon" content="Vui lòng hoàn thành chỉnh sửa trước" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : checkEditingRow === student.studentId ? (
                                            col.key === "facultyId" ? (
                                                // Chọn Khoa
                                                <select
                                                    value={editStudentState[col.key] || ""}
                                                    onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                    className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                                >
                                                    {faculties.map((faculty) => (
                                                        <option key={faculty.facultyId} value={faculty.facultyId}>
                                                            {faculty.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : col.key === "programId" ? (
                                                // Chọn Chương trình học
                                                <select
                                                    value={editStudentState[col.key] || ""}
                                                    onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                    className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                                >
                                                    {programs.map((program) => (
                                                        <option key={program.programId} value={program.programId}>
                                                            {program.short_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : col.key === "courseId" ? (
                                                // Chọn Khóa học
                                                <select
                                                    value={editStudentState[col.key] || ""}
                                                    onChange={(e) => handleEditChange(col.key, e.target.value)}
                                                    className="border-b border-blue-500 w-full rounded-sm focus:outline-none"
                                                >
                                                    {courses.map((course) => (
                                                        <option key={course.courseId} value={course.courseId}>
                                                            {course.courseId}
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
                                                    readOnly={col.key === "studentId" || col.key === "fullName"}
                                                />
                                            )
                                        ) : col.key === "facultyId" ? (
                                            // Hiển thị facultyName thay vì facultyId
                                            facultyMap[student.facultyId]?.name || "Không xác định"
                                        ) : col.key == "programId" ? (
                                            programMap[student.programId]?.short_name || "Không xác định"
                                        ) : (
                                            student[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Hiển thị StudentInf nếu có sinh viên được chọn */}
            {showStudentInf && (
                <div className="w-2/5 border border-gray-300 p-4 bg-white rounded-md">
                    <StudentInf student={showStudentInf} onClose={() => setShowStudentInf(false)} facultyMap={facultyMap} />
                </div>
            )}
        </div>
    );
}

function Student() {

    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);

    const [students, setStudents] = useState([]);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20; // Maximum students per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching faculties, programs, and courses...");
                const [facultiesData, programsData, coursesData] = await Promise.all([
                    getFaculties(),
                    getPrograms(),
                    getCourses()
                ]);
                setFaculties(facultiesData);
                setPrograms(programsData);
                setCourses(coursesData);
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching students...");
                const data = await getStudents({
                    searchQuery,
                    page: currentPage,
                    limit: limit
                });
                console.log("Dữ liệu từ API:", data);
                setStudents(data.students);
                setTotal(data.total);
            } catch (error) {
                console.error("Lỗi khi fetch students:", error);
            }
        };
        fetchData();
    }, [currentPage, searchQuery]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);
    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Quản lý sinh viên</h2>
            <CreateAStudent_Button
                faculties={faculties}
                courses={courses}
                programs={programs} />
            <div className="flex flex-row mt-4 justify-between">
                <Search setSearchQuery={setSearchQuery} />
            </div>

            <div className="mt-6">
                <StudentList students={students}
                    setStudents={setStudents}
                    faculties={faculties}
                    courses={courses}
                    programs={programs} />
                <div className="mx-auto w-fit mt-4">
                    <Pagination total={total} limit={limit} currentPage={currentPage} onPageChange={handlePageChange} />
                </div>
            </div>

        </div>
    );
}
export default Student;
