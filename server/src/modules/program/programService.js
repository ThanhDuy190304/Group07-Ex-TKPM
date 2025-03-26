const Program = require("./programModel");

async function getAllPrograms() {
    try {
        const programs = await Program.findAll({
            attributes: ["programId", "name"],
        });
        return {
            success: true,
            data: programs,
        }
    } catch (error) {
        console.error("Error in programService.getAllPrograms: ", error.message);
        throw new Error("Error server");
    }
}

async function createProgram(newProgram) {
    try {
        const program = await Program.create(newProgram);
        return {
            success: true,
            data: program
        };
    } catch (error) {
        console.error("Error in programService.createProgram: ", error.message);
        throw new Error("Error server");
    }
}

async function updateProgram(programId, updatedData) {
    try {
        const program = await Program.findOne({ where: { programId } });
        if (!program) {
            return {
                success: false,
                error: "Không tìm thấy chương trình"
            };
        }
        await program.update(updatedData);
        return {
            success: true,
        };
    } catch (error) {
        console.error("Error in programService.updateProgram:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { getAllPrograms, createProgram, updateProgram };
