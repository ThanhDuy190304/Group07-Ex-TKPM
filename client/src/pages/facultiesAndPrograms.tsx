import { useState } from 'react';
import { usePrograms } from '../hooks/usePrograms'
import { useFaculties } from '../hooks/useFaculties'
import { Faculty, facultyFields } from '../types/faculty';
import { Program, programFields } from '../types/program';

import {
    Table, Sheet, Modal, Button, ModalDialog, DialogTitle, DialogContent,
    Stack, FormControl, FormLabel, Input
} from '@mui/joy';
import { PencilSquareIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useError } from "../context/ErrorContext";


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
    const fields = Object.keys(faculty).filter((key) => key !== "id") as (keyof Faculty)[];
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
                        const isEditing = isEditingFacultyId === faculty.id;
                        const currentFaculty = isEditing ? editingFaculty : faculty;
                        return (
                            <FacultyRow
                                key={faculty.facultyCode}
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
    const { showError } = useError();

    const handleEdit = (faculty: Faculty) => {
        setIsEditingFacultyId(faculty.id);
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
                updateData: editingFaculty
            });
            setEditingFaculty(null);
            setIsEditingFacultyId(null);
        } catch (error: any) {
            showError(error.message);
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
    const { showError } = useError();

    const handleCreate = async (newFaculty: Partial<Faculty>) => {
        try {
            await createFaculty.mutateAsync(newFaculty);
        } catch (error: any) {
            showError(error.message);
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
    const fields = Object.keys(program).filter((key) => key !== "id") as (keyof Program)[];
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
                        const isEditing = isEditingProgramId === program.id;
                        const currentProgram = isEditing ? editingProgram : program;
                        return (
                            <ProgramRow
                                key={program.id}
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
    const { showError } = useError();

    const handleEdit = (program: Program) => {
        setIsEditingProgramId(program.id);
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
        } catch (error: any) {
            showError(error.message);
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
    const { showError } = useError();

    const handleCreate = async (newProgram: Partial<Program>) => {
        try {
            await createProgram.mutateAsync(newProgram);
        } catch (error: any) {
            showError(error.message);
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


function FacultyAndProgramPage() {
    const { facultiesQuery } = useFaculties();
    const { programsQuery } = usePrograms();

    if (
        facultiesQuery.isLoading ||
        programsQuery.isLoading
    ) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (
        facultiesQuery.isError ||
        programsQuery.isError
    ) {
        return <p>Lỗi khi tải dữ liệu.</p>;
    }
    const faculties = facultiesQuery.data.faculties as Faculty[];
    const programs = programsQuery.data.programs as Program[];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Quản lý Học Thuật</h2>
            <section className='flex flex-col gap-4'>
                <FacultiesContainer faculties={faculties} />
            </section>
            <section>
                <ProgramsContainer programs={programs} />
            </section>
        </div>
    );

}

export default FacultyAndProgramPage;