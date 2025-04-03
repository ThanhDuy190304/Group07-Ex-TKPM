export interface Program {
    id: string,
    name: string,
    programCode: string,
}

export const programFields: Partial<Record<keyof Program, string>> = {
    programCode: "Mã chương trình",
    name: "Tên chương trình",
};