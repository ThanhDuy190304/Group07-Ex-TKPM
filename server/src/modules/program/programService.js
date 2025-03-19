const Program = require("./programModel");

async function getAllPrograms() {
    try {
        const programs = await Program.findAll({
            attributes: ["programId", "name", "short_name"],
        });
        return programs;
    } catch (error) {
        console.error("Error in programService.getAllPrograms:", error.message);
        throw new Error("Error server");
    }
}

async function createProgram(newProgram) {
    try {
        const program = await Program.create(newProgram);
        return program;
    } catch (error) {
        console.error("Error in programService.createProgram:", error.message);
        throw new Error("Error server");
    }
}

async function updateProgram(programId, updatedData) {
    try {
        const program = await Program.findOne({ where: { programId } });
        if (!program) {
            return null;
        }
        await program.update(updatedData);
        return program;
    } catch (error) {
        console.error("Error in programService.updateProgram:", error.message);
        throw new Error("Error server");
    }

}

module.exports = { getAllPrograms, createProgram, updateProgram };
