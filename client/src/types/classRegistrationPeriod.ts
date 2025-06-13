export interface ClassRegistrationPeriod {
    id: string;
    startDateTime: Date;
    endDateTime: Date;
    semester: string;
    academicYear: number;
    isActive: boolean;
}

export const ClassRegistrationPeriodFieldKeys: Record<keyof ClassRegistrationPeriod, string> = {
    id: "id",
    academicYear: "academicYear",
    semester: "semester",
    startDateTime: "startDateTime",
    endDateTime: "endDateTime",
    isActive: "isActive",
};

