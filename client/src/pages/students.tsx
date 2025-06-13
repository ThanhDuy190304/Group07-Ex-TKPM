import { Fragment, useState, useEffect, useMemo, useCallback, useContext, createContext, ReactNode } from "react";
import { Control, Controller, useForm, UseFormRegister, UseFormSetValue, FieldPath } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import {
    TrashIcon,
    PencilSquareIcon, ChevronDoubleLeftIcon, ChevronRightIcon,
    ChevronLeftIcon, ChevronDoubleRightIcon, CheckIcon, XMarkIcon,
    UserPlusIcon, XCircleIcon, CakeIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, AcademicCapIcon,
    GlobeAsiaAustraliaIcon
} from "@heroicons/react/24/outline";
import {
    Table, Sheet, Card, CardContent, Typography, Select, Option, Input, Button,
    Modal, ModalDialog, DialogTitle, DialogContent, FormControl, FormLabel, Checkbox,
    Tab, Tabs, TabList, TabPanel, RadioGroup, Radio, Stack
} from '@mui/joy';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

import { useAllStudents } from "../hooks/useStudents"
import { useFaculties } from "../hooks/useFaculties";
import { usePrograms } from "../hooks/usePrograms";
import { Student, studentFieldKeys } from "../types/student";
import { Faculty } from "../types/faculty";
import { Program } from "../types/program";
import { Address, formatAddress, addressFields } from "../types/address";
import { IdentityDocument, identityDocumentFields, CCCDIdentityDocument, CMNDIdentityDocument, PassportIdentityDocument, formatIdentityDocument } from "../types/identityDocument";
import { Gender, StudentStatus, IdentityDocumentType } from "../types/enum"
import { useError } from "../context/ErrorContext";
import { ImportButtonStudent } from "../components/button/import";
import { ExportButtonStudent } from "../components/button/export";
import { FunctionsOutlined } from "@mui/icons-material";


const StudentDataContext = createContext<{
    students: Student[];
    total: number;
    page: number;
    limit: number;
    searchQuery: Partial<Student>
} | null>(null);

const StudentActionContext = createContext<{
    handleRemoveStudents: (studentIds: string[]) => Promise<boolean>;
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
    const { t: tCommon } = useTranslation("common"); // ⬅ đổi tên thành tCommon
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

    const handleRemoveStudents = useCallback(async (studentIds: string[]) => {
        try {
            await removeStudents.mutateAsync(studentIds);
            setSelectedStudentIds([]);
            return true;
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [removeStudents, selectedStudentIds]);

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
    }, [page]);

    const studentDataContextValue = useMemo(() => ({
        students: studentsQuery.data?.students || [],
        total: studentsQuery.data?.total || 0,
        page,
        limit,
        searchQuery
    }), [studentsQuery.data]);

    const studentActionContextValue = useMemo(() => ({
        handleRemoveStudents,
        handleCreate,
        handleUpdate,
        handlePageChange,
        handleSearch
    }), []);

    const facultyContextValue = useMemo(() => ({
        faculties: facultiesQuery.data?.faculties || []
    }), [facultiesQuery.data]);

    const programContextValue = useMemo(() => ({
        programs: programsQuery.data?.programs || []
    }), [programsQuery.data]);

    const selectionContextValue = useMemo(() => ({
        selectedStudentIds,
        setSelectedStudentIds
    }), [selectedStudentIds, setSelectedStudentIds]);

    // Sử dụng tCommon thay vì t
    if (studentsQuery.isLoading || facultiesQuery.isLoading || programsQuery.isLoading) {
        return <p>{tCommon("loading")}</p>;
    }

    if (studentsQuery.isError) {
        return <p>{studentsQuery.error.message || tCommon("loadError")}</p>;
    }

    if (facultiesQuery.isError || programsQuery.isError) {
        return <p>{tCommon("systemError")}</p>;
    }

    return (
        <StudentDataContext.Provider value={studentDataContextValue}>
            <StudentActionContext.Provider value={studentActionContextValue}>
                <FacultyContext.Provider value={facultyContextValue}>
                    <ProgramContext.Provider value={programContextValue}>
                        <StudentSelectionContext.Provider value={selectionContextValue}>
                            {children}
                        </StudentSelectionContext.Provider>
                    </ProgramContext.Provider>
                </FacultyContext.Provider>
            </StudentActionContext.Provider>
        </StudentDataContext.Provider>
    );
}
// Custom hooks
function useStudentsDataContext() {
    const context = useContext(StudentDataContext);
    if (!context) throw new Error('useStudentsDataContext must be used within StudentProvider');
    return context;
}

