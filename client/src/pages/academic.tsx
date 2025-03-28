import { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms'
import { useFaculties } from '../hooks/useFaculties'
import { useStudentStatus } from '../hooks/useStudentStatuses'
import { StudentStatus, studentStatusFields } from '../types/studentStatus';
import { Faculty, facultyFields } from '../types/faculty';
import { Program, programFields } from '../types/program';
import {
    Table, Sheet, Modal, Button, ModalDialog, DialogTitle, DialogContent,
    Stack, FormControl, FormLabel, Input
} from '@mui/joy';
import { PencilSquareIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";


//Faculty
function FacultyCreateModalDialog({ onCreate }: { onCreate: (newFaculty: Partial<Faculty>) => void }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Faculty>>({});

    const handleChange = (key: keyof Faculty, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onCreate(formData);
        setOpen(false);
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
                Tạo khoa
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Tạo khoa mới</DialogTitle>
                    <DialogContent>Điền đủ thông tin dưới đây.</DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {Object.entries(facultyFields).map(([key, label]) => (
                                <FormControl key={key}>
                                    <FormLabel>{label}</FormLabel>
                                    <Input
                                        autoFocus={key === "name"}
                                        required
                                        value={formData[key as keyof Faculty] || ""}
                                        onChange={(e) => handleChange(key as keyof Faculty, e.target.value)}
                                    />
                                </FormControl>
                            ))}
                            <Button type="submit">Xác nhận</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}

interface FacultyRowProps {
    index: number;
    faculty: Faculty;
    isEditing: boolean;
    isAnyEditing: boolean;
    onEdit: () => void;
    onChange: (key: keyof Faculty, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function FacultyRow({ index, faculty, isEditing, isAnyEditing, onEdit, onChange, onSave, onCancel }: FacultyRowProps) {
    const fields = Object.keys(faculty).filter((key) => key !== "facultyId") as (keyof Faculty)[];
    return (
        <tr>
            {/* Cột STT */}
            <td className="px-4 py-2">{index}</td>
            {fields.map((key) => (
                <td key={key} className="px-4 py-2">
                    {isEditing ? (
                        <input
                            type="text"
                            defaultValue={faculty[key] || ""}
                            onBlur={(e) => onChange(key, e.target.value)}
                            className="border rounded p-1 w-full"
                            required
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
                    <button
                        onClick={onEdit}
                        disabled={isAnyEditing}
                        className={`p-1 rounded text-blue-500 hover:bg-gray-100 ${isAnyEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                )}
            </td>
        </tr>
    );
}

interface FacultiesTableProps {
    faculties: Faculty[];
    editingFaculty: Faculty | null;
    isEditingFacultyId: string | null;
    onEdit: (faculty: Faculty) => void;
    onChange: (key: keyof Faculty, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function FacultiesTable({ faculties, editingFaculty, isEditingFacultyId, onEdit, onChange, onSave, onCancel }: FacultiesTableProps) {
    const headers = ["STT", ...Object.values(facultyFields)];
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="w-32 capitalize">{header}</th>
                        ))}
                        <th className="w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {faculties.map((faculty, index) => {
                        const isEditing = isEditingFacultyId === faculty.facultyId;
                        const currentFaculty = isEditing ? editingFaculty : faculty;
                        return (
                            <FacultyRow
                                key={faculty.facultyId}
                                index={index + 1} // STT bắt đầu từ 1
                                faculty={currentFaculty!}
                                isEditing={isEditing}
                                isAnyEditing={!!isEditingFacultyId}
                                onEdit={() => onEdit(faculty)}
                                onChange={onChange}
                                onSave={onSave}
                                onCancel={onCancel}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </Sheet>
    );
}

function FacultiesTableContainer({ faculties }: { faculties: Faculty[] }) {
    const [isEditingFacultyId, setIsEditingFacultyId] = useState<string | null>(null);
    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
    const { updateFaculty } = useFaculties();

    const handleEdit = (faculty: Faculty) => {
        setIsEditingFacultyId(faculty.facultyId);
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
            await updateFaculty.mutateAsync({
                facultyId: isEditingFacultyId!,
                updatedData: editingFaculty
            });
            setEditingFaculty(null);
            setIsEditingFacultyId(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật khoa:", error);
        }
    };

    const handleCancel = () => {
        setEditingFaculty(null);
        setIsEditingFacultyId(null);
    };

    return (
        <FacultiesTable
            faculties={faculties}
            editingFaculty={editingFaculty}
            isEditingFacultyId={isEditingFacultyId}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}

function FacultiesContainer({ faculties }: { faculties: Faculty[] }) {
    const { createFaculty } = useFaculties();

    const handleCreate = async (newFaculty: Partial<Faculty>) => {
        try {
            await createFaculty.mutateAsync(newFaculty);
            console.log("Tạo khoa thành công:", newFaculty);
        } catch (error) {
            console.error("Lỗi khi tạo khoa:", error);
        }
    };

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-4">Danh Sách Khoa</h3>
            <FacultyCreateModalDialog onCreate={handleCreate} />
            <FacultiesTableContainer faculties={faculties} />
        </section>
    );
}

//Program
function ProgramCreateModalDialog({ onCreate }: { onCreate: (newProgram: Partial<Program>) => void }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Program>>({});

    const handleChange = (key: keyof Program, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onCreate(formData); // Gọi hàm tạo chương trình học từ container
        setOpen(false);
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
                Tạo chương trình
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Tạo chương trình mới</DialogTitle>
                    <DialogContent>Điền đủ thông tin dưới đây.</DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {Object.entries(programFields).map(([key, label]) => (
                                <FormControl key={key}>
                                    <FormLabel>{label}</FormLabel>
                                    <Input
                                        autoFocus={key === "name"}
                                        required
                                        value={formData[key as keyof Program] || ""}
                                        onChange={(e) => handleChange(key as keyof Program, e.target.value)}
                                    />
                                </FormControl>
                            ))}
                            <Button type="submit">Xác nhận</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}

interface ProgramRowProps {
    index: number;
    program: Program;
    isEditing: boolean;
    isAnyEditing: boolean;
    onEdit: () => void;
    onChange: (key: keyof Program, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function ProgramRow({ index, program, isEditing, isAnyEditing, onEdit, onChange, onSave, onCancel }: ProgramRowProps) {
    const fields = Object.keys(program).filter((key) => key !== "programId") as (keyof Program)[];
    return (
        <tr>
            {/* Cột STT */}
            <td className="px-4 py-2">{index}</td>
            {fields.map((key) => (
                <td key={key} className="px-4 py-2">
                    {isEditing ? (
                        <input
                            type="text"
                            defaultValue={program[key] || ""}
                            onBlur={(e) => onChange(key, e.target.value)}
                            className="border rounded p-1 w-full"
                        />
                    ) : (
                        program[key]
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
                    <button
                        onClick={onEdit}
                        disabled={isAnyEditing}
                        className={`p-1 rounded text-blue-500 hover:bg-gray-100 ${isAnyEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                )}
            </td>
        </tr>
    );
}

interface ProgramsTableProps {
    programs: Program[];
    editingProgram: Program | null;
    isEditingProgramId: string | null;
    onEdit: (program: Program) => void;
    onChange: (key: keyof Program, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function ProgramsTable({ programs, editingProgram, isEditingProgramId, onEdit, onChange, onSave, onCancel }: ProgramsTableProps) {
    const headers = ["STT", ...Object.values(programFields)];
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="w-32 capitalize">{header}</th>
                        ))}
                        <th className="w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program, index) => {
                        const isEditing = isEditingProgramId === program.programId;
                        const currentProgram = isEditing ? editingProgram : program;
                        return (
                            <ProgramRow
                                key={program.programId}
                                index={index + 1} // STT bắt đầu từ 1
                                program={currentProgram!}
                                isEditing={isEditing}
                                isAnyEditing={!!isEditingProgramId}
                                onEdit={() => onEdit(program)}
                                onChange={onChange}
                                onSave={onSave}
                                onCancel={onCancel}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </Sheet>
    );
}

function ProgramsTableContainer({ programs }: { programs: Program[] }) {
    const [isEditingProgramId, setIsEditingProgramId] = useState<string | null>(null);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const { updateProgram } = usePrograms();

    const handleEdit = (program: Program) => {
        setIsEditingProgramId(program.programId);
        setEditingProgram(program);
    };

    const handleChange = (key: keyof Program, value: string) => {
        if (editingProgram) {
            setEditingProgram({ ...editingProgram, [key]: value });
        }
    };

    const handleSave = async () => {
        if (!editingProgram) return;

        try {
            await updateProgram.mutateAsync({
                programId: isEditingProgramId!,
                updatedData: editingProgram
            });
            setEditingProgram(null);
            setIsEditingProgramId(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật chương trình:", error);
        }
    };

    const handleCancel = () => {
        setEditingProgram(null);
        setIsEditingProgramId(null);
    };

    return (
        <ProgramsTable
            programs={programs}
            editingProgram={editingProgram}
            isEditingProgramId={isEditingProgramId}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}

function ProgramsContainer({ programs }: { programs: Program[] }) {
    const { createProgram } = usePrograms();

    const handleCreate = async (newProgram: Partial<Program>) => {
        try {
            await createProgram.mutateAsync(newProgram);
            console.log("Tạo chương trình học thành công:", newProgram);
        } catch (error) {
            console.error("Lỗi khi tạo chương trình học:", error);
        }
    };

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-4">Danh Sách Chương Trình Học</h3>
            <ProgramCreateModalDialog onCreate={handleCreate} />
            <ProgramsTableContainer programs={programs} />
        </section>
    );
}

//StudentStatus

function StudentStatusCreateModalDialog({ onCreate }: { onCreate: (newStatus: Partial<StudentStatus>) => void }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<StudentStatus>>({});

    const handleChange = (key: keyof StudentStatus, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onCreate(formData);
        setOpen(false);
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
                Tạo trạng thái
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Tạo trạng thái mới</DialogTitle>
                    <DialogContent>Điền đủ thông tin dưới đây.</DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            {Object.entries(studentStatusFields).map(([key, label]) => (
                                <FormControl key={key}>
                                    <FormLabel>{label}</FormLabel>
                                    <Input
                                        autoFocus={key === "name"}
                                        required
                                        value={formData[key as keyof StudentStatus] || ""}
                                        onChange={(e) => handleChange(key as keyof StudentStatus, e.target.value)}
                                    />
                                </FormControl>
                            ))}
                            <Button type="submit">Xác nhận</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}

interface StudentStatusRowProps {
    index: number;
    status: StudentStatus;
    isEditing: boolean;
    isAnyEditing: boolean;
    onEdit: () => void;
    onChange: (key: keyof StudentStatus, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

function StudentStatusRow({ index, status, isEditing, isAnyEditing, onEdit, onChange, onSave, onCancel }: StudentStatusRowProps) {
    const fields = Object.keys(status).filter((key) => key !== "statusId") as (keyof StudentStatus)[];
    return (
        <tr>
            {/* Cột STT */}
            <td className="px-4 py-2">{index}</td>

            {fields.map((key) => (
                <td key={key} className="px-4 py-2">
                    {isEditing ? (
                        <input
                            type="text"
                            defaultValue={status[key] || ""}
                            onBlur={(e) => onChange(key, e.target.value)}
                            className="border rounded p-1 w-full"
                            required
                        />
                    ) : (
                        status[key]
                    )}
                </td>
            ))}

            <td className="px-4 py-2 flex gap-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={onSave}
                            className="p-1 rounded text-green-500 hover:bg-green-100"
                        >
                            <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onCancel}
                            className="p-1 rounded text-red-500 hover:bg-red-100"
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onEdit}
                        disabled={isAnyEditing}
                        className={`p-1 rounded text-blue-500 hover:bg-gray-100 ${isAnyEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                )}
            </td>
        </tr>
    );
}

interface StudentStatusTableProps {
    studentStatuses: StudentStatus[];
    editingStatus: StudentStatus | null;
    isEditingStatusId: string | null;
    onEdit: (status: StudentStatus) => void;
    onChange: (key: keyof StudentStatus, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}
function StudentStatusesTable({ studentStatuses, editingStatus, isEditingStatusId, onEdit, onChange, onSave, onCancel }: StudentStatusTableProps) {
    const headers = ["STT", ...Object.values(studentStatusFields)];
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="w-32 capitalize">{header}</th>
                        ))}
                        <th className="w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {studentStatuses.map((status, index) => {
                        const isEditing = isEditingStatusId === status.statusId;
                        const currentStatus = isEditing ? editingStatus : status;

                        return (
                            <StudentStatusRow
                                key={status.statusId}
                                index={index + 1} // STT bắt đầu từ 1
                                status={currentStatus!}
                                isEditing={isEditing}
                                isAnyEditing={!!isEditingStatusId}
                                onEdit={() => onEdit(status)}
                                onChange={onChange}
                                onSave={onSave}
                                onCancel={onCancel}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </Sheet>
    );
}

function StudentStatusesTableContainer({ studentStatuses }: { studentStatuses: StudentStatus[] }) {
    const { updateStudentStatus } = useStudentStatus();
    const [isEditingStatusId, setIsEditingStatusId] = useState<string | null>(null);
    const [editingStatus, setEditingStatus] = useState<StudentStatus | null>(null);

    const handleEdit = (status: StudentStatus) => {
        setIsEditingStatusId(status.statusId);
        setEditingStatus(status);
    };

    const handleChange = (key: keyof StudentStatus, value: string) => {
        if (editingStatus) {
            setEditingStatus({ ...editingStatus, [key]: value });
        }
    };

    const handleSave = async () => {
        if (!editingStatus) return;

        try {
            await updateStudentStatus.mutateAsync({
                statusId: isEditingStatusId!,
                updatedData: editingStatus,
            });
            setEditingStatus(null);
            setIsEditingStatusId(null);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sinh viên:", error);
        }
    };

    const handleCancel = () => {
        setEditingStatus(null);
        setIsEditingStatusId(null);
    };

    return (
        <StudentStatusesTable
            studentStatuses={studentStatuses}
            editingStatus={editingStatus}
            isEditingStatusId={isEditingStatusId}
            onEdit={handleEdit}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}

function StudentStatusContainer({ studentStatuses }: { studentStatuses: StudentStatus[] }) {
    const { createStudentStatus } = useStudentStatus();

    const handleCreate = async (newStatus: Partial<StudentStatus>) => {
        try {
            await createStudentStatus.mutateAsync(newStatus);
            console.log("Tạo trạng thái sinh viên thành công:", newStatus);
        } catch (error) {
            console.error("Lỗi khi tạo trạng thái sinh viên:", error);
        }
    };

    return (
        <section className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-4">Trạng Thái Sinh Viên</h3>
            <StudentStatusCreateModalDialog onCreate={handleCreate} />
            <StudentStatusesTableContainer studentStatuses={studentStatuses} />
        </section>
    );
}

function AcademicPage() {
    const { studentStatusesQuery } = useStudentStatus();
    const { facultiesQuery } = useFaculties();
    const { programsQuery } = usePrograms();

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
                <StudentStatusContainer studentStatuses={studentStatusesQuery.data || []} />
            </section>
            <section className='flex flex-col gap-4'>
                <FacultiesContainer faculties={facultiesQuery.data || []} />
            </section>
            <section>
                <ProgramsContainer programs={programsQuery.data || []} />
            </section>
        </div>
    );

}

export default AcademicPage;