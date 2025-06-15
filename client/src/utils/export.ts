import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export type ExportFormData = {
    fileName: string;
    typeFile: 'csv' | 'xlsx';
};


export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
    if (data.length === 0) {
        console.warn("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","), // Header row
        ...data.map(row =>
            headers.map(header => {
                const cell = row[header];
                const stringValue =
                    typeof cell === "object" && cell !== null
                        ? JSON.stringify(cell)   // giữ nguyên object
                        : String(cell ?? "");
                return `"${stringValue.replace(/"/g, '""')}"`; // escape dấu " bên trong
            }).join(",")
        )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
}

export function exportToExcel<T extends Record<string, any>>(data: T[], filename: string): void {
    if (data.length === 0) {
        console.warn("No data to export");
        return;
    }

    const headers = Object.keys(data[0]);

    const processedData = data.map(row => {
        const newRow: Record<string, any> = {};
        for (const key of headers) {
            const cell = row[key];
            newRow[key] = typeof cell === "object" && cell !== null
                ? JSON.stringify(cell)
                : cell;
        }
        return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, `${filename}.xlsx`);
}