function useStudentsActionContext() {
    const context = useContext(StudentActionContext);
    if (!context) throw new Error('useStudentsActionContext must be used within StudentProvider');
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

function StudentPersonalInfoDisplay({ student }: { student: Student }) {
    const flattedStudent = flattenStudent(student);
    type InfoItemProps = {
        icon: React.ReactNode;
        value: string;
        label?: string;
        fullRow?: boolean;
    };

    const InfoItem = ({ icon, value, label, fullRow }: InfoItemProps) => (
        <div className={`flex items-center text-gray-500  ${fullRow ? "col-span-2" : ""}`}>
            {icon}
            <span className="whitespace-nowrap text-base font-medium text-gray-800">
                {label ? `${label} ` : ""}
                {value}
            </span>
        </div>
    );
    const renderStudentInfo = () => {
        const genderIcon =
            flattedStudent.gender === "Nam" ? (
                <MaleIcon className="w-6 h-6 mr-2" />
            ) : flattedStudent.gender === "Nữ" ? (
                <FemaleIcon className="w-6 h-6 mr-2" />
            ) : (
                <TransgenderIcon className="w-6 h-6 mr-2" />
            );

        const items: InfoItemProps[] = [
            { icon: <PermIdentityIcon className="w-6 h-6 mr-2" />, value: flattedStudent.fullName },
            { icon: <EnvelopeIcon className="w-6 h-6 mr-2" />, value: flattedStudent.email },
            { icon: <CakeIcon className="w-6 h-6 mr-2" />, value: flattedStudent.dateOfBirth },
            { icon: genderIcon, value: flattedStudent.gender },
            { icon: <PhoneIcon className="w-6 h-6 mr-2" />, value: flattedStudent.phoneNumber },
            { icon: <GlobeAsiaAustraliaIcon className="w-6 h-6 mr-2" />, value: flattedStudent.nationality },
            {
                icon: <MapPinIcon className="w-6 h-6 mr-2" />,
                label: "Địa chỉ nhận thư:",
                value: flattedStudent.mailAddress,
                fullRow: true,
            },
            {
                icon: <MapPinIcon className="w-6 h-6 mr-2" />,
                label: "Địa chỉ thường trú:",
                value: flattedStudent.permanentAddress,
                fullRow: true,
            },
            {
                icon: <MapPinIcon className="w-6 h-6 mr-2" />,
                label: "Địa chỉ tạm trú:",
                value: flattedStudent.temporaryResidenceAddress,
                fullRow: true,
            },
            {
                icon: <BrandingWatermarkIcon className="w-6 h-6 mr-2" />,
                value: flattedStudent.identityDocuments,
                fullRow: true,
            },
        ];

        return items.map((item, index) => <InfoItem key={index} {...item} />);
    };

    return (
        <div className="grid grid-cols-2 gap-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {renderStudentInfo()}
        </div>
    );
}
function StudentAcademicInfDisplay({ student }: { student: Student }) {
    const { t: tStudent } = useTranslation('student');
    const { programs } = useProgramsContext();
    const { faculties } = useFacultiesContext();
    const facultyName = faculties.find(faculty => faculty.facultyCode === student.facultyCode)?.name;
    const programName = programs.find(program => program.programCode === student.programCode)?.name;

    const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-base font-medium text-gray-800">{value}</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <InfoRow label={tStudent(studentFieldKeys.facultyCode)} value={facultyName} />
            <InfoRow label={tStudent(studentFieldKeys.programCode)} value={programName} />
            <InfoRow label={tStudent(studentFieldKeys.cohortYear)} value={student.cohortYear} />
            <InfoRow label={tStudent(studentFieldKeys.status)} value={student.status} />
        </div>
    );
}
interface StudentUpdate {
    student: Student
    register: UseFormRegister<Partial<Student>>
    setValue: UseFormSetValue<Partial<Student>>
    control: Control<Partial<Student>, any, Partial<Student>>
}
function StudentPersonalInfoUpdate({ student, register, setValue, control }: StudentUpdate) {
    const { t: tStudent } = useTranslation('student');
    const [phoneNumber, setPhoneNumber] = useState<string>(student.phoneNumber);
    useEffect(() => {
        setValue("fullName", student.fullName);
        setValue("dateOfBirth", student.dateOfBirth);
        setValue("email", student.email);
        setValue("nationality", student.nationality);
        setValue("gender", student.gender);
        setValue("phoneNumber", student.phoneNumber);
    }, [student, setValue]);

    useEffect(() => {
        if (phoneNumber) {
            setValue("phoneNumber", phoneNumber);
        }
    }, [phoneNumber, setValue]);
    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            {/*Họ và tên*/}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.fullName)}</FormLabel>
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
                        <FormLabel>{tStudent(studentFieldKeys.gender)}</FormLabel>
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
                <FormLabel>{tStudent(studentFieldKeys.dateOfBirth)}</FormLabel>
                <Input
                    type="date"
                    {...register("dateOfBirth", { required: true })}
                />
            </FormControl>

            {/*Email*/}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.email)}</FormLabel>
                <Input
                    type="email"
                    {...register("email", { required: true })}
                />
            </FormControl>

            {/* Số điện thoại */}
            <PhoneInputSelectDropDown phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />

            {/*Quốc gia*/}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.nationality)}</FormLabel>
                <Input
                    type="text"
                    {...register("nationality", { required: true })}
                />
            </FormControl>
        </div>
    );
}

