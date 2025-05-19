export interface Program {
    id: string,
    name: string,
    programCode: string,
}

export const programFields: { programCode: string, name: string } = {
    programCode: "Mã chương trình",
    name: "Chương trình đào tạo",
};