const studentError = {

    INTERNAL_ERROR: {
        code: 'STUDENT_SERVER_ERROR',
        message: 'Lỗi server khi xử lý học sinh',
    },
    UNKNOWN_STUDENT: {
        code: 'UNKNOWN_STUDENT',
        message: 'unknown student',
    },
    EMAIL_EXIST: {
        code: 'EMAIL EXIST',
        message: 'email đã tồn tại',
    }

};

module.exports = studentError;