function StudentAcademicInfUpdate({ student, register, setValue }: StudentUpdate) {
    const { faculties } = useFacultiesContext();
    const { programs } = useProgramsContext();
    const { t: tStudent } = useTranslation('student');

    useEffect(() => {
        setValue("facultyCode", student.facultyCode);
        setValue("programCode", student.programCode);
        setValue("cohortYear", student.cohortYear);
        setValue("status", student.status);
    }, [student, setValue]);

    return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            {/*Khoa*/}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.facultyCode)}</FormLabel>
                <Select
                    defaultValue={student.facultyCode}
                    {...register("facultyCode", { required: true })}
                    onChange={(e, newValue) => setValue("facultyCode", newValue as string)}
                >
                    {faculties.map((faculty) => (
                        <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                            {faculty.name}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            {/* Chương trình */}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.programCode)}</FormLabel>
                <Select
                    defaultValue={student.programCode}
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
                <FormLabel>{tStudent(studentFieldKeys.cohortYear)}</FormLabel>
                <Input
                    type="number"
                    defaultValue={student.cohortYear}
                    {...register("cohortYear", {
                        required: true,
                        valueAsNumber: true,
                    })}
                />
            </FormControl>

            {/*Tình trạng*/}
            <FormControl required>
                <FormLabel>{tStudent(studentFieldKeys.programCode)}</FormLabel>
                <Select
                    defaultValue={student.status}
                    {...register("status", { required: true })}
                    onChange={(e, newValue) => setValue("status", newValue as StudentStatus)}
                >
                    {Object.values(StudentStatus).map((status) => (
                        <Option key={status} value={status}>
                            {status}
                        </Option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}


function StudentDetailModal({ student, setSelectedStudent, isOpen, setIsOpen }
    : {
        student: Student, setSelectedStudent: React.Dispatch<React.SetStateAction<Student | null>>
        isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) {

    const { t: tStudent } = useTranslation('student');
    const { t: tCommon } = useTranslation('common');
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const { handleUpdate } = useStudentsActionContext();
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const { register, getValues, setValue, control, reset } = useForm<Partial<Student>>();
    const onUpdateSubmit = async () => {
        const updatedData = getValues();
        const result = await handleUpdate(student.id, updatedData);
        if (result) {
            setSelectedStudent({ ...student, ...updatedData });
            setIsUpdateOpen(false);
        }
    }

    if (!isOpen) return null;
    return (
        <Modal
            open={isOpen}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    setIsOpen(false);
                }
            }}
        >
            <ModalDialog className="w-[1000px] h-[90vh] max-w-full md:max-w-[90%] mx-auto overflow-x-auto overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 cursor-pointer"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>
                <Typography level="h4">{tStudent(studentFieldKeys.studentCode)}: {student.studentCode}</Typography>
                <Tabs defaultValue={0}
                    className="flex flex-col flex-1 overflow-hidden"
                    onChange={() => {
                        reset();
                        setIsUpdateOpen(false);
                    }}>
                    <TabList >
                        <>
                            <Tab>{lang === 'en' ? 'Personal Information' : 'Thông tin cá nhân'}</Tab>
                            <Tab>{lang === 'en' ? 'Academic Information' : 'Thông tin học vụ'}</Tab>
                        </>
                    </TabList>
                    <TabPanel value={0} className="flex-1 overflow-auto">
                        {isUpdateOpen ? (
                            <StudentPersonalInfoUpdate
                                student={student}
                                register={register}
                                setValue={setValue}
                                control={control}
                            />
                        ) : (
                            <StudentPersonalInfoDisplay student={student} />
                        )}
                    </TabPanel>
                    <TabPanel value={1} className="flex-1 overflow-auto">
                        {isUpdateOpen ? (
                            <StudentAcademicInfUpdate student={student}
                                register={register}
                                setValue={setValue}
                                control={control}
                            />
                        ) : (
                            <StudentAcademicInfDisplay student={student} />
                        )}
                    </TabPanel>
                    {!isUpdateOpen && (
                        <div className="flex justify-end mt-auto">
                            <Button
                                variant="solid"
                                color="neutral"
                                startDecorator={<PencilSquareIcon className="w-5 h-5" />}
                                onClick={() => setIsUpdateOpen(true)}
                            >
                                {tCommon('edit')}
                            </Button>
                        </div>
                    )}
                    {
                        isUpdateOpen && (
                            <div className="flex gap-2 justify-end mt-auto">
                                <Button
                                    variant="solid"
                                    color="danger"
                                    startDecorator={<XMarkIcon className="w-5 h-5" />}
                                    onClick={() => setIsUpdateOpen(false)}
                                    className="w-fit"
                                >
                                    {tCommon('cancel')}
                                </Button>
                                <Button
                                    variant="solid"
                                    color="primary"
                                    startDecorator={<CheckIcon className="w-5 h-5" />}
                                    onClick={() => onUpdateSubmit()}
                                    className="w-fit"
                                >
                                    {tCommon('save')}
                                </Button>
                            </div>
                        )
                    }
                </Tabs>
            </ModalDialog>
        </Modal >
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
    const { t: tStudent } = useTranslation('student');
    const { students } = useStudentsDataContext()
    const { selectedStudentIds, setSelectedStudentIds } = useStudentSelectionContext()

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

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
                                    checked={selectedStudentIds.length > 0 && selectedStudentIds.length == students.length}
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
                            {(Object.keys(studentFieldWidths) as (keyof typeof studentFieldKeys)[]).map(key => (
                                <th
                                    key={key}
                                    className={`px-4 py-2 text-left font-semibold select-text ${studentFieldWidths[key] ?? ''}`}
                                >
                                    {tStudent(studentFieldKeys[key])}
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student: Student) => (
                            <Fragment key={student.id} >
                                <tr className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setIsDetailOpen(true);
                                    }}
                                >
                                    <td onClick={(e) => { e.stopPropagation(); }}>
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
                            </Fragment>
                        ))}
                    </tbody>
                </Table>
            </Sheet >
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                    isOpen={isDetailOpen}
                    setIsOpen={setIsDetailOpen}
                />
            )}
        </div >
    );
}

