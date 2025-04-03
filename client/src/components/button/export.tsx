import { useState } from "react";
import { Student } from "../../types/student"
import { getAllStudents } from "../../api/apiStudents";
import { DocumentArrowDownIcon, } from "@heroicons/react/24/outline";
import { saveAs } from "file-saver";
import { utils, writeFile } from "xlsx";

const mapStudentToExportFormat = (student: Student) => {
    // Lấy thông tin các địa chỉ
    const mailAddress = student.mailAddress || {};
    const permanentAddress = student.permanentAddress || {};
    const temporaryResidenceAddress = student.temporaryResidenceAddress || {};

    // Lọc các loại giấy tờ tùy thân
    const identityDocuments = Array.isArray(student.identityDocuments) ? student.identityDocuments : [];
    const idCard = identityDocuments.find(doc => doc.type === "CMND") || null;
    const citizenIdentification = identityDocuments.find(doc => doc.type === "CCCD") || null;
    const passport = identityDocuments.find(doc => doc.type === "Passport") || null;

    return {
        "MSSV": student.studentCode,
        "Họ tên": student.fullName,
        "Ngày sinh": student.dateOfBirth,
        "Giới tính": student.gender,
        "Khoa": student.facultyCode,
        "Khóa": student.cohortYear,
        "Chương trình": student.programCode,
        "Địa chỉ tạm trú - Đường": temporaryResidenceAddress.street,
        "Địa chỉ tạm trú - Phường/Xã": temporaryResidenceAddress.wardsCommunes,
        "Địa chỉ tạm trú - Quận/Huyện": temporaryResidenceAddress.district,
        "Địa chỉ tạm trú - Tỉnh/Thành phố": temporaryResidenceAddress.cityProvince,
        "Địa chỉ tạm trú - Quốc gia": temporaryResidenceAddress.nation,
        "Địa chỉ thường trú - Đường": permanentAddress.street,
        "Địa chỉ thường trú - Phường/Xã": permanentAddress.wardsCommunes,
        "Địa chỉ thường trú - Quận/Huyện": permanentAddress.district,
        "Địa chỉ thường trú - Tỉnh/Thành phố": permanentAddress.cityProvince,
        "Địa chỉ thường trú - Quốc gia": permanentAddress.nation,
        "Địa chỉ nhận thư - Đường": mailAddress.street,
        "Địa chỉ nhận thư - Phường/Xã": mailAddress.wardsCommunes,
        "Địa chỉ nhận thư - Quận/Huyện": mailAddress.district,
        "Địa chỉ nhận thư - Tỉnh/Thành phố": mailAddress.cityProvince,
        "Địa chỉ nhận thư - Quốc gia": mailAddress.nation,
        "Email": student.email,
        "SĐT": student.phoneNumber,
        "Tình trạng": student.status,
        "Quốc tịch": student.nationality,
        // CMND
        "Số CMND": idCard ? idCard.number : '',
        "Ngày cấp CMND": idCard ? idCard.issueDate : '',
        "Nơi cấp CMND": idCard ? idCard.placeOfIssue : '',
        "Ngày hết hạn CMND": idCard ? idCard.expiryDate : '',
        // CCCD
        "Số CCCD": citizenIdentification ? citizenIdentification.number : '',
        "Ngày cấp CCCD": citizenIdentification ? citizenIdentification.issueDate : '',
        "Nơi cấp CCCD": citizenIdentification ? citizenIdentification.placeOfIssue : '',
        "Ngày hết hạn CCCD": citizenIdentification ? citizenIdentification.expiryDate : '',
        "Chip": citizenIdentification ? (citizenIdentification.hasChip ? 'Có' : 'Không') : '',
        // Hộ chiếu
        "Số hộ chiếu": passport ? passport.number : '',
        "Ngày cấp hộ chiếu": passport ? passport.issueDate : '',
        "Nơi cấp hộ chiếu": passport ? passport.placeOfIssue : '',
        "Ngày hết hạn hộ chiếu": passport ? passport.expiryDate : '',
        "Quốc gia cấp hộ chiếu": passport ? passport.country : '',
        // Các thuộc tính khác
        "Ghi chú": passport ? passport.notes : ''
    };
};

const FILETYPES = ["JSON", "XLSX"];
function downFile(data: any, type: any) {
    if (type === "JSON") {
        const jsonData = JSON.stringify(data, null, 2); // Chuyển object thành chuỗi JSON
        const blob = new Blob([jsonData], { type: "application/json" }); // Tạo file JSON dưới dạng Blob
        saveAs(blob, "students.json"); // Gọi hộp thoại lưu file về máy
    }
    else if (type === "XLSX") {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Students");
        writeFile(workbook, "students.xlsx");
    }
}
function ExportButton(searchQuery: any) {
    const [fileType, setFileType] = useState("JSON");
    const handleExport = async () => {
        const response = await getAllStudents(searchQuery);
        const formattedData = mapStudentToExportFormat(response.students);
        downFile(formattedData, fileType);
    };
    return (
        <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={handleExport}>
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Tải xuống</span>
            {/* Dropdown chọn loại file */}
            <select
                value={fileType}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setFileType(e.target.value)}
                className="bg-blue-600 text-white border-none outline-none cursor-pointer"
            >
                {FILETYPES.map((type) => (
                    <option key={type} value={type} className="cursor-pointer">
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ExportButton;
