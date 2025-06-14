// components/StudyResultPDF.tsx
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import { Student, StudyResultItem } from "../../types/student";

// Tùy chỉnh font nếu cần
Font.register({
    family: "Montserrat",
    src: "/fonts/Montserrat-Regular.ttf",
});
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        fontFamily: "Montserrat",
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#000",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        padding: 4,
        flex: 1, // hoặc dùng flexGrow nếu cần cân bằng cột
        borderWidth: 1,
        borderColor: "#000",
    },
});


type Props = {
    student: Student;
    results: StudyResultItem[];
    totalCredits: number;
    gpa: number | null;
};

const StudyResultPDF: React.FC<Props> = ({ student, results, totalCredits, gpa }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>BẢNG ĐIỂM SINH VIÊN</Text>
            <Text>Mã sinh viên: {student.studentCode}</Text>
            <Text>Niên khóa: {student.cohortYear}</Text>

            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={styles.cell}>Mã học phần</Text>
                    <Text style={styles.cell}>Tên môn</Text>
                    <Text style={styles.cell}>Số TC</Text>
                    <Text style={styles.cell}>Điểm</Text>
                </View>

                {results.map((r, i) => (
                    <View style={styles.row} key={i}>
                        <Text style={styles.cell}>{r.courseCode}</Text>
                        <Text style={styles.cell}>{r.courseName}</Text>
                        <Text style={styles.cell}>{r.credits}</Text>
                        <Text style={styles.cell}>{r.grade}</Text>
                    </View>
                ))}
            </View>

            <Text style={{ marginTop: 20 }}>
                Tổng số tín chỉ: {totalCredits}
            </Text>
            <Text>GPA: {gpa ?? "N/A"}</Text>
        </Page>
    </Document>
);

export default StudyResultPDF;