//Search
function Search() {
    const { t: tCommon } = useTranslation('common');

    const { i18n } = useTranslation();
    const lang = i18n.language;

    const { handleSearch } = useStudentsActionContext()
    const { faculties } = useFacultiesContext();
    const { programs } = useProgramsContext();
    const [searchType, setSearchType] = useState("studentCode");
    const { register, getValues, control, watch, reset, resetField, unregister } = useForm<Partial<Student>>();
    const fullNameWatch = watch("fullName");
    const cohortYearWatch = watch("cohortYear");
    useEffect(() => {
        reset();
    }, [searchType]);

    const onSearch = () => {
        console.log(getValues())
        handleSearch(getValues())
    }

    return (
        <Stack spacing={2} className="border shadow-md rounded-md p-2 gap-4 pt-6 pb-6">
            <RadioGroup
                orientation="horizontal"
                value={searchType}
                onChange={(event) => setSearchType(event.target.value)}
            >
                <Radio value="studentCode" label={lang === 'en' ? 'Search by Student ID' : 'Tìm theo MSSV'} />
                <Radio value="advanced" label={lang === 'en' ? 'Advanced Search' : 'Tìm kiếm nâng cao'} />
            </RadioGroup>
            <div className="flex flex-col md:flex-row gap-2 ">
                {searchType === 'studentCode' && (
                    <>
                        <Input
                            className="flex-5/6 !h-10"
                            placeholder="VD: 22120081"
                            {...register("studentCode")}
                        />
                    </>
                )}

                {searchType === "advanced" && (
                    <div className="flex gap-4 flex-5/6 flex-col md:flex-row">

                        {/*fullName*/}
                        <FormControl>
                            <div className="relative">
                                <Input
                                    className="w-full"
                                    placeholder="Nhập tên"
                                    type="text"
                                    {...register("fullName")}
                                />
                                {
                                    fullNameWatch && (
                                        <XMarkIcon
                                            className="absolute w-4 h-4 right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                                            onClick={() => {
                                                resetField("fullName");
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </FormControl>

                        {/*facultyCode*/}
                        <Controller
                            name="facultyCode"
                            control={control}
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <Select
                                        {...field}
                                        value={field.value ?? null}
                                        onChange={(e, newValue) => field.onChange(newValue)}
                                        placeholder="-- Chọn khoa --"
                                        className="w-full"
                                    >
                                        {faculties.map((faculty) => (
                                            <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                                                {faculty.facultyCode}
                                            </Option>
                                        ))}
                                    </Select>
                                    {field.value && (
                                        <XMarkIcon
                                            className="absolute w-4 h-4 right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                                            onClick={() => {
                                                unregister("facultyCode");
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {/*programCode*/}
                        <Controller
                            name="programCode"
                            control={control}
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <Select
                                        {...field}
                                        value={field.value ?? null}
                                        onChange={(e, newValue) => field.onChange(newValue)}
                                        placeholder="-- Chọn CTĐT --"
                                        className="w-full"
                                    >
                                        {programs.map((program) => (
                                            <Option key={program.programCode} value={program.programCode}>
                                                {program.programCode}
                                            </Option>
                                        ))}
                                    </Select>
                                    {field.value && (
                                        <XMarkIcon
                                            className="absolute w-4 h-4 right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                                            onClick={() => {
                                                resetField("programCode")
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {/*cohortYear*/}
                        <FormControl>
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="chọn năm học"
                                    {...register("cohortYear")}
                                />
                                {
                                    cohortYearWatch && (
                                        <XMarkIcon
                                            className="absolute w-4 h-4 right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                                            onClick={() => {
                                                resetField("cohortYear");
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </FormControl>
                    </div>
                )}
                <div className="flex flex-1/6 justify-center ">
                    <Button
                        variant="solid"
                        color="primary"
                        onClick={onSearch}
                        className="w-full"
                    >
                        {tCommon('search')}
                    </Button>
                </div>
            </div>
        </Stack>
    );
}


function PhoneInputSelectDropDown({ phoneNumber, setPhoneNumber }: { phoneNumber?: string, setPhoneNumber: (value: string) => void }) {
    const [isFocused, setIsFocused] = useState(false);
    const { t: tStudent } = useTranslation('student');

    return (
        <FormControl required>
            <FormLabel>{tStudent(studentFieldKeys.phoneNumber)}</FormLabel>
            <PhoneInput
                country={'vn'}
                value={phoneNumber}
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
    const { t: tStudent } = useTranslation('student');
    const { t: tCommon } = useTranslation('common');
    const { i18n } = useTranslation();
    const lang = i18n.language;

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
        setDocumentData((prev) => {
            const newData = {
                ...prev,
                [key]: value,
                type: documentType,
            };
            setValue('identityDocuments', [newData as IdentityDocument]);
            return newData;
        });
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
                <DialogTitle>{lang === 'en' ? 'Create New Student' : 'Tạo sinh viên mới'}</DialogTitle>
                <DialogContent>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onCreate();
                            }}
                            autoComplete="on"
                        >
                            <p className="text-base mb-2">{tCommon('completeAllInf')}</p>
                            <div className="m-2 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* MSSV */}
                                <FormControl required>
                                    <FormLabel>{tStudent(studentFieldKeys.studentCode)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("studentCode", { required: true })}
                                    />
                                </FormControl>

                                {/*Họ và tên*/}
                                <FormControl required>
                                    <FormLabel>{tStudent(studentFieldKeys.fullName)}</FormLabel>
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
                                            <FormLabel>{tStudent(studentFieldKeys.gender)}</FormLabel>
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
                                    <FormLabel>{tStudent(studentFieldKeys.dateOfBirth)}</FormLabel>
                                    <Input
                                        type="date"
                                        {...register("dateOfBirth", { required: true })}
                                    />
                                </FormControl>

                                {/*Email*/}
                                <FormControl required>
                                    <FormLabel>{tStudent(studentFieldKeys.email)}</FormLabel>
                                    <Input
                                        type="email"
                                        {...register("email", { required: true })}
                                    />
                                </FormControl>

                                {/* Số điện thoại */}
                                <PhoneInputSelectDropDown setPhoneNumber={setPhoneNumber} />

                                {/*Quốc gia*/}
                                <FormControl required className="sm:col-span-2">
                                    <FormLabel>{tStudent(studentFieldKeys.nationality)}</FormLabel>
                                    <Input
                                        type="text"
                                        {...register("nationality", { required: true })}
                                    />
                                </FormControl>

                                {/* Các trường địa chỉ */}
                                {["mailAddress", "temporaryResidenceAddress", "permanentAddress"].map((addressType) => (
                                    <FormControl className="sm:col-span-2" key={addressType}>
                                        <FormLabel>{studentFieldKeys[addressType as keyof typeof studentFieldKeys]}</FormLabel>
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
                                    <p>{
                                        lang === 'en' ? "Please choose one of three indentity documents" :
                                            "Chọn 1 trong 3 loại giấy tờ tùy thân"
                                    }</p>
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

                            <div className="m-2 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {/* Khoa */}
                                <FormControl required>
                                    <FormLabel>{tStudent(studentFieldKeys.facultyCode)}</FormLabel>
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
                                    <FormLabel>{tStudent(studentFieldKeys.programCode)}</FormLabel>
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
                                    <FormLabel>{tStudent(studentFieldKeys.cohortYear)}</FormLabel>
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
                                    {tCommon('save')}
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
    const { t: tCommon } = useTranslation('common');
    const { handleCreate } = useStudentsActionContext();
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
                {tCommon('add')}
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

function StudentsRemoveButton() {
    const { t: tCommon } = useTranslation('common');
    const { handleRemoveStudents } = useStudentsActionContext();
    const { selectedStudentIds } = useStudentSelectionContext();
    const onRemove = () => {
        handleRemoveStudents(selectedStudentIds);
    };
    return (
        <Button
            variant="solid"
            color="danger"
            startDecorator={<TrashIcon className="w-5 h-5" />}
            onClick={onRemove}
            className="w-fit"
        >
            {selectedStudentIds.length > 0
                ? tCommon('delete') + ' ' + selectedStudentIds.length
                : tCommon('delete')}
        </Button>
    );
}


function StudentPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    const { page, limit, total } = useStudentsDataContext()
    const { handlePageChange } = useStudentsActionContext()
    return (
        <main className="flex flex-col">
            <h2 className="text-2xl font-bold">
                {lang === 'en' ? "Student Management" : "Quản lý sinh viên"
                }</h2>

            <section className="flex items-center justify-between w-full mt-4 gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <StudentsRemoveButton />
                    <StudentCreateFormContainer />
                </div>
                <ImportButtonStudent />
                {/* <ExportButtonStudent searchQuery={searchQuery} /> */}
            </section>

            <section className="mt-4">
                <Search />
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
