import { useState, useEffect, Dispatch, SetStateAction, useContext, createContext, ReactNode, useMemo, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form"
import { useTranslation } from 'react-i18next';
import { useCourses } from '../hooks/useCourses'
import { Course, CourseFieldKeys } from '../types/course'

import { useFaculties } from '../hooks/useFaculties';

import { useError } from "../context/ErrorContext";

import {
    Sheet, Table, Modal, Button, ModalDialog, DialogTitle, DialogContent,
    FormControl, FormLabel, Input, Select, Option, RadioGroup, Radio, Textarea
} from '@mui/joy';
import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import ToggleOnOff from '../components/button/toggleOnOFF';
import { MultiSelect } from '../components/select/multiSelect';
import { Faculty } from '../types/faculty';

const CoursesDataContext = createContext<{
    courses: Course[],
} | null>(null);

const CoursesActionContext = createContext<{
    handleUpdate: (courseId: string, updatedData: Partial<Course>) => Promise<boolean>;
    handleDelete: () => Promise<boolean>;
    handleCreate: (newCourse: Partial<Course>) => Promise<boolean>;
} | null>(null);

const CourseSelectionContext = createContext<{
    selectedCourseId: string | null;
    setSelectedCourseId: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

const FacultiesDataContext = createContext<{
    faculties: Faculty[]
} | null>(null);

function CourseProvider({ children }: { children: ReactNode }) {
    const { showError } = useError();
    const { coursesQuery, createCourse, removeCourse, updateCourse } = useCourses();
    const { facultiesQuery } = useFaculties();

    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const handleCreate = useCallback(async (newCourse: Partial<Course>): Promise<boolean> => {
        try {
            await createCourse.mutateAsync(newCourse);
            return true;
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [createCourse, showError])

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {

            if (!selectedCourseId) {
                showError("Vui lòng chọn khoá học cần xoá");
                return false;
            }

            try {
                await removeCourse.mutateAsync(selectedCourseId);
                setSelectedCourseId(null);
                return true;
            } catch (error: any) {
                showError(error.message);
                return false;
            }

        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [removeCourse, selectedCourseId, showError]);

    const handleUpdate = useCallback(async (courseId: string, updatedCourse: Partial<Course>): Promise<boolean> => {
        try {
            await updateCourse.mutateAsync({ courseId, updatedCourse });
            return true;
        } catch (error: any) {
            showError(error.message);
            return false;
        }
    }, [updateCourse, showError])

    const coursestDataContextValue = useMemo(() => ({
        courses: coursesQuery.data?.courses || []
    }), [coursesQuery.data])

    const coursesActionContextValue = useMemo(() => ({
        handleUpdate,
        handleDelete,
        handleCreate,
    }), [handleUpdate, handleDelete, handleCreate])

    const courseSelectionContextValue = useMemo(() => ({
        selectedCourseId,
        setSelectedCourseId
    }), [selectedCourseId]);

    const facultiestDataContextValue = useMemo(() => ({
        faculties: facultiesQuery.data?.faculties || []
    }), [facultiesQuery.data])

    if (coursesQuery.isLoading || facultiesQuery.isLoading) {
        return <p>Đang tải dữ liệu...</p>;
    } else if (coursesQuery.error || facultiesQuery.error) {
        return <p>Lỗi không tải được dữ liệu</p>
    }

    return (
        <CoursesDataContext.Provider value={coursestDataContextValue}>
            <CoursesActionContext.Provider value={coursesActionContextValue}>
                <CourseSelectionContext.Provider value={courseSelectionContextValue}>
                    <FacultiesDataContext.Provider value={facultiestDataContextValue}>
                        {children}
                    </FacultiesDataContext.Provider>
                </CourseSelectionContext.Provider>
            </CoursesActionContext.Provider>
        </CoursesDataContext.Provider>
    )

}

//Custom hook
function useCoursesDataContext() {
    const context = useContext(CoursesDataContext);
    if (!context) throw new Error('useCoursesDataContext must be used within CourseProvider');
    return context;
}

function useCoursesActionContext() {
    const context = useContext(CoursesActionContext);
    if (!context) throw new Error('useCoursesActionContext must be used within CourseProvider');
    return context;
}

function useCourseSelectionContext() {
    const context = useContext(CourseSelectionContext);
    if (!context) throw new Error('CourseSelectionContext must be used within CourseProvider');
    return context;
}

function useFacultiesDataContext() {
    const context = useContext(FacultiesDataContext);
    if (!context) throw new Error('useFacultiesDataContext must be used within CourseProvider');
    return context;
}

function CourseCreateFormModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const { t: tCourse } = useTranslation('course');
    const { register, getValues, control } = useForm<Partial<Course>>();
    const { faculties } = useFacultiesDataContext();
    const { courses } = useCoursesDataContext();
    const { handleCreate } = useCoursesActionContext();
    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const newCourse: Partial<Course> = {
            courseCode: getValues('courseCode'),
            name: getValues('name'),
            credits: getValues('credits'),
            facultyCode: getValues('facultyCode'),
            description: getValues('description'),
            prerequisiteCourseCode: getValues('prerequisiteCourseCode'),
        }
        const result = await handleCreate(newCourse)
        if (result) {
            setIsOpen(false);
        }
    }
    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog className='w-1/2'>
                <DialogTitle>Tạo khoá học mới</DialogTitle>
                <hr className="border-t border-gray-200 my-2" />
                <DialogContent>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <form onSubmit={onCreate}>
                            <div className="m-2 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Course Code */}
                                <FormControl required>
                                    <FormLabel>{tCourse(CourseFieldKeys.courseCode)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("courseCode", { required: true })}
                                    />
                                </FormControl>

                                {/* Course Name */}
                                <FormControl required>
                                    <FormLabel>{tCourse(CourseFieldKeys.name)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("name", { required: true })}
                                    />
                                </FormControl>

                                {/* Credits */}
                                <FormControl required>
                                    <FormLabel>{tCourse(CourseFieldKeys.credits)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="number"
                                        {...register("credits", { required: true })}
                                    />
                                </FormControl>

                                {/*Faculty Code*/}
                                <Controller
                                    name="facultyCode"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl required>
                                            <FormLabel>{tCourse(CourseFieldKeys.facultyCode)}</FormLabel>
                                            <Select
                                                {...field}
                                                value={field.value}
                                                onChange={(e, newValue) => field.onChange(newValue)}
                                            >
                                                {faculties.map((faculty) => (
                                                    <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                                                        {faculty.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />

                                {/*Description*/}
                                <FormControl required className="col-span-full">
                                    <FormLabel>{CourseFieldKeys.description}</FormLabel>
                                    <Textarea
                                        minRows={4}
                                        {...register("description", { required: true })}
                                    />

                                </FormControl>

                                {/* Prerequisite Course */}
                                <Controller
                                    name="prerequisiteCourseCode"
                                    control={control}
                                    render={({ field }) => {
                                        const courseOptions = courses.map((course) => ({
                                            label: course.courseCode,
                                            value: course.courseCode,
                                        }));

                                        return (
                                            <>
                                                <FormControl className="col-span-full">
                                                    <FormLabel>{CourseFieldKeys.prerequisiteCourseCode}</FormLabel>
                                                    <MultiSelect
                                                        {...field}
                                                        options={courseOptions}
                                                        onChange={(selectedOptions) => {
                                                            field.onChange(selectedOptions);
                                                        }}
                                                    />
                                                </FormControl>
                                            </>

                                        )
                                    }}
                                />


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

function CourseCreateButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<PlusIcon className="w-5 h-5" />}
                onClick={() => setIsOpen(true)}
                className="w-fit "
            >
                Tạo khóa học mới
            </Button>
            <CourseCreateFormModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>

    );
}

function CourseDeleteButton() {
    const { handleDelete } = useCoursesActionContext();
    return (
        <Button
            variant="solid"
            color="danger"
            startDecorator={<TrashIcon className="w-5 h-5" />}
            onClick={handleDelete}
            className="w-fit "
        >
            Xoá
        </Button>
    );
}

function CourseUpdateFormModal({ course, isOpen, setIsOpen }: { course: Course, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {
    const { t: tCourse } = useTranslation('course');
    const { register, getValues, control, reset } = useForm<Partial<Course>>();
    const { faculties } = useFacultiesDataContext();
    const { courses } = useCoursesDataContext();
    const { handleUpdate } = useCoursesActionContext();

    useEffect(() => {
        const { id, courseCode, ...rest } = course;
        reset(rest);
    }, [course, reset]);

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleUpdate(course.id, getValues());
        if (result) {
            setIsOpen(false);
        }
    }

    return (
        <Modal
            open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog className="w-1/2">
                <DialogTitle>{course.courseCode}</DialogTitle>
                <hr className="border-t border-gray-200 my-2" />
                <DialogContent>
                    <div className='overflow-y-auto'>
                        <form onSubmit={onUpdate}>
                            <div className="m-2 mb-4 grid grid-cols-1 gap-4">

                                {/* Course Name */}
                                <FormControl required>
                                    <FormLabel>{tCourse(CourseFieldKeys.name)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        defaultValue={course.name}
                                        {...register("name", { required: true })}
                                    />
                                </FormControl>

                                {/* Credits */}
                                <FormControl required>
                                    <FormLabel>{tCourse(CourseFieldKeys.credits)}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="number"
                                        defaultValue={course.credits}
                                        {...register("credits", { required: true })}
                                    />
                                </FormControl>

                                {/*Faculty Code*/}
                                <Controller
                                    name="facultyCode"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl required>
                                            <FormLabel>{tCourse(CourseFieldKeys.facultyCode)}</FormLabel>
                                            <Select
                                                {...field}
                                                defaultValue={course.facultyCode}
                                                value={field.value}
                                                onChange={(e, newValue) => field.onChange(newValue)}
                                            >
                                                {faculties.map((faculty) => (
                                                    <Option key={faculty.facultyCode} value={faculty.facultyCode}>
                                                        {faculty.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />

                                {/*Description*/}
                                <FormControl required className="col-span-full">
                                    <FormLabel>{tCourse(CourseFieldKeys.description)}</FormLabel>
                                    <Textarea
                                        minRows={4}
                                        defaultValue={course.description}
                                        {...register("description", { required: true })}
                                    />
                                </FormControl>

                                {/* Prerequisite Course */}
                                <Controller
                                    name="prerequisiteCourseCode"
                                    control={control}
                                    render={({ field }) => {
                                        const courseOptions = courses.map((course) => ({
                                            label: course.courseCode,
                                            value: course.courseCode,
                                        }));
                                        const initialSelectedOptions = course.prerequisiteCourseCode;
                                        return (
                                            <>
                                                <FormControl className="col-span-full">
                                                    <FormLabel>{tCourse(CourseFieldKeys.prerequisiteCourseCode)}</FormLabel>
                                                    <MultiSelect
                                                        {...field}
                                                        options={courseOptions}
                                                        initialSelectedOptions={initialSelectedOptions}
                                                        onChange={(selectedOptions) => {
                                                            field.onChange(selectedOptions);
                                                        }}
                                                    />
                                                </FormControl>
                                            </>
                                        )
                                    }}
                                />
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

interface CourseRowProps {
    index: number;
    course: Course;
}
function CourseRow({ index, course }: CourseRowProps) {
    const keyNames = Object.keys(CourseFieldKeys) as (keyof Course)[];
    const handleToggleActive = async () => {
        console.log(`Toggling active for course ${course.id}`);
    };
    return (
        <>
            <td className="px-4 py-2">{index + 1}</td>
            {keyNames.map((key) => (
                <td key={key} className="px-4 py-2 whitespace-nowrap">
                    {key === "isActive" ? (
                        <ToggleOnOff isOn={course.isActive} onToggle={handleToggleActive} />
                    ) : (
                        String(course[key])
                    )}
                </td>
            ))}
        </>
    );
}

function CourseTable() {
    const { t: tCourse } = useTranslation('course');
    const { selectedCourseId, setSelectedCourseId } = useCourseSelectionContext();
    const { courses } = useCoursesDataContext();
    const headers = ["STT", ...Object.values(CourseFieldKeys)];

    const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState<Course | null>(null);
    const [isUpdateModelOpen, setIsUpdateModelOpen] = useState<boolean>(false);
    return (
        <>
            <RadioGroup
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
            >
                <Table className="!table-auto !border-separate border border-slate-200 !rounded-lg w-full overflow-hidden">
                    <thead>
                        <tr>
                            <th className="w-12"></th>
                            {headers.map((header, index) => (
                                <th key={index} className="capitalize">{tCourse(header)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedCourseForUpdate(course);
                                    setIsUpdateModelOpen(true);
                                }}>
                                <td>
                                    <Radio
                                        value={course.id}
                                        checked={selectedCourseId === course.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCourseId(selectedCourseId === course.id ? null : course.id);
                                        }}
                                        slots={{
                                            radio: (props) => {
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
                                            icon: (props) => {
                                                const { ownerState } = props;
                                                return ownerState.checked ? (
                                                    <CheckIcon className={`absolute w-3.5 h-3.5 text-blue-700 transition-all duration-200 ease-in-out
                                                 ${ownerState?.checked ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                                                    />
                                                ) : null;
                                            },
                                        }}
                                    />

                                </td>
                                <CourseRow
                                    index={index}
                                    course={course}
                                />
                            </tr>))}
                    </tbody>
                </Table>
            </RadioGroup >
            {selectedCourseForUpdate && (
                <CourseUpdateFormModal
                    course={selectedCourseForUpdate}
                    isOpen={isUpdateModelOpen}
                    setIsOpen={setIsUpdateModelOpen}
                />
            )}
        </>

    );
}
function CoursePage() {
    return (
        <section className='flex flex-col gap-4'>
            <h2 className="text-2xl font-bold">Quản lý khóa học</h2>
            <div className="flex gap-2">
                <CourseDeleteButton />
                <CourseCreateButton />
            </div>
            <CourseTable />
        </section>
    )
}

function CoursePageContainer() {
    return (
        <CourseProvider>
            <CoursePage />
        </CourseProvider>
    );
}

export default CoursePageContainer;
