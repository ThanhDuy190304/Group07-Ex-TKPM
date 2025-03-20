const xlsx = require("xlsx");
const csvParser = require("csv-parser");
const { Student } = require("../student/studentModel");
const { Readable } = require("stream");

// Function to process and update the database
async function processFile(file) {
  let data = [];

  // Check file type
  if (file.mimetype === "text/csv") {
    data = await parseCSV(file.buffer);
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    data = parseExcel(file.buffer);
  } else {
    throw new Error("Unsupported file format");
  }

  if (!data.length) throw new Error("Empty file or invalid data format");

  // Process each row and update database
  for (const record of data) {
    // await updateStudent(record.);
    console.log(record);
  }

  return {
    message: "File processed successfully",
    recordsProcessed: data.length,
  };
}

// Function to parse CSV file
function parseCSV(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString()); // Convert buffer to stream

    stream
      .pipe(csvParser())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// Function to parse Excel file
function parseExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = { processFile };
