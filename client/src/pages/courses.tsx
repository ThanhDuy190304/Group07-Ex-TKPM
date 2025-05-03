import { useState, Dispatch, SetStateAction } from 'react';
import { useForm, UseFormRegister, Control, Controller } from "react-hook-form"
import { useCourses } from '../hooks/useCourses'
import { Course, KeyNameOfCourse } from '../types/course'

import { useFaculties } from '../hooks/useFaculties';

import { useError } from "../context/ErrorContext";


import {
    Sheet, Table, Modal, Button, ModalDialog, DialogTitle, DialogContent,
    FormControl, FormLabel, Input, Select, Option
} from '@mui/joy';
import { PencilSquareIcon, CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import ToggleOnOff from '../components/button/toggleOnOFF';
import { MultiSelect } from '../components/select/multiSelect';
import { Faculty } from '../types/faculty';



interface CourseCreateProps {
    courses: Course[],
    faculties: Faculty[],
    onCreate: () => Promise<void>;
    register: UseFormRegister<Partial<Course>>
    control: Control<Partial<Course>, any, Partial<Course>>
}

function CourseCreateFormModal({ courses, faculties, onCreate, register, control, isOpen, setIsOpen }: CourseCreateProps & { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }) {


    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog>
                <DialogTitle>Tạo khoá học mới</DialogTitle>
                <DialogContent>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <form onSubmit={onCreate}>
                            <div className="m-2 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Course Code */}
                                <FormControl required>
                                    <FormLabel>{KeyNameOfCourse.courseCode}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("courseCode", { required: true })}
                                    />
                                </FormControl>

                                {/* Course Name */}
                                <FormControl required>
                                    <FormLabel>{KeyNameOfCourse.name}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
                                        {...register("name", { required: true })}
                                    />
                                </FormControl>

                                {/* Course Name */}
                                <FormControl required>
                                    <FormLabel>{KeyNameOfCourse.credits}</FormLabel>
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
                                            <FormLabel>{KeyNameOfCourse.facultyCode}</FormLabel>
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
                                <FormControl required>
                                    <FormLabel>{KeyNameOfCourse.description}</FormLabel>
                                    <Input
                                        autoFocus
                                        type="text"
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
                                                <FormControl>
                                                    <FormLabel>{KeyNameOfCourse.prerequisiteCourseCode}</FormLabel>
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
function CourseCreateButton({ courses, faculties, register, control, onCreate }: CourseCreateProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<PlusIcon className="w-5 h-5" />}
                onClick={() => setIsOpen(true)}
                className="w-fit">
                Tạo khóa học mới
            </Button>
            <CourseCreateFormModal
                courses={courses}
                faculties={faculties}
                onCreate={onCreate}
                register={register}
                control={control}
                isOpen={isOpen}
                setIsOpen={setIsOpen} />
        </>

    );
}

interface CourseCreateContainerProps {
    courses: Course[],
    faculties: Faculty[],
    createCourse: (newCourse: Partial<Course>) => Promise<void>;
}
function CourseCreateContainer({ courses, faculties, createCourse }: CourseCreateContainerProps) {

    const { register, reset, getValues, setValue, control } = useForm<Partial<Course>>();
    const onCreate = async () => {
        const newCourse: Partial<Course> = {
            courseCode: getValues('courseCode'),
            name: getValues('name'),
            credits: getValues('credits'),
            facultyCode: getValues('facultyCode'),
            description: getValues('description'),
            prerequisiteCourseCode: getValues('prerequisiteCourseCode'),
        }
        await createCourse(newCourse)
        reset();
    }

    return (
        <CourseCreateButton
            courses={courses}
            faculties={faculties}
            onCreate={onCreate}
            register={register}
            control={control}
        />
    );
}

interface CourseRowProps {
    index: number;
    course: Course;
    removeCourse: (courseId: string) => void;
}
function CourseRow({ index, course, removeCourse }: CourseRowProps) {
    const keyNames = Object.keys(KeyNameOfCourse) as (keyof Course)[];
    const handleToggleActive = async () => {
        console.log(`Toggling active for course ${course.id}`);
    };
    return (
        <tr>
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
            <td className="px-4 py-2">
                <button
                    className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                    onClick={() => removeCourse(course.id)}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </td>
        </tr>

    );
}

interface CourseTableProps {
    courses: Course[];
    removeCourse: (courseId: string) => void;
}
function CourseTable({ courses, removeCourse }: CourseTableProps) {
    const headers = ["STT", ...Object.values(KeyNameOfCourse)];

    return (
        <Table className="!table-auto !border-separate border border-slate-200 !rounded-lg w-full overflow-hidden">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="capitalize">{header}</th>
                    ))}
                    <th className="w-12"></th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course, index) => (
                    <CourseRow key={course.id} index={index} course={course} removeCourse={removeCourse} />
                ))}
            </tbody>
        </Table>
    );
}

interface CourseContainerProps {
    courses: Course[];
    faculties: Faculty[];
    createCourse: (course: Partial<Course>) => void;
    removeCourse: (courseId: string) => void;
}
function CourseContainer({ courses, faculties, createCourse, removeCourse }: CourseContainerProps) {
    const { showError } = useError();

    const handleRemoveCourse = async (courseId: string) => {
        try {
            await removeCourse(courseId);
        } catch (error: any) {
            showError(error.message);
        }
    }

    const handleCreateCourse = async (newCourse: Partial<Course>) => {
        try {
            await createCourse(newCourse);
        } catch (error: any) {
            showError(error.message);
        }
    }

    return (
        <section className='flex flex-col gap-4'>
            <CourseCreateContainer
                courses={courses}
                faculties={faculties}
                createCourse={handleCreateCourse} />
            <CourseTable
                courses={courses}
                removeCourse={handleRemoveCourse} />
        </section>
    );

}

export default function CoursePage() {
    const { coursesQuery, createCourse, removeCourse } = useCourses();
    const { facultiesQuery } = useFaculties();
    if (coursesQuery.isLoading) {
        return <p>Đang tải dữ liệu...</p>;
    } else if (coursesQuery.error) {
        return <p>{coursesQuery.error.message}</p>;
    }

    const courses = coursesQuery.data.courses as Course[];
    const faculties = facultiesQuery.data.faculties as Faculty[];

    return (
        <main className="space-y-8">
            <h2 className="text-2xl font-bold">Quản lý khóa học</h2>
            <CourseContainer
                courses={courses}
                faculties={faculties}
                createCourse={createCourse.mutateAsync}
                removeCourse={removeCourse.mutateAsync}
            />
        </main>
    );

}

