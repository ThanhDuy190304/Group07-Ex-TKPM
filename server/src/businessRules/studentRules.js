// Một số quy tắc nghiệp vụ dành cho Sinh viên

module.exports = {
  // Các trạng thái hợp lệ của sinh viên
  VALID_STATUSES: [
    'Đang học',
    'Đã tốt nghiệp',
    'Đã thôi học',
    'Tạm dừng học',
    'Bảo lưu',
    'Đình chỉ'
  ],
  // Domain email hợp lệ cho sinh viên
  EMAIL_DOMAIN: '@student.university.edu.vn',
  // Các chuyển trạng thái hợp lệ
  STATUS_TRANSITIONS: {
    'Đang học': ['Đang học', 'Tạm dừng học', 'Đã tốt nghiệp', 'Đã thôi học', 'Bảo lưu', 'Đình chỉ'],
    'Tạm dừng học': ['Đang học', 'Đã thôi học', 'Tạm dừng học'],
    'Tốt nghiệp': ['Tốt nghiệp'],
    'Đã thôi học': ['Đã thôi học'],
    'Bảo lưu': ['Đang học', 'Đã thôi học', 'Bảo lưu'],
    'Đình chỉ': ['Đang học', 'Đã thôi học', 'Đình chỉ']
  }
};
