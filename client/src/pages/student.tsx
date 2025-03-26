import { useState } from "react";
import {
    MagnifyingGlassIcon, TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon,
    DocumentArrowDownIcon, DocumentArrowUpIcon
} from "@heroicons/react/24/outline";
import { Table, Sheet, Card, CardContent, Typography } from '@mui/joy';
import lodash from "lodash";

import { usePaginatedStudents, useAllStudents } from "../hooks/useStudents"
import { Student, PaginatedStudents, studentFields } from "../types/student";


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

function StudentDetailsCard({ student, onClose }: { student: Student; onClose: () => void }) {
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
                            <Typography key={fieldKey} level="body-md">
                                {fieldLabel}: {String(student[fieldKey as keyof Student])}
                            </Typography>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function StudentTable({ students }: { students: Student[] }) {
    students = lodash.orderBy(students, ["studentId"], ["asc"]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const studentFieldWidths: Partial<Record<keyof Student, string>> = {
        studentId: "w-16",
        fullName: "w-20",
        facultyId: "w-12",
        courseId: "w-12",
        programId: "w-16",
        statusId: "w-12",
    };

    return (
        <div className="flex flex-row gap-2">
            <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
                <Table>
                    <thead>
                        <tr>
                            {Object.entries(studentFields)
                                .filter(([key]) => key in studentFieldWidths)
                                .map(([key, title]) => (
                                    <th
                                        key={key}
                                        className={`px-4 py-2 text-left font-semibold select-text ${studentFieldWidths[key as keyof Student]}`}
                                    >
                                        {title}
                                    </th>
                                ))}
                            <th key="action" className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.studentId}
                                className="bg-white hover:bg-gray-100 text-xs cursor-pointer"
                                onClick={() => setSelectedStudent(student)}>
                                <td className="px-4 py-2">{student.studentId}</td>
                                <td className="px-4 py-2">{student.fullName}</td>
                                <td className="px-4 py-2">{student.facultyId}</td>
                                <td className="px-4 py-2">{student.courseId}</td>
                                <td className="px-4 py-2">{student.programId}</td>
                                <td className="px-4 py-2">{student.statusId}</td>
                                <td className="px-4 py-2 flex gap-4">
                                    <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                </td>
                            </tr>
                        ))}
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

function StudentPage() {
    const [page, setPage] = useState<number>(1);
    const limit = 20;
    const [searchQuery, setSearchQuery] = useState<Partial<Student>>({});
    const { studentsQuery, createStudent, updateStudent, removeStudent } = usePaginatedStudents({ page, limit, searchQuery });

    if (studentsQuery.isLoading) return <p>Đang tải dữ liệu...</p>;
    if (studentsQuery.isError) return <p>Lỗi: {studentsQuery.error.message}</p>;

    const paginatedStu: PaginatedStudents | undefined = studentsQuery.data;

    return (
        <main className="flex flex-col">
            <h2 className="text-2xl font-bold">Quản lý sinh viên</h2>
            <section className="flex flex-col gap-6 items-center mt-6">
                <StudentTable students={paginatedStu?.students ?? []} />
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
