import { useState, useEffect, useMemo, useCallback, useContext, createContext, ReactNode } from "react";
import { Control, Controller, useForm, UseFormRegister, UseFormSetValue, FieldPath } from "react-hook-form";
import {
    MagnifyingGlassIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon,
    UserPlusIcon
} from "@heroicons/react/24/outline";
import {
    Table, Sheet, Card, CardContent, Typography, Select, Option, Input, Button,
    Modal, ModalDialog, DialogTitle, DialogContent, FormControl, FormLabel, Checkbox
} from '@mui/joy';

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

import { useAllStudents } from "../hooks/useStudents"
import { useFaculties } from "../hooks/useFaculties";
import { usePrograms } from "../hooks/usePrograms";
import { Student, studentFields } from "../types/student";
import { Faculty } from "../types/faculty";
import { Program } from "../types/program";
import { Address, formatAddress, addressFields } from "../types/address";
import { IdentityDocument, identityDocumentFields, CCCDIdentityDocument, CMNDIdentityDocument, PassportIdentityDocument, formatIdentityDocument } from "../types/identityDocument";
import { Gender, StudentStatus, IdentityDocumentType } from "../types/enum"
import { useError } from "../context/ErrorContext";
import { ImportButtonStudent } from "../components/button/import";
import { ExportButtonStudent } from "../components/button/export";


const StudentContext = createContext<{
    students: Student[];
    total: number;
    page: number;
    limit: number;
    handleDeleteManyStudents: (studentIds: string[]) => Promise<boolean>;
    handleUpdate: (studentId: string, updatedData: Partial<Student>) => Promise<boolean>;
    handleCreate: (newStudent: Partial<Student>) => Promise<boolean>;
    handlePageChange: (newPage: number) => void;
    handleSearch: (query: Partial<Student>) => void;
} | null>(null);

const FacultyContext = createContext<{
    faculties: Faculty[];
} | null>(null);

const ProgramContext = createContext<{
    programs: Program[];
} | null>(null);

const StudentSelectionContext = createContext<{
    selectedStudentIds: string[];
    setSelectedStudentIds: React.Dispatch<React.SetStateAction<string[]>>;
} | null>(null);

