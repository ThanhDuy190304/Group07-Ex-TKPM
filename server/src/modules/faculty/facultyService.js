const Faculty = require("./facultyModel");
const FacultyError = require("./facultyError");

async function getAllFaculties() {
    try {
        const faculties = await Faculty.findAll({
            attributes: ["facultyId", "name", "short_name"],
        });
        return {
            success: true,
            faculties: faculties,
        };
    } catch (error) {
        console.error("Error in facultyService.getAllFaculties: ", error.message);
        throw FacultyError.INTERNAL_ERROR;
    }
}
async function createFaculty(newFaculty) {
    try {
        const faculty = await Faculty.create(newFaculty);
        return {
            success: true,
            faculty: faculty,
        };
    } catch (error) {
        console.error("Error in facultyService.createFaculty:", error.message);
        throw FacultyError.INTERNAL_ERROR;
    }
}
async function updateFaculty(facultyId, updatedData) {
    try {
        const faculty = await Faculty.findOne({ where: { facultyId } });
        if (!faculty) {
            return {
                success: false,
                error: FacultyError.NOT_FOUND,
            };
        }
        const updateFields = {};
        if (updatedData.name) updateFields.name = updatedData.name;
        if (updatedData.short_name) updateFields.short_name = updatedData.short_name;
        if (Object.keys(updateFields).length === 0) {
            return {
                success: false,
                error: FacultyError.NOT_FOUND,
            };
        }
        const updatedFaculty = await faculty.update(updateFields);
        return {
            success: true,
            faculty: updatedFaculty.get({ plain: true }),
        };
    } catch (error) {
        console.error("Error in facultyService.updateFaculty:", error.message);
        throw FacultyError.INTERNAL_ERROR;
    }
}

module.exports = { getAllFaculties, createFaculty, updateFaculty };
