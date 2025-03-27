const studentError = {

    INTERNAL_ERROR: {
        code: 'STUDENT_SERVER_ERROR',
        message: 'Lỗi server khi xử lý học sinh',
    },
    UNKNOWN_STUDENT: {
        code: 'UNKNOWN_STUDENT',
        message: 'Không tìm thấy sinh viên',
    },
    EMAIL_EXIST: {
        code: 'EMAIL EXIST',
        message: 'email đã tồn tại',
    }

};

module.exports = studentError;