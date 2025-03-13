const Course = require("./courseModel");

async function getAllCourses() {
    try {
        const courses = await Course.findAll({
            attributes: ["courseId"], // Chỉ lấy courseId
        });
        return courses;
    } catch (error) {
        console.error("Error in courseService.getAllCourses:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { getAllCourses };
