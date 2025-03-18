import { useEffect, useState, useReducer, useCallback } from 'react';
import { getFaculties } from '../api/useFalcuties';
import { getPrograms } from '../api/usePrograms';
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Tooltip } from 'react-tooltip';
import { Table } from '@mui/joy';
import Modal from "react-modal";
import { motion } from "framer-motion";
import { validateNotEmptyFields } from '../utils/validators';
import { useError } from "../utils/ErrorContext";


Modal.setAppElement("#root");
/**
 * @typedef {Object} faculty
 * @property {string} facultyId
 * @property {string} name
 * @property {string} short_name 
 */

/**
 * @typedef {Object} program
 * @property {string} programId
 * @property {string} name
 */

function updateFaculty(facultyId, updateData) {
    console.log("Updating faculty", facultyId);
    console.log("Update data", updateData);
}
function FacultyTable({ faculties, setFaculties }) {
    function facultyDispatch(state, action) {
        switch (action.type) {
            case "START_EDIT":
                return { ...action.data };
            case "EDIT_FIELD":
                return { ...state, [action.field]: action.value }; // Gán giá trị mới vào field
            default:
                return state;
        }
    }
    const [editFaculty, editFacultyDispatch] = useReducer(facultyDispatch, {});
    const [checkEditingRow, setCheckEditingRow] = useState(null); //Save Editing facultyId

    const startEdit = useCallback((faculty) => {
        setCheckEditingRow(faculty.facultyId);
        editFacultyDispatch({ type: "START_EDIT", data: faculty });

    }, []);
    const editField = useCallback((field, value) => {
        editFacultyDispatch({ type: "EDIT_FIELD", field, value });
    }, []);

    const saveEdit = useCallback(() => {
        const { facultyId, ...updateData } = editFaculty;
        updateFaculty(facultyId, updateData);
        setCheckEditingRow(null);
    }, [checkEditingRow]);

    return (
        <Table
            stickyHeader
            sx={{
                width: 'screen',
                borderRadius: '8px',
                border: '2px solid #9ca3af', // Tương đương border-gray-400 của Tailwind
                overflow: 'hidden',
                '& th[scope="col"]': { bgcolor: 'var(--joy-palette-neutral-300, #CDD7E1)' },
                '& th:nth-of-type(1), & td:nth-of-type(1)': { width: '100px' }, // STT hẹp
                '& th:nth-of-type(2), & td:nth-of-type(2)': { width: '250px' }, // Cột Tên Khoa rộng
            }}
        >
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên Khoa</th>
                    <th scope="col">Tên viết tắt</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {faculties.map((faculty, index) => (
                    <tr key={faculty.facultyId}>
                        <th scope="row">{index + 1}</th>
                        {/* Cột Tên Khoa */}
                        <td>
                            {checkEditingRow === faculty.facultyId ? (
                                <input
                                    type="text"
                                    value={editFaculty.name}
                                    onChange={(e) => editField("name", e.target.value)}
                                    className="border-b border-sky-700 p-1 rounded w-full focus:outline-none"
                                />
                            ) : (
                                faculty.name
                            )}
                        </td>
                        {/* Cột Tên Viết Tắt */}
                        <td>
                            {checkEditingRow === faculty.facultyId ? (
                                <input
                                    type="text"
                                    value={editFaculty.short_name}
                                    onChange={(e) => editField("short_name", e.target.value)}
                                    className="border-b border-sky-700 p-1 rounded w-full focus:outline-none"
                                />
                            ) : (
                                faculty.short_name
                            )}
                        </td>
                        {/* Cột chứa nút chỉnh sửa / lưu */}
                        <td className="flex justify-end">
                            {checkEditingRow === null ? (
                                <PencilSquareIcon
                                    onClick={() => startEdit(faculty)}
                                    className="w-5 h-5 text-blue-500 cursor-pointer"
                                />
                            ) : checkEditingRow === faculty.facultyId ? (
                                <CheckIcon
                                    onClick={() => saveEdit()}
                                    className="w-5 h-5 text-green-500 cursor-pointer"
                                />
                            ) : (
                                <div>
                                    <PencilSquareIcon
                                        id="edit-icon"
                                        className="w-5 h-5 text-gray-400 cursor-not-allowed"
                                    />
                                    <Tooltip anchorSelect="#edit-icon" content="Vui lòng hoàn thành chỉnh sửa trước" />
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>

        </Table>
    );
}
function insertFaculty(newFaculty) {
    console.log("Inserting faculty", newFaculty);
}
function FacultyInsertion_Button({ faculties, setFaculties }) {
    const { showError } = useError();
    const [newFaculty, setNewFaculty] = useState({ name: "", short_name: "" });
    const [isInserting, setIsInserting] = useState(false);

    const openFacultyInsertion = () => setIsInserting(true);
    const closeFacultyInsertion = () => setIsInserting(false);
    const saveFaculty = () => {
        let error = validateNotEmptyFields(newFaculty);
        if (error) {
            showError(error);
            return;
        }
        else {
            insertFaculty(newFaculty);
            setFaculties([...faculties, newFaculty]);
            setNewFaculty({ name: "", short_name: "" });
            closeFacultyInsertion();
        }
    }

    return (
        <>
            {/* Nút "Thêm Khoa" */}
            <button
                onClick={openFacultyInsertion}
                className="bg-green-800 hover:bg-green-900 text-white py-1 px-4 rounded cursor-pointer"
            >
                Thêm Khoa
            </button>

            {/* Modal */}
            {isInserting && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                    >
                        <h2 className="text-lg font-bold mb-4">Thêm Khoa</h2>
                        <input
                            type="text"
                            value={newFaculty.name}
                            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                            placeholder="Tên Khoa"
                            className="border p-2 rounded w-full mb-3"
                        />
                        <input
                            type="text"
                            value={newFaculty.short_name}
                            onChange={(e) => setNewFaculty({ ...newFaculty, short_name: e.target.value })}
                            placeholder="Tên Viết Tắt"
                            className="border p-2 rounded w-full mb-3"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => { saveFaculty(); }}
                                className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={closeFacultyInsertion}
                                className="bg-red-800 hover:bg-red-900 text-white py-2 px-4 rounded"
                            >
                                Hủy
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}

function updateProgram(programId, updateData) {
    console.log("Updating program", programId);
    console.log("Update data", updateData);
}
function ProgramTable({ programs, setPrograms }) {
    function programDispatch(state, action) {
        switch (action.type) {
            case "START_EDIT":
                return { ...action.data };
            case "EDIT_FIELD":
                return { ...state, [action.field]: action.value };
            default:
                return state;
        }
    }
    const [editProgram, editProgramDispatch] = useReducer(programDispatch, {});
    const [checkEditingRow, setCheckEditingRow] = useState(null);
    const startEdit = useCallback((program) => {
        setCheckEditingRow(program.programId);
        editProgramDispatch({ type: "START_EDIT", data: program });
    }, []);

    const editField = useCallback((field, value) => {
        editProgramDispatch({ type: "EDIT_FIELD", field, value });
    }, []);

    const saveEdit = useCallback(() => {
        const { programId, ...updateData } = editProgram;
        updateProgram(programId, updateData);
        setCheckEditingRow(null);
    }, [editProgram]);

    return (
        <Table
            stickyHeader
            sx={{
                width: '100%',
                borderRadius: '8px',
                border: '2px solid #9ca3af',
                overflow: 'hidden',
                '& th[scope="col"]': { bgcolor: 'var(--joy-palette-neutral-300, #CDD7E1)' },
            }}
        >
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tên Chương trình</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {programs.map((program, index) => (
                    <tr key={program.programId}>
                        <th scope="row">{index + 1}</th>
                        <td>
                            {checkEditingRow === program.programId ? (
                                <input
                                    type="text"
                                    value={editProgram.name}
                                    onChange={(e) => editField("name", e.target.value)}
                                    className="border-b border-sky-700 p-1 rounded w-full focus:outline-none"
                                />
                            ) : (
                                program.name
                            )}
                        </td>
                        <td className="flex justify-end">
                            {checkEditingRow === null ? (
                                <PencilSquareIcon
                                    onClick={() => startEdit(program)}
                                    className="w-5 h-5 text-blue-500 cursor-pointer"
                                />
                            ) : checkEditingRow === program.programId ? (
                                <CheckIcon
                                    onClick={() => saveEdit()}
                                    className="w-5 h-5 text-green-500 cursor-pointer"
                                />
                            ) : (
                                <PencilSquareIcon className="w-5 h-5 text-gray-400 cursor-not-allowed" />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}


function Academic() {
    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching faculties, programs");
                const [facultiesData, programsData] = await Promise.all([
                    getFaculties(),
                    getPrograms(),
                ]);
                setFaculties(facultiesData);
                setPrograms(programsData);
            } catch (error) {
                console.error("Failed to fetch faculties, programs");
            }
        }; fetchData();
    }, []);
    return (
        <div>
            <div className="flex flex-col w-full">
                <h2 className="text-2xl font-bold">Quản lý đào tạo</h2>
            </div>
            <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Khoa</h3>
                    <FacultyInsertion_Button faculties={faculties} setFaculties={setFaculties} />
                </div>
                <FacultyTable faculties={faculties} setFaculties={setFaculties} />
            </div>
            <div className='mt-8'>
                <h3 className="text-xl font-bold mb-2">Chương trình đào tạo</h3>
                <ProgramTable programs={programs} setPrograms={setPrograms} />
            </div>
        </div>
    );
}
export default Academic;