function StudentProvider({ children }: { children: ReactNode }) {
    const { showError } = useError();
    const [page, setPage] = useState<number>(1);
    const limit = 30;
    const [searchQuery, setSearchQuery] = useState<Partial<Student>>({});
    const { studentsQuery, updateStudent, removeStudents, createStudent } = useAllStudents({
        ...searchQuery,
        page,
        limit
    });
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const { facultiesQuery } = useFaculties();
    const { programsQuery } = usePrograms();
    // Handlers
    const handleDeleteManyStudents = useCallback(async (studentIds: string[]): Promise<boolean> => {
        try {
            await removeStudents.mutateAsync(studentIds);
            setSelectedStudentIds([]);
            return true; // Clear selection after delete
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [removeStudents]);

    const handleCreate = useCallback(async (newStudent: Partial<Student>): Promise<boolean> => {
        try {
            await createStudent.mutateAsync(newStudent);
            return true;
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [createStudent]);

    const handleUpdate = useCallback(async (studentId: string, updatedData: Partial<Student>): Promise<boolean> => {
        try {
            await updateStudent.mutateAsync({ studentId, updatedData });
            return true;
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [updateStudent]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handleSearch = useCallback((query: Partial<Student>) => {
        setSearchQuery(query);
        setPage(1);
    }, []);

    useEffect(() => {
        setSelectedStudentIds([]);
    }, [studentsQuery.data]);

    const studentContextValue = useMemo(() => ({
        students: studentsQuery.data?.students || [],
        total: studentsQuery.data?.total || 0,
        page,
        limit,
        handleDeleteManyStudents,
        handleCreate,
        handleUpdate,
        handlePageChange,
        handleSearch
    }), [studentsQuery.data]);

    const facultyContextValue = useMemo(() => ({
        faculties: facultiesQuery.data?.faculties || []
    }), [[facultiesQuery.data]]);

    const programContextValue = useMemo(() => ({
        programs: programsQuery.data?.programs || []
    }), [[programsQuery.data]]);


    const selectionValue = useMemo(() => ({
        selectedStudentIds,
        setSelectedStudentIds
    }), [selectedStudentIds]);


    if (studentsQuery.isLoading || facultiesQuery.isLoading || programsQuery.isLoading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (studentsQuery.isError) {
        return <p>{studentsQuery.error.message}</p>
    }
    if (facultiesQuery.isError || programsQuery.isError) {
        return <p>Hệ thống lỗi, vui lòng thử lại sau</p>
    }


    return (
        <StudentContext.Provider value={studentContextValue}>
            <FacultyContext.Provider value={facultyContextValue}>
                <ProgramContext.Provider value={programContextValue}>
                    <StudentSelectionContext.Provider value={selectionValue}>
                        {children}
                    </StudentSelectionContext.Provider>
                </ProgramContext.Provider>
            </FacultyContext.Provider>
        </StudentContext.Provider>
    );
}
// Custom hooks
function useStudentsContext() {
    const context = useContext(StudentContext);
    if (!context) throw new Error('useStudentsContext must be used within StudentProvider');
    return context;
}

function useFacultiesContext() {
    const context = useContext(FacultyContext);
    if (!context) throw new Error('useFacultiesContext must be used within StudentProvider');
    return context;
}

function useProgramsContext() {
    const context = useContext(ProgramContext);
    if (!context) throw new Error('useProgramsContext must be used within StudentProvider');
    return context;
}

function useStudentSelectionContext() {
    const context = useContext(StudentSelectionContext);
    if (!context) throw new Error('useStudentSelectionContext must be used within StudentProvider');
    return context;
}

// Details Student Card
function flattenStudent(student: Student) {
    return {
        ...student,
        temporaryResidenceAddress: formatAddress(student.temporaryResidenceAddress),
        permanentAddress: formatAddress(student.permanentAddress),
        mailAddress: formatAddress(student.mailAddress),
        identityDocuments: student.identityDocuments.map(formatIdentityDocument).join("; "),
    };
}
function StudentDetailsCard({ student, onClose }: { student: Student; onClose: () => void }) {
    const flatStudent = flattenStudent(student);
    return (
        <Card variant="outlined" sx={{ width: 400, p: 2, borderRadius: "md", position: "relative" }}>

            <XMarkIcon
                onClick={onClose}
                className="absolute top-4 right-4 w-6 h-6 z-2 text-gray-500 hover:text-red-500 cursor-pointer"
            />
            <CardContent>
                <Typography component="h5" fontWeight="bold">
                    {student.fullName}
                </Typography>
                <Typography level="body-sm" textColor="neutral.500">
                    {studentFields.studentCode}: {student.studentCode}
                </Typography>
                <div className="mt-4 space-y-2">
                    {Object.entries(studentFields).map(([fieldKey, fieldLabel]) => {
                        if (fieldKey === "studentCode" || fieldKey === "fullName") return null;
                        return (
                            <div
                                key={fieldKey}
                                className="hover:bg-gray-100 p-1 rounded transition-colors" // Hiệu ứng hover
                            >
                                <Typography level="body-md">
                                    <span className="font-semibold">{fieldLabel}:</span> {String(flatStudent[fieldKey as keyof typeof flatStudent])}
                                </Typography>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
// Student Table
interface PaginationProps {
    total: number;
    limit: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}
function Pagination({ total, limit, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(total / limit);
    const visiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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

function StudentTableRow({ student }: { student: Student }) {
    return (
        <>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"> {student.studentCode}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{student.fullName}</td>

            {/* Cột Khoa */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.facultyCode || "Chưa có khoa"}
            </td>
            {/* Cột Chương Trình */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.programCode || "Chưa có chương trình"}
            </td>

            {/* Cột Khoá */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.cohortYear || "Chưa xác nhận khóa"}
            </td>

            {/* Cột Trạng thái */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.status || "Chưa có trạng thái"}
            </td>
        </>
    );
}

function StudentTable() {
    const { students } = useStudentsContext()
    const { selectedStudentIds, setSelectedStudentIds } = useStudentSelectionContext()
    const studentFieldWidths: Partial<Record<keyof Student, string>> = {
        studentCode: "w-24",
        fullName: "w-40",
        facultyCode: "w-20",
        programCode: "w-20",
        cohortYear: "w-16",
        status: "w-24",
    };
    return (
        <div className="flex flex-row gap-2">
            <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
                <Table>
                    <thead>
                        <tr>
                            <th className="w-12">
                                <Checkbox
                                    checked={selectedStudentIds.length === students.length && students.length > 0}
                                    indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < students.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedStudentIds(students.map(student => student.id));
                                        } else {
                                            setSelectedStudentIds([]);
                                        }
                                    }}
                                    slots={{
                                        checkbox: (props) => {
                                            const { ownerState, ...domProps } = props;
                                            return (
                                                <span
                                                    {...domProps}
                                                    className={`relative w-5 h-5 cursor-pointer rounded border flex items-center justify-center transition-all duration-200 ease-in-out
                                                         ${ownerState?.checked
                                                            ? "border-blue-500 bg-blue-500/10"
                                                            : "border-gray-400 hover:border-blue-400"}`}
                                                />
                                            );
                                        },
                                    }} />
                            </th>
                            {Object.keys(studentFieldWidths).map((key) => (
                                <th
                                    key={key}
                                    className={`px-4 py-2 text-left font-semibold select-text ${studentFieldWidths[key as keyof Student]}`}
                                >
                                    {studentFields[key as keyof Student]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="cursor-pointer hover:bg-gray-100" >
                                <td >
                                    <Checkbox
                                        checked={selectedStudentIds.includes(student.id)}
                                        value={student.id}
                                        onChange={(e) => {
                                            setSelectedStudentIds(prev =>
                                                prev.includes(student.id)
                                                    ? prev.filter(id => id !== student.id)
                                                    : [...prev, student.id]
                                            );
                                        }}
                                        slots={{
                                            checkbox: (props) => {
                                                const { ownerState, ...domProps } = props;
                                                return (
                                                    <span
                                                        {...domProps}
                                                        className={`relative w-5 h-5 cursor-pointer rounded border flex items-center justify-center transition-all duration-200 ease-in-out
                                                         ${ownerState?.checked
                                                                ? "border-blue-500 bg-blue-500/10"
                                                                : "border-gray-400 hover:border-blue-400"}`}
                                                    />
                                                );
                                            },
                                        }} />
                                </td>
                                <StudentTableRow student={student} />
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet >
        </div >

    );

}

//Search
function Search() {
    const { faculties } = useFacultiesContext();
    const { programs } = useProgramsContext();
    const { handleSearch } = useStudentsContext();
    const [isOpen, setIsOpen] = useState(false);
    const [searchType, setSearchType] = useState("studentCode");
    const [queryStudentCode, setQueryStudentCode] = useState("");
    const [queryFullName, setQueryFullName] = useState("");
    const [queryFacultyCode, setQueryFacultyCode] = useState("");
    const [queryCohortYear, setQueryCohortYear] = useState("");
    const [queryProgramCode, setQueryProgramCode] = useState("");

    const onSearch = () => {
        let query = {};
        if (searchType === "studentCode") {
            query = { studentCode: queryStudentCode };
        } else {
            query = {
                fullName: queryFullName.trim(),
                facultyCode: queryFacultyCode,
                cohortYear: queryCohortYear.trim(),
                programCode: queryProgramCode,
            };
        }
        handleSearch(query);
    };

    const SelectWithClear = ({ value, onChange, options, placeholder = "Chọn" }: {
        value: string;
        onChange: (value: string) => void;
        options: { code: string; name: string }[];
        placeholder?: string;
    }) => (
        <div className="relative">
            <Select
                value={value}
                onChange={(_, newValue) => onChange(newValue as string)}
                className="w-full h-8 px-2 border rounded"
                placeholder={placeholder}
            >
                {options.map((option) => (
                    <Option key={option.code} value={option.code}>
                        {option.code}
                    </Option>
                ))}
            </Select>
            {value && (
                <XMarkIcon
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange("");
                    }}
                />
            )}
        </div>
    );

    return (
        <div className="relative">
            <MagnifyingGlassIcon
                onClick={() => setIsOpen(!isOpen)}
                className="box-content w-5 h-5 p-2 cursor-pointer bg-white border border-black rounded-md"
            />

            {isOpen && (
                <div className="absolute flex flex-col w-96 p-4 bg-white shadow-xl rounded-md border top-12 left-0 z-50">
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="studentCode"
                                checked={searchType === "studentCode"}
                                onChange={() => setSearchType("studentCode")}
                            />
                            Tìm theo MSSV
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="advanced"
                                checked={searchType === "advanced"}
                                onChange={() => setSearchType("advanced")}
                            />
                            Tìm nâng cao
                        </label>
                    </div>

                    {searchType === "studentCode" ? (
                        <input
                            type="text"
                            placeholder={studentFields.studentCode}
                            value={queryStudentCode}
                            onChange={(e) => setQueryStudentCode(e.target.value)}
                            className="w-full h-8 px-2 border rounded mb-2"
                        />
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder={studentFields.fullName}
                                value={queryFullName}
                                onChange={(e) => setQueryFullName(e.target.value)}
                                className="w-full h-8 px-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder={studentFields.cohortYear}
                                value={queryCohortYear}
                                onChange={(e) => setQueryCohortYear(e.target.value)}
                                className="w-full h-8 px-2 border rounded"
                            />
                            <SelectWithClear
                                value={queryFacultyCode}
                                onChange={setQueryFacultyCode}
                                options={faculties.map(f => ({ code: f.facultyCode, name: f.facultyCode }))}
                                placeholder={studentFields.facultyCode}
                            />

                            <SelectWithClear
                                value={queryProgramCode}
                                onChange={setQueryProgramCode}
                                options={programs.map(p => ({ code: p.programCode, name: p.programCode }))}
                                placeholder={studentFields.programCode}
                            />
                        </div>
                    )}

                    <div className="flex justify-end mt-3">
                        <Button onClick={onSearch} size="md">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PhoneInputSelectDropDown({ setPhoneNumber }: { setPhoneNumber: (value: string) => void }) {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <FormControl required>
            <FormLabel>{studentFields.phoneNumber}</FormLabel>
            <PhoneInput
                country={'vn'}
                enableSearch
                containerStyle={{
                    width: "100%",
                    borderRadius: "8px",
                    border: isFocused ? "2px solid #0b6bcb" : "2px solid #CDD7E1",
                    boxShadow: "0 0 4px rgba(21, 21, 21, 0.08)",
                }}
                inputStyle={{
                    width: "100%",
                    height: "32px",
                    fontSize: "16px",
                    border: "none",
                }}
                buttonStyle={{
                    border: "none",
                    backgroundColor: "transparent",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(value) => {
                    if (!value.startsWith('+')) {
                        value = `+${value}`;
                    }
                    setPhoneNumber(value);
                }} />
        </FormControl>
    );
}
//Create Student Form
interface StudentCreateFormProps {
    onCreate: () => void;
    register: UseFormRegister<Partial<Student>>;
    setValue: UseFormSetValue<Partial<Student>>;
    control: Control<Partial<Student>>;
    setIsOpen: (isOpen: boolean) => void;
    isOpen: boolean
}
function StudentCreateForm({ onCreate, register, setValue, control, setIsOpen, isOpen }: StudentCreateFormProps) {
    const { faculties } = useFacultiesContext();
    const { programs } = useProgramsContext();

    const [phoneNumber, setPhoneNumber] = useState<string>();
    useEffect(() => {
        if (phoneNumber) {
            setValue("phoneNumber", phoneNumber);
        }
    }, [phoneNumber, setValue]);

    const identityDocumentTypes = Object.values(IdentityDocumentType);
    const [documentType, setDocumentType] = useState<IdentityDocumentType>(IdentityDocumentType.CCCD);
    const [documentData, setDocumentData] = useState<Partial<IdentityDocument>>({});
    const updateField = (key: string, value: any) => {
        setDocumentData((prev) => ({
            ...prev,
            [key]: value,
            type: documentType,
        }));
        setValue('identityDocuments', [{ ...documentData, type: documentType } as IdentityDocument]);
    };

    const renderCommonFields = () => (
        <>
            <FormControl required>
                <FormLabel>{identityDocumentFields.common.number}</FormLabel>
                <Input value={documentData.number || ""} onChange={(e) => updateField("number", e.target.value)} />
            </FormControl>

            <FormControl required>
                <FormLabel>{identityDocumentFields.common.issueDate}</FormLabel>
                <Input type="date" value={documentData.issueDate || ""} onChange={(e) => updateField("issueDate", e.target.value)} />
            </FormControl>

            <FormControl required>
                <FormLabel>{identityDocumentFields.common.expiryDate}</FormLabel>
                <Input type="date" value={documentData.expiryDate || ""} onChange={(e) => updateField("expiryDate", e.target.value)} />
            </FormControl>

            <FormControl required>
                <FormLabel>{identityDocumentFields.common.placeOfIssue}</FormLabel>
                <Input value={documentData.placeOfIssue || ""} onChange={(e) => updateField("placeOfIssue", e.target.value)} />
            </FormControl>

            <FormControl required>
                <FormLabel>{identityDocumentFields.common.country}</FormLabel>
                <Input value={documentData.country || ""} onChange={(e) => updateField("country", e.target.value)} />
            </FormControl>
        </>
    );

    const renderExtraFields = () => {
        switch (documentType) {
            case IdentityDocumentType.CCCD:
                return (
                    <FormControl>
                        <FormLabel>{identityDocumentFields.cccd.hasChip}</FormLabel>
                        <Checkbox
                            label={identityDocumentFields.cccd.hasChip}
                            variant="outlined"

                            onChange={(e) => updateField("hasChip", e.target.checked)}
                        />
                    </FormControl>
                );
            case IdentityDocumentType.Passport:
                return (
                    <FormControl required>
                        <FormLabel>{identityDocumentFields.passport.notes}</FormLabel>
                        <Input
                            value={(documentData as PassportIdentityDocument).notes || ""}
                            onChange={(e) => updateField("notes", e.target.value)}
                        />
                    </FormControl>
                );
            default:
                return null;
        }
    };

    type StudentAddressPath = FieldPath<Pick<Student, "mailAddress" | "permanentAddress" | "temporaryResidenceAddress">>
    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog>
                <DialogTitle>Tạo sinh viên mới</DialogTitle>
                <DialogContent>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onCreate();
                            }}
                            autoComplete="on"
                        >
                            <p className="text-base mb-2">Điền thông tin cá nhân</p>
                            <div className="m-2 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* MSSV */}
                                <FormControl required>
                                    <FormLabel>{studentFields.studentCode}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("studentCode", { required: true })}
                                    />
                                </FormControl>

                                {/*Họ và tên*/}
                                <FormControl required>
                                    <FormLabel>{studentFields.fullName}</FormLabel>
                                    <Input
                                        type="text"
                                        {...register("fullName", { required: true })}
                                    />
                                </FormControl>

                                {/*Giới tính*/}
                                <Controller
                                    name="gender"
                                    control={control}
                                    defaultValue={Gender.Khac}
                                    render={({ field }) => (
                                        <FormControl required>
                                            <FormLabel>{studentFields.gender}</FormLabel>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onChange={(e, newValue) => field.onChange(newValue)}
                                            >
                                                <Option value={Gender.Nam}>{Gender.Nam}</Option>
                                                <Option value={Gender.Nu}>{Gender.Nu}</Option>
                                                <Option value={Gender.Khac}>{Gender.Khac}</Option>
                                            </Select>
                                        </FormControl>
                                    )}
                                />

                                {/* Ngày sinh */}
                                <FormControl required>
                                    <FormLabel>{studentFields.dateOfBirth}</FormLabel>
                                    <Input
                                        type="date"
                                        {...register("dateOfBirth", { required: true })}
                                    />
                                </FormControl>

                                {/*Email*/}
                                <FormControl required>
                                    <FormLabel>{studentFields.email}</FormLabel>
                                    <Input
                                        type="email"
                                        {...register("email", { required: true })}
                                    />
                                </FormControl>

                                {/* Số điện thoại */}
                                <PhoneInputSelectDropDown setPhoneNumber={setPhoneNumber} />

                                {/*Quốc gia*/}
                                <FormControl required className="sm:col-span-2">
                                    <FormLabel>{studentFields.nationality}</FormLabel>
                                    <Input
                                        type="text"
                                        {...register("nationality", { required: true })}
                                    />
                                </FormControl>

                                {/* Các trường địa chỉ */}
                                {["mailAddress", "temporaryResidenceAddress", "permanentAddress"].map((addressType) => (
                                    <FormControl className="sm:col-span-2" key={addressType}>
                                        <FormLabel>{studentFields[addressType as keyof Student]}</FormLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                                            {Object.entries(addressFields).map(([key, label]) => {
                                                const addressKey = key as keyof Address;
                                                const fieldPath = `${addressType}.${addressKey}` as StudentAddressPath;
                                                return (
                                                    <FormControl required key={fieldPath}>
                                                        <FormLabel>{label}</FormLabel>
                                                        <Input
                                                            type="text"
                                                            {...register(fieldPath, { required: true })}
                                                        />
                                                    </FormControl>
                                                );
                                            })}
                                        </div>
                                    </FormControl>
                                ))}

                                {/*Giấy tờ tùy thân*/}
                                <div className="sm:col-span-2">
                                    <p>Nhập 1 trong 3 loại giấy tờ tùy thân</p>
                                    <Select value={documentType} onChange={(e, val) => {
                                        setDocumentType(val as IdentityDocumentType);
                                        setDocumentData({ type: val as IdentityDocumentType });
                                    }}>
                                        {identityDocumentTypes.map((type) => (
                                            <Option key={type} value={type}>
                                                {type}
                                            </Option>
                                        ))}
                                    </Select>

                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {renderCommonFields()}
                                        {renderExtraFields()}
                                    </div>
                                </div>

                            </div>

                            <p className="text-base mb-2">Điền thông tin học vụ</p>
                            <div className="m-2 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {/* Khoa */}
                                <FormControl required>
                                    <FormLabel>{studentFields.facultyCode}</FormLabel>
                                    <Select
                                        {...register("facultyCode", { required: true })}
                                        onChange={(e, newValue) => setValue("facultyCode", newValue as string)}
                                    >
                                        {faculties.map((faculty) => (
                                            <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                                                {faculty.facultyCode}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Chương trình */}
                                <FormControl required>
                                    <FormLabel>{studentFields.programCode}</FormLabel>
                                    <Select
                                        {...register("programCode", { required: true })}
                                        onChange={(e, newValue) => setValue("programCode", newValue as string)}
                                    >
                                        {programs.map((program) => (
                                            <Option key={program.programCode} value={program.programCode}>
                                                {program.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Khóa học */}
                                <FormControl required>
                                    <FormLabel>{studentFields.cohortYear}</FormLabel>
                                    <Input
                                        type="number"
                                        defaultValue={new Date().getFullYear()}
                                        {...register("cohortYear", {
                                            required: true,
                                            valueAsNumber: true,
                                        })}
                                    />
                                </FormControl>
                            </div>


                            <div className="flex justify-center mt-8">
                                <Button
                                    variant="solid"
                                    color="primary"
                                    type="submit"
                                    className="w-1/2"
                                >
                                    Xác nhận
                                </Button>
                            </div>

                        </form>
                    </div>
                </DialogContent>

            </ModalDialog>
        </Modal>
    );
}
function StudentCreateFormContainer() {
    const { handleCreate } = useStudentsContext();
    const { register, reset, getValues, setValue, control } = useForm<Partial<Student>>();
    const [isOpen, setIsOpen] = useState(false);

    const onCreate = async () => {
        const newStudent: Partial<Student> = {
            studentCode: getValues('studentCode'),
            fullName: getValues('fullName'),
            dateOfBirth: getValues('dateOfBirth'),
            gender: getValues('gender'),
            email: getValues('email'),
            mailAddress: getValues('mailAddress'),
            permanentAddress: getValues('permanentAddress'),
            temporaryResidenceAddress: getValues('temporaryResidenceAddress'),
            phoneNumber: getValues('phoneNumber'),
            nationality: getValues('nationality'),
            facultyCode: getValues('facultyCode') || null,
            programCode: getValues('programCode') || null,
            cohortYear: getValues('cohortYear') || '',
            identityDocuments: getValues('identityDocuments') || [],
        }
        const result = await handleCreate(newStudent);
        if (result) {
            reset();
            setIsOpen(false);
        }
    }
    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<UserPlusIcon className="w-5 h-5" />}
                onClick={() => setIsOpen(true)}
                className="w-fit"
            >
                Tạo sinh viên
            </Button>
            <StudentCreateForm
                register={register}
                setValue={setValue}
                control={control}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                onCreate={onCreate} />
        </>
    );

}

function StudentsRemoveButton({ onRemove }: { onRemove: () => void }) {
    return (
        <Button
            variant="solid"
            color="danger"
            startDecorator={<TrashIcon className="w-5 h-5" />}
            onClick={onRemove}
            className="w-fit "
        >
            Xoá
        </Button>
    );
}

function StudentPage() {
    const { page, limit, total, handlePageChange } = useStudentsContext()
    return (
        <main className="flex flex-col">
            <h2 className="text-2xl font-bold">Quản lý sinh viên</h2>

            <section className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <Search />

                    <StudentCreateFormContainer />
                </div>
                <ImportButtonStudent />
                {/* <ExportButtonStudent searchQuery={searchQuery} /> */}
            </section>

            <section className="flex flex-col gap-6 items-center mt-6">
                <StudentTable />
                <Pagination
                    total={total}
                    limit={limit}
                    currentPage={page}
                    onPageChange={handlePageChange}
                />
            </section>
        </main>
    );
}
function StudentPageContainer() {
    return (
        <StudentProvider>
            <StudentPage />
        </StudentProvider>
    );
}
export default StudentPageContainer;
