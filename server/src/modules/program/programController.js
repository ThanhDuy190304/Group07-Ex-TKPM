const ProgramService = require("./programService");

async function getPrograms(req, res) {
    try {
        const result = await ProgramService.getAllPrograms();
        if (result.success) {
            return res.status(200).json({ data: result.programs });
        }
        return res.status(500).json({ error: "Lỗi server" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

async function postProgram(req, res) {
    try {
        const result = await ProgramService.createProgram(req.body);
        if (result.success) {
            return res.status(200).json({ data: result.program });
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

async function putProgram(req, res) {
    try {
        const programId = req.params.programId;
        const updatedData = req.body;
        const result = await ProgramService.updateProgram(programId, updatedData);
        if (result.success) {
            return res.status(200).json({ data: result.program });
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

module.exports = { getPrograms, postProgram, putProgram };