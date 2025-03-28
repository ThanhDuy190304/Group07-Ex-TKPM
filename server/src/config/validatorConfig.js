module.exports = {
    VALID_STATUSES: ['Đang học', 'Đã tốt nghiệp', 'Đã thôi học', 'Tạm dừng học', 'Bảo lưu', 'Đình chỉ'],
    EMAIL_DOMAIN: '@student.university.edu.vn',
    STATUS_TRANSITIONS: {
      'Đang học': ['Tạm dừng học', 'Đã tốt nghiệp', 'Đã thôi học', 'Bảo lưu', 'Đình chỉ'],
      'Tạm dừng học': ['Đang học', 'Đã thôi học'],
      'Đã tốt nghiệp': [],
      'Đã thôi học': [],
      'Bảo lưu': ['Đang học', 'Đã thôi học'],
      'Đình chỉ': ['Đang học', 'Đã thôi học']
    }
  };