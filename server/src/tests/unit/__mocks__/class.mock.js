const mockClassInfo = {
  classCode: "21_CQ1",
  courseCode: "FRA101",
  academicYear: "2023",
  semester: "Kỳ 2",
  maxStudents: 80,
  room: "A101",
  schedule: "Thứ 2, 3, 4",
  instructor: "Nguyễn Văn A",
};

const mockCreatedClass = {
  id: "15ededbd-e32e-48e2-940a-ed77de7f7189",
  ...mockClassInfo,
  createdAt: new Date(),
  updatedAt: new Date(),
};

module.exports = {
  mockClassInfo,
  mockCreatedClass,
};