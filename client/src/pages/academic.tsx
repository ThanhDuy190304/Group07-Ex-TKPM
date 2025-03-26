import { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms'
import { useFaculties } from '../hooks/useFaculties'
import { useStudentStatus } from '../hooks/useStudentStatus'
import { StudentStatus } from '../types/studentStatus';
import { Faculty } from '../types/faculty';
import { Program } from '../types/program';
import { Table, Sheet } from '@mui/joy';
import { PencilSquareIcon, CheckIcon } from "@heroicons/react/24/outline";


function FacultiesTable({ faculties, editingFaculty, onEdit, onChange, onSave, onCancel }: {
    faculties: Faculty[]; editingFaculty: Faculty | null;
    onEdit: (faculty: Faculty) => void; onChange: (key: keyof Faculty, value: string) => void;
    onSave: () => void; onCancel: () => void;
}) {
    const fields = faculties.length ? (Object.keys(faculties[0]) as (keyof Faculty)[]) : [];

    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {fields.map((header) => (
                            <th key={header} className="w-32 capitalize">{header}</th>
                        ))}
                        <th className="w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {faculties.map((faculty) => {
                        const isEditing = editingFaculty?.facultyId === faculty.facultyId;
                        return (
                            <tr key={faculty.facultyId}>
                                {fields.map((key) => (
                                    <td key={key} className="px-4 py-2">
                                        {isEditing ? (
                                            <input type="text"
                                                defaultValue={editingFaculty[key] || ""}
                                                onBlur={(e) => onChange(key, e.target.value)}
                                                className="border rounded p-1 w-full"
                                            />
                                        ) : (
                                            faculty[key]
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-2 flex gap-4">
                                    {isEditing ? (
                                        <>
                                            <button onClick={onSave} className="p-1 rounded text-green-500 hover:bg-green-100">
                                                <CheckIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={onCancel} className="p-1 rounded text-red-500 hover:bg-red-100">
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => onEdit(faculty)}
                                            className="p-1 rounded text-blue-500 hover:bg-gray-100">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Sheet>
    );
}


function FacultiesTableContainer({ faculties }: { faculties: Faculty[] }) {
    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
    const { updateFaculty } = useFaculties();

    const handleEdit = (faculty: Faculty) => {
        setEditingFaculty(faculty);
    };

    const handleChange = (key: keyof Faculty, value: string) => {
        if (editingFaculty) {
            setEditingFaculty({ ...editingFaculty, [key]: value });
        }
    };

    const handleSave = async () => {
        if (!editingFaculty) return;

        try {
            console.log("Cập nhật dữ liệu:", editingFaculty);
            await updateFaculty.mutateAsync({
                facultyId: editingFaculty.facultyId,
                updatedData: { name: editingFaculty.name },
            });
            setEditingFaculty(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật khoa:", error);
            alert("Không thể cập nhật khoa. Vui lòng thử lại sau.");
        }
    };

    const handleCancel = () => {
        setEditingFaculty(null);
    };

    return (
        <FacultiesTable
            faculties={faculties}
            editingFaculty={editingFaculty}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}





function ProgramsTable({ programs }: { programs: Program[] }) {
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        <th className="w-16">ID</th>
                        <th className="w-32">Tên Chương Trình</th>
                        <th className="w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program) => (
                        <tr key={program.programId}>
                            <td className="px-4 py-2">{program.programId}</td>
                            <td className="px-4 py-2">{program.name}</td>
                            <td className="px-4 py-2 flex gap-4">
                                <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}
function StudentStatusTable({ studentStatuses }: { studentStatuses: StudentStatus[] }) {
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        <th className='w-16'>ID</th>
                        <th className="w-32">Tên Tình Trạng</th>
                        <th className='w-12'></th>
                    </tr>
                </thead>
                <tbody>
                    {studentStatuses.map((studentStatus) => (
                        <tr key={studentStatus.statusId}>
                            <td className="px-4 py-2">{studentStatus.statusId}</td>
                            <td className="px-4 py-2">{studentStatus.name}</td>
                            <td className="px-4 py-2 flex gap-4">
                                <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}


function AcademicPage() {
    const { studentStatusesQuery, createStudentStatus, updateStudentStatus } = useStudentStatus();
    const { facultiesQuery } = useFaculties();
    const { programsQuery, createProgram, updateProgram } = usePrograms();

    if (
        studentStatusesQuery.isLoading ||
        facultiesQuery.isLoading ||
        programsQuery.isLoading
    ) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (
        studentStatusesQuery.isError ||
        facultiesQuery.isError ||
        programsQuery.isError
    ) {
        return <p>Lỗi khi tải dữ liệu.</p>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Quản lý Học Thuật</h2>
            <section>
                <h3 className="text-xl font-semibold mb-4">Trạng Thái Sinh Viên</h3>
                <StudentStatusTable studentStatuses={studentStatusesQuery.data || []} />
            </section>
            <section>
                <h3 className="text-xl font-semibold mb-4">Danh Sách Khoa</h3>
                <FacultiesTableContainer faculties={facultiesQuery.data || []} />
            </section>
            <section>
                <h3 className="text-xl font-semibold mb-4">Chương Trình Học</h3>
                <ProgramsTable programs={programsQuery.data || []} />
            </section>
        </div>
    );

}

export default AcademicPage;