import { Faculty } from "./faculty";
import { Program } from "./program";
import { StudentStatus } from "./studentStatus";
import { Address } from "./address";

export interface Student {
    studentId: string;
    fullName: string;
    dateOfBirth: Date | string;
    gender: "Nam" | "Nữ" | "Khác";
    email: string;
    phoneNumber: string;

    mailAddress: Address;
    permanentAddress: Address;
    temporaryResidenceAddress: Address;

    nationalityId: string;
    courseId: string;

    facultyId: string;
    Faculty: Faculty;

    programId: string;
    Program: Program;

    studentStatusId: string;
    StudentStatus: StudentStatus;
}

export interface PaginatedStudents {
    students: Student[]; // Dữ liệu theo trang
    total: number;
}

export const studentFields: Partial<Record<keyof Student, string>> = {
    studentId: "MSSV",
    fullName: "Họ tên",
    dateOfBirth: "Ngày sinh",
    gender: "Giới tính",
    email: "Email",
    phoneNumber: "SĐT",

    mailAddress: "Địa chỉ nhận thư",
    permanentAddress: "Địa chỉ thường trú",
    temporaryResidenceAddress: "Địa chỉ tạm trú",

    Faculty: "Khoa",
    courseId: "Khóa",
    Program: "Chương trình",
    nationalityId: "Quốc tịch",
    StudentStatus: "Tình trạng",
};

