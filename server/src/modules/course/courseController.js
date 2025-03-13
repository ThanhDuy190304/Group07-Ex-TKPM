const CourseService = require("./courseService");

async function getCourses(req, res) {
    try {
        const courses = await CourseService.getAllCourses();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getCourses };
