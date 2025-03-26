export interface Student {
    studentId: string;
    fullName: string;
    dateOfBirth: Date;
    gender: "Nam" | "Nữ" | "Khác";
    facultyId: string; // Mã khoa của sinh viên
    courseId: string; // Khóa học (VD: "K16", "K17", ...)
    programId: string; // Chương trình đào tạo ("Đại học", "Cao đẳng", "Thạc sĩ", ...)
    email: string;
    phoneNumber: string;
    statusId: string; // Trạng thái học tập (VD: "Đang học", "Bảo lưu", "Tốt nghiệp")
    nationalId: string;
}

export interface PaginatedStudents {
    students: Student[]; // Dữ liệu đã được phân ra theo trang
    total: number;
}


export const studentFields: Record<keyof Student, string> = {
    studentId: "MSSV",
    fullName: "Họ tên",
    dateOfBirth: "Ngày sinh",
    gender: "Giới tính",
    facultyId: "Khoa",
    courseId: "Khóa",
    programId: "Chương trình",
    email: "Email",
    phoneNumber: "SĐT",
    statusId: "Tình trạng",
    nationalId: "Quốc tịch",
};
