export interface Program {
    programId: string,
    name: string,
    short_name: string,
}

export const programFields: Partial<Record<keyof Program, string>> = {
    name: "Tên chương trình",
    short_name: "Mã chương trình",
};