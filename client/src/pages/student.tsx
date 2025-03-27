import { useState } from "react";
import {
    MagnifyingGlassIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon,
    DocumentArrowDownIcon, DocumentArrowUpIcon
} from "@heroicons/react/24/outline";
import { Table, Sheet, Card, CardContent, Typography, Select, Option } from '@mui/joy';
import lodash from "lodash";

import { usePaginatedStudents, useAllStudents } from "../hooks/useStudents"
import { useFaculties } from "../hooks/useFaculties";
import { usePrograms } from "../hooks/usePrograms";
import { Student, PaginatedStudents, studentFields } from "../types/student";
import { Faculty } from "../types/faculty";
import { Program } from "../types/program";
import { StudentStatus } from "../types/studentStatus";
import { formatAddress } from "../types/Address";

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

function flattenStudent(student: Student) {
    return {
        ...student,
        temporaryResidenceAddress: formatAddress(student.temporaryResidenceAddress),
        permanentAddress: formatAddress(student.permanentAddress),
        mailAddress: formatAddress(student.mailAddress),
        Faculty: student.Faculty?.short_name || student.Faculty?.name,
        Program: student.Program?.short_name || student.Program?.name,
        StudentStatus: student.StudentStatus?.name
    };
}

function StudentDetailsCard({ student, onClose }: { student: Student; onClose: () => void }) {
    const flatStudent = flattenStudent(student);
    console.log(flatStudent);
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
                    {studentFields.studentId}: {student.studentId}
                </Typography>
                <div className="mt-4 space-y-2">
                    {Object.entries(studentFields).map(([fieldKey, fieldLabel]) => {
                        if (fieldKey === "studentId" || fieldKey === "fullName") return null;
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


interface StudentTableRowProps {
    student: Student;
    isEditing: boolean;
    isAnyEditing: boolean;
    onEdit: () => void;
    onChange: (key: keyof Student, value: string) => void;
    onSave: () => void;
    onDelete: (studentId: string) => void;
    onSelect: () => void;
}
function StudentStatusRow({ student, isEditing, isAnyEditing, onEdit, onChange, onSave, onDelete, onSelect }: StudentTableRowProps) {
    const { facultiesQuery } = useFaculties();
    const { programsQuery } = usePrograms();
    const faculties: Faculty[] = facultiesQuery.data || []
    const programs: Program[] = programsQuery.data || [];
    return (
        <tr className="cursor-pointer hover:bg-gray-100" onClick={onSelect}>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"> {student.studentId}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{student.fullName}</td>

            {/* Cột Khoa */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <Select
                        value={student.facultyId}
                        onChange={(e, newValue) => onChange("facultyId", newValue as string)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}

                    >
                        {faculties.map((faculty) => (
                            <Option
                                key={faculty.facultyId}
                                value={faculty.facultyId}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {faculty.name}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    student.Faculty.name || "Chưa có khoa"
                )}
            </td>

            {/* Cột Chương Trình */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {isEditing ? (
                    <Select
                        value={student.programId}
                        onChange={(e, newValue) => onChange("programId", newValue as string)}
                        className="border rounded p-1 w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {programs.map((program) => (
                            <Option
                                key={program.programId}
                                value={program.programId}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {program.name}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    student.Program.name || "Chưa có chương trình"
                )}
            </td>

            {/* Cột Khoá */}
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.courseId}
            </td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {student.StudentStatus.name}
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
                                onDelete(student.studentId);
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-100"
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
    onEdit: (student: Student) => void;
    onChange: (key: keyof Student, value: string) => void;
    onSave: () => void;
    onDelete: (studentId: string) => void;
}
function StudentTable({ students, editingStudent, isEditingStudentId, onEdit, onChange, onSave, onDelete }: StudentTableProps) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    students = lodash.orderBy(students, ["studentId"], ["asc"]);
    const studentFieldWidths: Partial<Record<keyof Student, string>> = {
        studentId: "w-12",
        fullName: "w-20",
        Faculty: "w-12",
        Program: "w-16",
        courseId: "w-12",
        StudentStatus: "w-12",
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
                            const isEditing = isEditingStudentId === student.studentId;
                            const currentStudent = isEditing ? editingStudent : student;
                            return (
                                <StudentStatusRow
                                    key={student.studentId}
                                    student={currentStudent!}
                                    isEditing={isEditing}
                                    isAnyEditing={!!isEditingStudentId}
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
    removeStudent,
    updateStudent,
}: {
    students: Student[];
    removeStudent: (studentId: string) => Promise<void>;
    updateStudent: (data: { studentId: string; updatedData: Partial<Student> }) => Promise<Student>;
}) {
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isEditingStudentId, setIsEditingStudentId] = useState<string | null>(null);

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsEditingStudentId(student.studentId);
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
                    studentId: editingStudent.studentId,
                    updatedData: editingStudent,
                });
                console.log("Cập nhật thành công:", editingStudent);
                setEditingStudent(null);
                setIsEditingStudentId(null);
            } catch (error) {
                console.error("Lỗi khi cập nhật sinh viên:", error);
            }
        }
    };

    const handleDelete = async (studentId: string) => {
        try {
            await removeStudent(studentId);
        } catch (error) {
            console.error("Lỗi khi xóa sinh viên:", error);
        }
    };

    return (
        <StudentTable
            students={students}
            editingStudent={editingStudent}
            isEditingStudentId={isEditingStudentId}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
}


function StudentPage() {
    const [page, setPage] = useState<number>(1);
    const limit = 20;
    const [searchQuery, setSearchQuery] = useState<Partial<Student>>({});
    const { studentsQuery, updateStudent, removeStudent } = usePaginatedStudents({ page, limit, searchQuery });

    if (studentsQuery.isLoading) return <p>Đang tải dữ liệu...</p>;
    if (studentsQuery.isError) return <p>Lỗi: {studentsQuery.error.message}</p>;

    const paginatedStu: PaginatedStudents | undefined = studentsQuery.data;

    return (
        <main className="flex flex-col">
            <h2 className="text-2xl font-bold">Quản lý sinh viên</h2>
            <section className="flex flex-col gap-6 items-center mt-6">
                <StudentTableContainer
                    students={paginatedStu?.students ?? []}
                    removeStudent={removeStudent.mutateAsync}
                    updateStudent={updateStudent.mutateAsync}
                />
                <Pagination
                    total={paginatedStu?.total ?? 0}
                    limit={limit}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </section>
        </main>
    );
}

export default StudentPage;
