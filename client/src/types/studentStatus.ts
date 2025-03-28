export interface StudentStatus {
    statusId: string,
    name: string,
}

export const studentStatusFields: Partial<Record<keyof StudentStatus, string>> = {
    name: "Tên trạng thái",
};