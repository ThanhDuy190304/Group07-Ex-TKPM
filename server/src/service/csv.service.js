const csv = require("csv-parser");
const { Readable } = require("stream");


const mapRowToStudent = (row) => {
    return {
        studentCode: row["MSSV"] || null,
        fullName: row["Họ tên"] || null,
        dateOfBirth: row["Ngày sinh"] || null,
        gender: row["Giới tính"] || null,
        facultyCode: row["Khoa"] || null,
        cohortYear: row["Khóa"] || null,
        programCode: row["Chương trình"] || null,
        temporaryResidenceAddress: {
            street: row['Địa chỉ tạm trú - Đường'] || null,
            ward: row['Địa chỉ tạm trú - Phường/Xã'] || null,
            district: row['Địa chỉ tạm trú - Quận/Huyện'] || null,
            city: row['Địa chỉ tạm trú - Tỉnh/Thành phố'] || null,
            country: row['Địa chỉ tạm trú - Quốc gia'] || null,
        },
        permanentAddress: {
            street: row['Địa chỉ thường trú - Đường'] || null,
            ward: row['Địa chỉ thường trú - Phường/Xã'] || null,
            district: row['Địa chỉ thường trú - Quận/Huyện'] || null,
            city: row['Địa chỉ thường trú - Tỉnh/Thành phố'] || null,
            country: row['Địa chỉ thường trú - Quốc gia'] || null,
        },
        mailAddress: {
            street: row['Địa chỉ nhận thư - Đường'] || null,
            ward: row['Địa chỉ nhận thư - Phường/Xã'] || null,
            district: row['Địa chỉ nhận thư - Quận/Huyện'] || null,
            city: row['Địa chỉ nhận thư - Tỉnh/Thành phố'] || null,
            country: row['Địa chỉ nhận thư - Quốc gia'] || null,
        },
        email: row['Email'] || null,
        phoneNumber: row['SĐT'] || null,
        status: row['Tình trạng'] || null,
        nationality: row['Quốc tịch'] || null,
        identityDocuments: [
            {
                type: 'CMND',
                number: row['Số CMND'] || null,
                issueDate: row['Ngày cấp CMND'] || null,
                placeOfIssue: row['Nơi cấp CMND'] || null,
                expiryDate: row['Ngày hết hạn CMND'] || null,
            },
            {
                type: 'CCCD',
                number: row['Số CCCD'] || null,
                issueDate: row['Ngày cấp CCCD'] || null,
                placeOfIssue: row['Nơi cấp CCCD'] || null,
                expiryDate: row['Ngày hết hạn CCCD'] || null,
                hasChip: (row['Chip'] && row['Chip'].toLowerCase() === 'có') || false,
            },
            {
                type: 'Passport',
                number: row['Số hộ chiếu'] || null,
                issueDate: row['Ngày cấp hộ chiếu'] || null,
                placeOfIssue: row['Nơi cấp hộ chiếu'] || null,
                expiryDate: row['Ngày hết hạn hộ chiếu'] || null,
                country: row['Quốc gia cấp'] || null,
                notes: row['Ghi chú'] || null,
            },
        ].filter((doc) => doc.number),
    };
};


async function importStudents(fileBuffer) {
    return new Promise((resolve, reject) => {
        const students = [];
        const errorRows = [];
        const stream = Readable.from(fileBuffer);
        stream
            .pipe(csv())
            .on('data', (row) => {
                try {
                    const student = mapRowToStudent(row);
                    students.push(student);
                } catch (error) {
                    console.error('Lỗi khi xử lý hàng CSV:', error);
                    errorRows.push(row);
                }
            })
            .on("end", () => {
                console.log(`Successfully import ${students.length} students.`);
                if (errorRows.length > 0) {
                    console.warn(`Have ${errorRows.length} error rows.`);
                }
                resolve(students);
            })
            .on('error', (error) => reject(error));
    });
}


module.exports = { importStudents }
