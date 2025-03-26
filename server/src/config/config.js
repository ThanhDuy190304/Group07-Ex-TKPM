module.exports = {
    statusTransitionRules: {
    'Đang học': ['Bảo lưu', 'Tốt nghiệp', 'Đình chỉ', 'Đã thôi học', 'Tạm dừng học'],
    'Bảo lưu': ['Đang học', 'Đã thôi học'],
    'Đình chỉ': ['Đang học', 'Đã thôi học'],
    'Tạm dừng học': ['Đang học', 'Đã thôi học'],
    'Đã tốt nghiệp': [],
    'Đã thôi học': [],
  }
}