import React, { useState, Dispatch, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form"
import { Class, ClassFieldKeys } from "../types/class";
import { ClassRegistration, ClassRegistrationFieldKeys } from "../types/classRegistration";

import { useError } from "../context/ErrorContext";
import { useClasses, useRegisterClass } from "../hooks/useClasses";
import { useLang, useMultiTranslation } from "../utils/translation";
import { Table, Sheet, Option, Modal, ModalDialog, Button, Select, FormControl, FormLabel, Input } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import { Mode } from "@mui/icons-material";
import { useCourses } from "../hooks/useCourses";
import { Course } from "../types/course";

function CreateClassRegistrationModal({
    classCode,
    isOpen,
    setIsOpen,
}: {
    classCode: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const lang = useLang();
    const { tClassRegistration, tCommon } = useMultiTranslation();
    const [studentCode, setStudentCode] = useState<string>("");
    const { registerClassMutation } = useRegisterClass(classCode);
    const { showError } = useError();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (!studentCode.trim()) {
                showError("Missing required fields");
                return;
            }
            await registerClassMutation.mutateAsync({ studentCode, classCode });
            setIsOpen(false);
            setStudentCode("");
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog className="w-[520px] h-[90vh] max-w-full md:max-w-[90%] mx-auto overflow-x-auto overflow-y-auto">
                <h3 className="text-xl">
                    {lang === "en"
                        ? "Register a class for a student"
                        : "Đăng ký lớp cho sinh viên"}
                </h3>
                <FormControl required>
                    <FormLabel>
                        {tClassRegistration(ClassRegistrationFieldKeys.studentCode)}
                    </FormLabel>
                    <Input
                        value={studentCode}
                        onChange={(e) => setStudentCode(e.target.value)}
                    />
                </FormControl>
                <div className="flex justify-center mt-6">
                    <Button
                        variant="solid"
                        color="primary"
                        className="w-4/5"
                        onClick={handleSubmit}
                    >
                        {tCommon("save")}
                    </Button>
                </div>
            </ModalDialog>
        </Modal>
    );
}


function CreateClassRegistrationButton({ classCode }: { classCode: string }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const lang = useLang();
    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<AddIcon className="w-5 h-5" />}
                className="w-fit"
                onClick={() => setIsOpen(true)}
            >
                {lang === "en" ? "Create registration" : "Đăng ký lớp cho sinh viên"}
            </Button>
            {isOpen && (
                <CreateClassRegistrationModal classCode={classCode} isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );
}

function ClassRegistrationRow({ classRegistration }: { classRegistration: ClassRegistration }) {
    return (
        <tr>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classRegistration.studentCode}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classRegistration.grade}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classRegistration.note}</td>
        </tr>
    );
}

function ClassRegistrationModal({ classItem, isOpen, setIsOpen }: {
    classItem: Class,
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    const { tClassRegistration } = useMultiTranslation();
    const headers = Object.values(ClassRegistrationFieldKeys).filter(key => key !== "classCode");

    const { classRegistrationQuery } = useRegisterClass(classItem.classCode);
    const classRegistrations: ClassRegistration[] = classRegistrationQuery.data?.classRegistrations || [];
    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog className="flex flex-col w-[1000px] h-[90vh] max-w-full md:max-w-[90%] mx-auto overflow-x-auto overflow-y-auto">
                <h3 className="text-xl">{classItem.classCode}</h3>
                <div className="flex gap-4">
                    <CreateClassRegistrationButton classCode={classItem.classCode} />
                </div>
                <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
                    <Table>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className="capitalize">{tClassRegistration(header)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classRegistrations.map((classReg) => {
                                return (
                                    <ClassRegistrationRow key={classReg.studentCode} classRegistration={classReg} />
                                );
                            })}
                        </tbody>

                    </Table>
                </Sheet>
            </ModalDialog>
        </Modal>

    );
}

function ClassTableRow({ classItem }: { classItem: Class }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <>
            <tr className="hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsOpen(true)}>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.classCode}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.courseCode}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.semester}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.academicYear}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.instructor}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.maxStudents}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.room}</td>
                <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{classItem.schedule}</td>
            </tr>
            {
                isOpen && <ClassRegistrationModal classItem={classItem} isOpen={isOpen} setIsOpen={setIsOpen} />
            }
        </>

    );
}

