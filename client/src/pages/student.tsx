import { useState, useEffect, useRef } from "react";
import {
    MagnifyingGlassIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon,
    DocumentArrowDownIcon, DocumentArrowUpIcon, PlusIcon,
} from "@heroicons/react/24/outline";
import {
    Table, Sheet, Card, CardContent, Typography, Select, Option, Input, Button,
    Modal, ModalDialog, DialogTitle, DialogContent, FormControl, Stack, FormLabel
} from '@mui/joy';
import { useAllStudents } from "../hooks/useStudents"
import { useFaculties } from "../hooks/useFaculties";
import { usePrograms } from "../hooks/usePrograms";
import { Student, studentFields } from "../types/student";
import { Faculty } from "../types/faculty";
import { Program } from "../types/program";
import { formatAddress } from "../types/address";
import { identityDocumentFields, CCCDIdentityDocument, CMNDIdentityDocument, PassportIdentityDocument, formatIdentityDocument } from "../types/identityDocument";
import { Gender, StudentStatus, IdentityDocumentType } from "../types/enum"
import { useError } from "../context/ErrorContext";
import ImportButton from "../components/button/import";
import ExportButton from "../components/button/export";
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

interface StudentTableRowProps {
    student: Student;
    isEditing: boolean;
    isAnyEditing: boolean;
    faculties: Faculty[];
    programs: Program[];
    onEdit: () => void;
    onChange: (key: keyof Student, value: string) => void;
    onSave: () => void;
    onDelete: (studentId: string) => void;
    onSelect: () => void;
}
function StudentTableRow({ student, isEditing, isAnyEditing, faculties, programs, onEdit, onChange, onSave, onDelete, onSelect }: StudentTableRowProps) {
    const studentStatusOptions = Object.values(StudentStatus);
    return (
        <tr className="cursor-pointer hover:bg-gray-100" onClick={onSelect}>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"> {student.studentCode}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{student.fullName}</td>

            {/* Cột Khoa */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <Select
                        value={student.facultyCode}
                        onChange={(e, newValue) => onChange("facultyCode", newValue as string)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}

                    >
                        <Option value={null} onClick={(e) => e.stopPropagation()}>
                            -- Không có khoa --</Option>
                        {faculties.map((faculty) => (
                            <Option
                                key={faculty.facultyCode}
                                value={faculty.facultyCode}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {faculty.facultyCode}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    student.facultyCode || "Chưa có khoa"
                )}
            </td>

            {/* Cột Chương Trình */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <Select
                        value={student.programCode}
                        onChange={(e, newValue) => onChange("programCode", newValue as string)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Option value={null} onClick={(e) => e.stopPropagation()}>
                            -- Không có chương trình --</Option>
                        {programs.map((program) => (
                            <Option
                                key={program.programCode}
                                value={program.programCode}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {program.name}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    student.programCode || "Chưa có chương trình"
                )}
            </td>

            {/* Cột Khoá */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <input
                        type="number"
                        value={student.cohortYear || ""}
                        onChange={(e) => onChange("cohortYear", e.target.value)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Nhập năm"
                    />
                ) : (
                    student.cohortYear || "Chưa xác nhận khóa"
                )}
            </td>

            {/* Cột Trạng thái */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <select
                        value={student.status}
                        onChange={(e) => onChange("gender", e.target.value)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {studentStatusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                ) : (
                    student.status || "Chưa có trạng thái"
                )}
            </td>

            {/* Cột Hành Động */}
            <td className="px-4 py-2 ">
                {isEditing ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSave();
                        }}
                        className="p-1 rounded text-green-500 hover:bg-green-100"
                    >
                        <CheckIcon className="w-5 h-5" />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            disabled={isAnyEditing}
                            className={`p-1 rounded text-blue-500 hover:bg-gray-100 ${isAnyEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                }`}
                        >
                            <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(student.id);
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}

interface StudentTableProps {
    students: Student[];
    editingStudent: Student | null;
    isEditingStudentId: string | null;
    faculties: Faculty[];
    programs: Program[];
    onEdit: (student: Student) => void;
    onChange: (key: keyof Student, value: string) => void;
    onSave: () => void;
    onDelete: (studentId: string) => void;
}
function StudentTable({ students, editingStudent, isEditingStudentId, programs, faculties, onEdit, onChange, onSave, onDelete }: StudentTableProps) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
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
                            {Object.keys(studentFieldWidths).map((key) => (
                                <th
                                    key={key}
                                    className={`px-4 py-2 text-left font-semibold select-text ${studentFieldWidths[key as keyof Student]}`}
                                >
                                    {studentFields[key as keyof Student]}
                                </th>
                            ))}
                            <th key="action" className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            const isEditing = isEditingStudentId === student.id;
                            const currentStudent = isEditing ? editingStudent : student;
                            return (
                                <StudentTableRow
                                    key={student.id}
                                    student={currentStudent!}
                                    isEditing={isEditing}
                                    isAnyEditing={!!isEditingStudentId}
                                    faculties={faculties}
                                    programs={programs}
                                    onEdit={() => onEdit(student)}
                                    onChange={onChange}
                                    onSave={onSave}
                                    onDelete={onDelete}
                                    onSelect={() => setSelectedStudent(student)}
                                />
                            );
                        })}
                    </tbody>
                </Table>
            </Sheet >
            {/* Thông tin chi tiết sinh viên */}
            {selectedStudent && (
                <div className="flex-shrink-0">
                    <StudentDetailsCard
                        student={selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                    />
                </div>
            )}
        </div>

    );

}

function StudentTableContainer({
    students,
    faculties,
    programs,
    removeStudent,
    updateStudent,
}: {
    students: Student[];
    faculties: Faculty[];
    programs: Program[];
    removeStudent: (studentId: string) => Promise<void>;
    updateStudent: (data: { studentId: string; updatedData: Partial<Student> }) => Promise<Student>;
}) {
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isEditingStudentId, setIsEditingStudentId] = useState<string | null>(null);
    const { showError } = useError();
    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsEditingStudentId(student.id);
    };

    const handleChange = (key: keyof Student, value: string) => {
        if (editingStudent) {
            setEditingStudent({ ...editingStudent, [key]: value });
        }
    };

    const handleSave = async () => {
        if (editingStudent) {
            try {
                await updateStudent({
                    studentId: isEditingStudentId!,
                    updatedData: editingStudent,
                });
                setEditingStudent(null);
                setIsEditingStudentId(null);
            } catch (error: any) {
                showError(error.message)
            }
        }
    };

    const handleDelete = async (studentId: string) => {
        try {
            await removeStudent(studentId);
        } catch (error: any) {
            showError(error.message)
        }
    };

    return (
        <StudentTable
            students={students}
            faculties={faculties}
            programs={programs}
            editingStudent={editingStudent}
            isEditingStudentId={isEditingStudentId}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
}

//Search
interface SearchProps {
    setSearchQuery: (query: Partial<Student>) => void;
    faculties: Faculty[];
    programs: Program[];
}
function Search({ setSearchQuery, faculties, programs }: SearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchType, setSearchType] = useState("studentCode");
    const [queryStudentCode, setQueryStudentCode] = useState("");
    const [queryFullName, setQueryFullName] = useState("");
    const [queryFacultyCode, setQueryFacultyCode] = useState("");
    const [queryCohortYear, setQueryCohortYear] = useState("");
    const [queryProgramCode, setQueryProgramCode] = useState("");

    const handleSearch = () => {
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
        setSearchQuery(query);
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
                        <Button onClick={handleSearch} size="md">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

//Create Button

interface StudentCreateModalDialogProps {
    onCreate: (newStudent: Partial<Student>) => Promise<Student>;
    faculties: Faculty[];
    programs: Program[];
}
function StudentCreateModalDialog({ onCreate, faculties, programs }: StudentCreateModalDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Student>>({});

    const genderOptions = Object.values(Gender);
    const { showError } = useError();
    const handleChange = (key: keyof Student, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await onCreate(formData);
            setOpen(false);
            setFormData({});
            alert("Sinh viên đã được tạo thành công!")
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<PlusIcon className="w-5 h-5" />}
                onClick={() => setOpen(true)}
                className="w-fit"
            >
                Tạo sinh viên
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Tạo sinh viên mới</DialogTitle>
                    <DialogContent>Điền đủ thông tin dưới đây.</DialogContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* MSSV */}
                            <FormControl>
                                <FormLabel>MSSV</FormLabel>
                                <Input
                                    autoFocus
                                    required
                                    value={formData.studentCode || ""}
                                    onChange={(e) => handleChange("studentCode", e.target.value)}
                                />
                            </FormControl>
                            {/* Họ tên */}
                            <FormControl>
                                <FormLabel>Họ và tên</FormLabel>
                                <Input
                                    autoFocus
                                    required
                                    value={formData.fullName || ""}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                />
                            </FormControl>

                            {/* Ngày sinh */}
                            <FormControl>
                                <FormLabel>Ngày sinh</FormLabel>
                                <Input
                                    type="date"
                                    required
                                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                />
                            </FormControl>

                            {/* Giới tính */}
                            <FormControl>
                                <FormLabel>Giới tính</FormLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e, newValue) => handleChange("gender", newValue as string)}
                                    className="border rounded p-1 w-full"
                                >
                                    {genderOptions.map((gender) => (
                                        <Option key={gender} value={gender}>
                                            {gender}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Email */}
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </FormControl>

                            {/* Số điện thoại */}
                            <FormControl>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input
                                    type="tel"
                                    required
                                    value={formData.phoneNumber || ""}
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                />
                            </FormControl>

                            {/* Khoa */}
                            <FormControl>
                                <FormLabel>Khoa</FormLabel>
                                <Select
                                    value={formData.facultyCode}
                                    onChange={(e, newValue) => handleChange("facultyCode", newValue as string)}
                                    className="border rounded p-1 w-full"
                                >
                                    {faculties.map((faculty) => (
                                        <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                                            {faculty.facultyCode}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Chương trình */}
                            <FormControl>
                                <FormLabel>Chương trình</FormLabel>
                                <Select
                                    value={formData.programCode}
                                    onChange={(e, newValue) => handleChange("programCode", newValue as string)}
                                    className="border rounded p-1 w-full"
                                >
                                    {programs.map((program) => (
                                        <Option key={program.programCode} value={program.programCode}>
                                            {program.name}
                                        </Option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Khóa học */}
                            <FormControl>
                                <FormLabel>Khóa học</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.cohortYear || ""}
                                    onChange={(e) => handleChange("cohortYear", e.target.value)}
                                    className="border rounded p-1 w-full"
                                    placeholder="Nhập năm khóa học"
                                />
                            </FormControl>


                        </div>

                        {/* Nút xác nhận */}
                        <div className="flex justify-end mt-4">
                            <Button type="submit">Xác nhận</Button>
                        </div>
                    </form>

                </ModalDialog>
            </Modal>
        </>
    );
}

function StudentPage() {
    const { showError } = useError();
    const [page, setPage] = useState<number>(1);
    const limit = 30;
    const [searchQuery, setSearchQuery] = useState<Partial<Student>>({});

    const { studentsQuery, updateStudent, removeStudent, createStudent } = useAllStudents({
        ...searchQuery,
        page,
        limit
    });
    const { facultiesQuery } = useFaculties();
    const { programsQuery } = usePrograms();


    if (studentsQuery.isLoading || facultiesQuery.isLoading || programsQuery.isLoading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (studentsQuery.isError) {
        return showError(studentsQuery.error.message);
    }
    if (facultiesQuery.isError || programsQuery.isError) {
        return showError("Lỗi khi tải danh mục");
    }

    const students = studentsQuery.data.students as Student[];
    const total = studentsQuery.data.total as number;
    const faculties = facultiesQuery.data.faculties as Faculty[];
    const programs = programsQuery.data.programs as Program[];

    return (
        <main className="flex flex-col">
            <h2 className="text-2xl font-bold">Quản lý sinh viên</h2>

            <section className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <Search
                        setSearchQuery={setSearchQuery}
                        faculties={faculties}
                        programs={programs} />
                    <StudentCreateModalDialog
                        onCreate={createStudent.mutateAsync}
                        faculties={faculties}
                        programs={programs} />
                </div>
                <ImportButton />
                <ExportButton searchQuery={searchQuery} />
            </section>

            <section className="flex flex-col gap-6 items-center mt-6">
                <StudentTableContainer
                    students={students}
                    faculties={faculties}
                    programs={programs}
                    removeStudent={removeStudent.mutateAsync}
                    updateStudent={updateStudent.mutateAsync}
                />
                <Pagination
                    total={total ?? 0}
                    limit={limit}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </section>
        </main>
    );
}

export default StudentPage;
