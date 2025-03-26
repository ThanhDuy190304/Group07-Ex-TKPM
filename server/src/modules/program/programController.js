const ProgramService = require("./programService")

async function getPrograms(req, res) {
    try {
        const result = await ProgramService.getAllPrograms();
        if (result.success) {
            return res.status(200).json(result.data);
        }
        return res.status(500).json({ error: "Lỗi server" });
    } catch (error) {
        console.error('Error getPrograms', { message: error.message, stack: error.stack });
        return res.status(500).json({ error: "Lỗi server" });
    }
}

async function postProgram(req, res) {
    try {
        const result = await ProgramService.createProgram(req.body);
        if (result.success) {
            return res.status(201).json(result.data);
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        console.error('Error postProgram', { message: error.message, stack: error.stack });
        return res.status(500).json({ error: error.message });
    }
}

async function putProgram(req, res) {
    try {
        const programId = req.params.programId;
        const updatedData = req.body;
        const result = await ProgramService.updateProgram(programId, updatedData);
        if (result.success) {
            return res.status(201).send();
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        console.error('Error putProgram', { message: error.message, stack: error.stack });
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getPrograms, postProgram, putProgram };
