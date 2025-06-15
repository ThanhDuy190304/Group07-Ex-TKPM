const csv = require("csv-parser");
const XLSX = require("xlsx");

const { Readable } = require("stream");

/**
 * @param {Buffer} fileBuffer - Nội dung file CSV
 * @param {(row: Object) => Object | null} mapRow - Hàm map từng dòng (có thể trả về null để bỏ dòng đó)
 * @returns {Promise<Array<Object>>} - Mảng object đã parse và map từ CSV
 */
async function importCSV(fileBuffer, mapRow = (row) => row) {
    return new Promise((resolve, reject) => {
        const results = [];
        const errorRows = [];

        Readable.from(fileBuffer)
            .pipe(csv())
            .on("data", (row) => {
                try {
                    const mapped = mapRow(row);
                    if (mapped !== null) {
                        results.push(mapped);
                    }
                } catch (err) {
                    console.error("❌ Lỗi xử lý dòng CSV:", err);
                    errorRows.push(row);
                }
            })
            .on("end", () => {
                console.log(`✅ Đã import ${results.length} dòng`);
                if (errorRows.length > 0) {
                    console.warn(`⚠️ Có ${errorRows.length} dòng lỗi`);
                }
                resolve(results);
            })
            .on("error", reject);
    });
}

/**
 * @param {Buffer} fileBuffer - File .xlsx
 * @param {(row: Object) => Object | null} mapRow - Hàm map từng dòng
 * @returns {Array<Object>}
 */
function importXLSX(fileBuffer, mapRow = (row) => row) {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    const results = [];
    const errorRows = [];

    for (const row of rawData) {
        try {
            const mapped = mapRow(row);
            if (mapped !== null) {
                results.push(mapped);
            }
        } catch (err) {
            console.error("❌ Lỗi xử lý dòng XLSX:", err);
            errorRows.push(row);
        }
    }

    console.log(`✅ Đã import ${results.length} dòng từ Excel`);
    if (errorRows.length > 0) {
        console.warn(`⚠️ Có ${errorRows.length} dòng lỗi`);
    }

    return results;
}

module.exports = { importCSV, importXLSX };
