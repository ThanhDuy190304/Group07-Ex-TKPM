# Cách thêm 1 routes mới

## Ngôn ngữ / Framework sử dụng:
Javascript, Nodejs

## 1. Thao tác với route 

1. Vùng chứa routes: cd server/src/route

Có thể tạo 1 file mới cho routes riêng hoặc sử dụng chung file với các file có sẵn nếu routes liên quan.

2. Thêm 1 route mong muốn để tạo api mới

ví dụ với course routes:

![course routes](/registering_new_route2.png)

Sử dụng cú pháp tương ứng:

- .get : read database (thường là lấy);
- .post : write database (thường là tạo)
- .delete : write database (thường là xóa)
- .put : write database (thường là sửa)

---

## 2. Thao tác với Controller

1. Vùng chứa controllers: cd server/src/controller

2. Kết nối các controller với route

Tạo các method riêng trong controller ứng với từng api đã tạo trong route trước đó.

Cú pháp:

```js
const <__method_name__> = async (req, res, next) => {
    try {
        const response = await courseService.<__service_name__>();
        return res.status(200).json({ data: response });
    } catch (error) {
        next(error);
    }
}

```

Lưu ý: tham số truyền từ api truyền vào nếu là req.params.<_params_name_> thì phải mapping đúng tên của method trong controller với api trong route.

Các loại tham số có thể truyền phổ biến:

- req.params.<_params_name_>
- req.body
- req.query

---

## 3. Thao tác với Service

Logic/hiệu năng sẽ được thực hiện ở đây.

Logic cần đảm bảo hiểu đúng yêu cầu controller mong đợi, gọi các yêu cầu tới tầng model để thực hiện chức năng liên quan database, rồi lấy kết quả để trả về controller.