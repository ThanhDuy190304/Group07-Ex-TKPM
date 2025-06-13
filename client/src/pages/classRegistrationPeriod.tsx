import { useState, Dispatch, SetStateAction } from 'react';
import { useForm, Controller } from "react-hook-form"
import { ClassRegistrationPeriod, ClassRegistrationPeriodFieldKeys } from "../types/classRegistrationPeriod";

import { useLang, useMultiTranslation } from "../utils/translation";

import { useClassRegistrationPeriods } from "../hooks/useClasses";

import { Table, Sheet, Option, Modal, ModalDialog, Button, Select, FormControl, FormLabel, Input } from "@mui/joy";
import ToggleOnOff from '../components/button/toggleOnOFF';

import AddIcon from "@mui/icons-material/Add";
import { useError } from '../context/ErrorContext';

function CreateClassRegistrationPeriodModal({ isOpen, setIsOpen }: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {

    const lang = useLang();
    const { tClassRegistrationPeriod } = useMultiTranslation();
    const { reset, register, getValues, control } = useForm<Partial<ClassRegistrationPeriod>>();
    const { createClassRegistrationPeriodMutation } = useClassRegistrationPeriods();
    const { showError } = useError();

    const handleSubmit = async () => {
        const values = getValues();
        console.log("Form values:", values);
        if (!values.startDateTime || !values.endDateTime || !values.semester || !values.academicYear) return;
        try {
            console.log("Creating class registration period with values:", values);
            await createClassRegistrationPeriodMutation.mutateAsync(values);
            reset();
            setIsOpen(false);
        }
        catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog>
                <h2 className="text-2xl font-bold mb-4">
                    {lang === 'en' ? 'Create Registration Period' : 'Tạo thời gian đăng ký lớp học'}
                </h2>
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    className="flex flex-col gap-4">
                    <Controller
                        name="semester"
                        control={control}
                        render={({ field }) => (
                            <FormControl required>
                                <FormLabel>{tClassRegistrationPeriod(ClassRegistrationPeriodFieldKeys.semester)}</FormLabel>
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
                        <FormLabel>{tClassRegistrationPeriod(ClassRegistrationPeriodFieldKeys.academicYear)}</FormLabel>
                        <Input
                            type="number"
                            defaultValue={new Date().getFullYear()}
                            {...register("academicYear", { valueAsNumber: true, })}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>{tClassRegistrationPeriod(ClassRegistrationPeriodFieldKeys.startDateTime)}</FormLabel>
                        <Input
                            type="datetime-local"
                            {...register("startDateTime")}
                        />
                    </FormControl>

                    <FormControl required>
                        <FormLabel>{tClassRegistrationPeriod(ClassRegistrationPeriodFieldKeys.endDateTime)}</FormLabel>
                        <Input
                            type="datetime-local"
                            {...register("endDateTime")}
                        />
                    </FormControl>

                    <Button type="submit" color="success" className="mt-6 w-full">
                        {lang === 'en' ? 'Create' : 'Tạo'}
                    </Button>
                </form>
            </ModalDialog>
        </Modal>
    );


}

function ClassRegistrationPeriodTableRow({ periodItem }: { periodItem: ClassRegistrationPeriod }) {

    const { updateClassRegistrationPeriodMutation } = useClassRegistrationPeriods();
    const { showError } = useError();

    const handleToggleActive = async () => {
        try {
            await updateClassRegistrationPeriodMutation.mutateAsync({
                id: periodItem.id,
                updatedData: {
                    isActive: !periodItem.isActive
                }
            });
        } catch (error: any) {
            showError(error.message);
        }
    };

    return (
        <tr>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{periodItem.id}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{periodItem.academicYear}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{periodItem.semester}</td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {new Date(periodItem.startDateTime).toLocaleString()}
            </td>
            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                {new Date(periodItem.endDateTime).toLocaleString()}
            </td>

            <td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                <ToggleOnOff
                    isOn={periodItem.isActive}
                    onToggle={handleToggleActive}
                />
            </td>
        </tr>
    );
}

function ClassRegistrationPeriodTable() {
    const { classRegistrationPeriodsQuery } = useClassRegistrationPeriods();
    const classRegistrationPeriods: ClassRegistrationPeriod[] = classRegistrationPeriodsQuery.data?.classRegistrationPeriods || [];

    const { tClassRegistrationPeriod } = useMultiTranslation();

    const headers = Object.values(ClassRegistrationPeriodFieldKeys);
    return (
        <Sheet className="flex-2" variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="capitalize">{tClassRegistrationPeriod(header)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {classRegistrationPeriods.map((periodItem) => (
                        <ClassRegistrationPeriodTableRow key={periodItem.id} periodItem={periodItem} />
                    ))}
                </tbody>
            </Table>
        </Sheet>
    );
}

function CreateRegistrationPeriodButton() {
    const [isOpen, setIsOpen] = useState(false);
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
                {lang === "en" ? "Make schedule for registrations" : "Tao thời gian đăng ký lớp học"}
            </Button>
            {isOpen && (
                <CreateClassRegistrationPeriodModal isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </>
    );

}

function ClassRegistrationPeriodPage() {
    const lang = useLang();
    return (
        <main className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">
                {lang === 'en' ? 'Manage Registration Time' : 'Quản lý thời gian đăng ký lớp học'}
            </h2>
            <section className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <CreateRegistrationPeriodButton />
                </div>
                <ClassRegistrationPeriodTable />
            </section>
        </main>
    );
}

export default ClassRegistrationPeriodPage;