function ClassesTable() {
    const { tClass } = useMultiTranslation();
    const headers = Object.values(ClassFieldKeys);
    const { classesQuery } = useClasses();
    const classes: Class[] = classesQuery.data?.classes || [];

    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="capitalize">{tClass(header)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {classes.map((classItem) => (
                        <ClassTableRow key={classItem.id} classItem={classItem} />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}

function CreateClassModal({ isOpen, setIsOpen }: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    const lang = useLang();
    const { tClass, tCommon } = useMultiTranslation();
    const { reset, register, getValues, control } = useForm<Partial<Class>>();
    const { createClassQuery } = useClasses();
    const { showError } = useError();

    const { coursesQuery } = useCourses();
    const courses: Course[] = coursesQuery.data?.courses || [];

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await createClassQuery.mutateAsync(getValues());
            setIsOpen(false);
            reset();
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog className="w-[520px] h-[90vh] max-w-full md:max-w-[90%] mx-auto overflow-x-auto overflow-y-auto">
                <h3 className="text-xl">{lang === "en" ? "Create a class" : "Tạo lớp mới"}</h3>
                <div className="grid grid-cols-2 gap-2">

                    <FormControl required>
                        <FormLabel>
                            {tClass(ClassFieldKeys.classCode)}
                        </FormLabel>
                        <Input
                            {...register('classCode')}
                        />
                    </FormControl>

                    <Controller
                        name="courseCode"
                        control={control}
                        render={({ field }) => (
                            <FormControl required>
                                <FormLabel>{tClass(ClassFieldKeys.courseCode)}</FormLabel>
                                <Select
                                    {...field}
                                    value={field.value}
                                    onChange={(e, newValue) => field.onChange(newValue)}
                                >
                                    {courses.map((course) => (
                                        <Option key={course.courseCode} value={course.courseCode}>
                                            {course.courseCode}
                                        </Option>
                                    ))}

                                </Select>
                            </FormControl>
                        )}
                    />
                    <FormControl required>
                        <FormLabel>{tClass(ClassFieldKeys.academicYear)}</FormLabel>
                        <Input
                            type="number"
                            defaultValue={new Date().getFullYear()}
                            {...register("academicYear", { valueAsNumber: true, })}
                        />
                    </FormControl>

                    <Controller
                        name="semester"
                        control={control}
                        render={({ field }) => (
                            <FormControl required>
                                <FormLabel>{tClass(ClassFieldKeys.semester)}</FormLabel>
                                <Select
                                    {...field}
                                    value={field.value}
                                    onChange={(e, newValue) => field.onChange(newValue)}
                                >
                                    <Option value="Kỳ 1">Kỳ 1</Option>
                                    <Option value="Kỳ 2">Kỳ 2</Option>
                                    <Option value="Kỳ 3">Kỳ 3</Option>
                                </Select>
                            </FormControl>
                        )}
                    />

                    <FormControl required>
                        <FormLabel>{tClass(ClassFieldKeys.instructor)}</FormLabel>
                        <Input
                            type="text"
                            {...register("instructor")}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>{tClass(ClassFieldKeys.maxStudents)}</FormLabel>
                        <Input
                            type="number"
                            {...register("maxStudents")}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>{tClass(ClassFieldKeys.schedule)}</FormLabel>
                        <Input
                            type="text"
                            {...register("schedule")}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>{tClass(ClassFieldKeys.room)}</FormLabel>
                        <Input
                            type="text"
                            {...register("room")}
                        />
                    </FormControl>
                </div>
                <div className="flex justify-center mt-8">
                    <Button
                        variant="solid"
                        color="primary"
                        className="w-1/2"
                        onClick={handleSubmit}
                    >
                        {tCommon('save')}
                    </Button>
                </div>
            </ModalDialog>
        </Modal>
    );
}

function CreateClassButton() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const lang = useLang();
    return (
        <>
            <Button
                variant="solid"
                color="success"
                startDecorator={<AddIcon className="w-5 h-5" />}
                className="w-fit"
                onClick={() => setIsOpen(true)}
            >
                {lang === "en" ? "Create a class" : "Tạo lớp"}
            </Button>
            {isOpen && (
                <CreateClassModal isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );
}

function ClassesPage() {
    const lang = useLang();
    return (
        <main className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">
                {lang === 'en' ? 'Manage Classes' : 'Quản lý lớp học'}
            </h2>
            <section className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <CreateClassButton />
                </div>
                <ClassesTable />
            </section>
        </main>
    );
}

export default ClassesPage;
