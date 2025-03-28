const Course = require("./courseModel");
const CourseError = require("./courseError");
async function getAllCourses() {
    try {
        const courses = await Course.findAll({
            attributes: ["courseId"],
        });
        return {
            success: true,
            data: courses,
        };
    } catch (error) {
        console.error("Error in courseService.getAllCourses:", error.message);
        throw CourseError.INTERNAL_ERROR;
    }
}
module.exports = { getAllCourses };