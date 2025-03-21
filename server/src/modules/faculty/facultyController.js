const FacultyService = require("./facultyService");
const logger = require("../../logger");

async function getFaculties(req, res) {
    try {
        logger.info('getFaculties');
        const faculties = await FacultyService.getAllFaculties();
        return res.status(200).json(faculties);
    } catch (error) {
        logger.error('Error getFaculties', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

async function postFaculty(req, res) {
    try {
        logger.info('postFaculty');
        const faculty = await FacultyService.createFaculty(req.body);
        return res.status(200).json(faculty);
    } catch (error) {
        logger.error('Error postFaculty', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

async function putFaculty(req, res) {
    try {
        logger.info('putFaculty');
        const facultyId = req.params.facultyId;
        const updatedData = req.body;
        const result = await FacultyService.updateFaculty(facultyId, updatedData);
        if (!result) {
            logger.warn('Warn putFaculty', {facultyId});
            return res.status(404).json({ message: "Faculty not found!" });
        }
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Error putFaculty', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getFaculties, postFaculty, putFaculty };
