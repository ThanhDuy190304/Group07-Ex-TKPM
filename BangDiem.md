### **Hệ Thống Quản Lý Khóa Học & Bảng Điểm Sinh Viên**  

## **1. Giới thiệu**  
Hệ thống giúp quản lý thông tin khóa học, đăng ký môn học cho sinh viên và hỗ trợ in bảng điểm dựa trên các môn đã hoàn thành (thực hiện bởi giáo vụ)

## **2. Yêu Cầu Hệ Thống**  

### **2.1 Quản Lý Khóa Học**  
#### **User Story 1: Thêm khóa học mới**  
<!-- 📌 *Là một* **giáo vụ**, *tôi muốn* tạo một khóa học mới trong hệ thống để có thể tổ chức giảng dạy cho sinh viên.   -->

✅ **Tiêu chí chấp nhận:**  
<!-- - Nhập được thông tin: mã khóa học, tên khóa học, số tín chỉ, khoa phụ trách, mô tả, môn tiên quyết (nếu có).   -->
<!-- - Khóa học phải có số tín chỉ hợp lệ (>=2).   -->
<!-- - Hệ thống kiểm tra xem môn tiên quyết có tồn tại không trước khi lưu.  
  -->
### **User Story 2: Xóa khóa học**  
📌 *Là một* **giáo vụ**, *tôi muốn* có thể xóa khóa học **chỉ trong vòng 30 phút sau khi tạo** để sửa lỗi nhập liệu.  

✅ **Tiêu chí chấp nhận:**  
<!-- - **Chỉ có thể xóa khóa học**, nếu chưa có lớp học nào được mở cho môn đó.   -->
<!-- - Nếu có lớp học/sinh viên đăng ký, **không thể xóa**, chỉ có thể **đánh dấu khóa học là không còn được mở (deactivate)**.   -->
- Nếu khóa học bị **deactivate**, nó vẫn xuất hiện trong lịch sử nhưng không thể thêm lớp học mới.  

### **User Story 3: Cập nhật thông tin khóa học**  
<!-- 📌 *Là một* **giáo vụ**, *tôi muốn* có thể chỉnh sửa thông tin khóa học thay vì xóa để đảm bảo dữ liệu không bị mất.   -->

✅ **Tiêu chí chấp nhận:**  
- Có thể chỉnh sửa **tên khóa học, mô tả, khoa phụ trách**.  
- **Không thể thay đổi mã khóa học** sau khi đã tạo.  
- **Không thể thay đổi số tín chỉ nếu đã có sinh viên đăng ký**.  

#### **User Story 4: Mở lớp học cho một khóa học cụ thể**  
📌 *Là một* **giáo vụ**, *tôi muốn* tạo một lớp học mới cho một khóa học trong một học kỳ để sinh viên có thể đăng ký.  

✅ **Tiêu chí chấp nhận:**  
<!-- - Nhập thông tin: mã lớp học, mã khóa học, năm học, học kỳ, giảng viên, số lượng tối đa, lịch học, phòng học.   -->
- Một khóa học có thể có nhiều lớp trong cùng một học kỳ.  

### **2.2 Đăng Ký Khóa Học Cho Sinh Viên (Thủ Công Bởi Giáo Vụ)**  
#### **User Story 5: Đăng ký khóa học cho sinh viên**  
📌 *Là một* **giáo vụ**, *tôi muốn* đăng ký khóa học cho sinh viên để đảm bảo sinh viên tham gia đúng lớp học.  

✅ **Tiêu chí chấp nhận:**  
<!-- - Chọn sinh viên và chọn khóa học cần đăng ký.   -->
<!-- - Hệ thống kiểm tra môn tiên quyết trước khi đăng ký.   -->
- Không thể đăng ký nếu lớp học đã đủ số lượng tối đa.  

#### **User Story 6: Hủy đăng ký khóa học của sinh viên**  
📌 *Là một* **giáo vụ**, *tôi muốn* hủy đăng ký môn học của sinh viên khi có sai sót hoặc sinh viên có lý do đặc biệt.  

✅ **Tiêu chí chấp nhận:**  
- Chỉ có thể hủy đăng ký trước thời hạn quy định của học kỳ.  
- Hệ thống ghi lại lịch sử hủy đăng ký.  

#### **User Story 7: In bảng điểm chính thức**  
📌 *Là một* **giáo vụ**, *tôi muốn* in bảng điểm chính thức cho sinh viên để cấp phát khi cần.  

✅ **Tiêu chí chấp nhận:**  
- Hệ thống xuất file có tiêu đề, thông tin sinh viên, danh sách môn học, điểm số và GPA.  
