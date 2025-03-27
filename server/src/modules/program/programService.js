const Program = require("./programModel");
const ProgramError = require("./programError");

async function getAllPrograms() {
    try {
        const programs = await Program.findAll({
            attributes: ["programId", "name", "short_name"],
        });
        return {
            success: true,
            programs: programs,
        };
    } catch (error) {
        console.error("Error in programService.getAllPrograms: ", error.message);
        throw ProgramError.INTERNAL_ERROR;
    }
}

async function createProgram(newProgram) {
    try {
        const program = await Program.create(newProgram);
        return {
            success: true,
            program: program,
        };
    } catch (error) {
        console.error("Error in programService.createProgram:", error.message);
        throw ProgramError.INTERNAL_ERROR;
    }
}

async function updateProgram(programId, updatedData) {
    try {
        const program = await Program.findOne({ where: { programId } });
        if (!program) {
            return {
                success: false,
                error: ProgramError.NOT_FOUND,
            };
        }

        const updateFields = {};
        if (updatedData.name) updateFields.name = updatedData.name;
        if (updatedData.short_name) updateFields.short_name = updatedData.short_name;

        if (Object.keys(updateFields).length === 0) {
            return {
                success: false,
                error: ProgramError.INVALID_DATA,
            };
        }

        const updatedProgram = await program.update(updateFields);
        return {
            success: true,
            program: updatedProgram.get({ plain: true }),
        };
    } catch (error) {
        console.error("Error in programService.updateProgram:", error.message);
        throw ProgramError.INTERNAL_ERROR;
    }
}

module.exports = { getAllPrograms, createProgram, updateProgram };