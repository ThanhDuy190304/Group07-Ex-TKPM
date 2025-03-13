const FacultyService = require("./facultyService");

async function getFaculties(req, res) {
    try {
        const faculties = await FacultyService.getAllFaculties();
        return res.status(200).json(faculties);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getFaculties };
