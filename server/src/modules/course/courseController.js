const CourseService = require("./courseService");
const logger = require("../../logger");

async function getCourses(req, res) {
    try {
        logger.info('getCourses');
        const courses = await CourseService.getAllCourses();
        return res.status(200).json(courses);
    } catch (error) {
        logger.error('Error getCourses', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getCourses };
