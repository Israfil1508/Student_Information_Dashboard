import type { StudentProfilePayload } from "../../types/index";
import {
  buildCsvDocument,
  downloadTextFile,
  formatCurrency,
  formatDate,
  formatDateOnly,
  getPdfTableFinalY,
  sanitizeFileNamePart,
} from "../../utils/helpers";

export function exportStudentReportCsv(profile: StudentProfilePayload): void {
  const studentName = `${profile.student.firstName} ${profile.student.lastName}`.trim();
  const reportToken = sanitizeFileNamePart(studentName || profile.student.id);
  const generatedAt = new Date().toLocaleString();

  const rows: Array<Array<unknown>> = [
    ["Student report"],
    ["Generated at", generatedAt],
    [],
    ["Student profile"],
    ["Field", "Value"],
    ["Student ID", profile.student.id],
    ["Name", studentName],
    ["Email", profile.student.email],
    ["Major", profile.student.major],
    ["Academic year", profile.student.academicYear],
    ["Enrollment status", profile.student.enrollmentStatus],
    ["Current GPA", profile.academicProgress.currentGpa.toFixed(2)],
    ["Credits completed", profile.academicProgress.creditsCompleted],
    ["Credits required", profile.academicProgress.creditsRequired],
    ["Completion", `${profile.academicProgress.completionPercent}%`],
    ["Expected graduation", formatDateOnly(profile.student.expectedGraduation)],
    ["Assigned mentor", profile.mentorship.mentor?.name ?? "None"],
    ["Meetings logged", profile.mentorship.meetings.length],
  ];

  rows.push(
    [],
    ["Scholarships"],
    [
      "Name",
      "Provider",
      "Amount",
      "Status",
      "Deadline",
      "Requirements",
      "Essay required",
      "Essay submitted",
      "Notes",
    ],
  );

  if (profile.scholarships.length === 0) {
    rows.push(["No scholarships", "", "", "", "", "", "", "", ""]);
  } else {
    profile.scholarships.forEach((scholarship) => {
      rows.push([
        scholarship.name,
        scholarship.provider,
        formatCurrency(scholarship.amount, scholarship.currency),
        scholarship.status,
        formatDateOnly(scholarship.deadline),
        scholarship.requirements.join(" | "),
        scholarship.essayRequired ? "Yes" : "No",
        scholarship.essaySubmitted ? "Yes" : "No",
        scholarship.notes || "-",
      ]);
    });
  }

  rows.push([], ["Meetings"], ["Date", "Mentor", "Duration", "Status", "Notes", "Action items"]);

  if (profile.mentorship.meetings.length === 0) {
    rows.push(["No meetings", "", "", "", "", ""]);
  } else {
    profile.mentorship.meetings.forEach((meeting) => {
      rows.push([
        formatDate(meeting.date),
        meeting.mentorName ?? profile.mentorship.mentor?.name ?? "Mentor",
        `${meeting.duration} min`,
        meeting.status,
        meeting.notes || "-",
        meeting.actionItems.join(" | ") || "-",
      ]);
    });
  }

  const csv = `\uFEFF${buildCsvDocument(rows)}`;
  downloadTextFile(csv, `student-report-${reportToken}.csv`, "text/csv;charset=utf-8;");
}

export async function exportStudentReportPdf(profile: StudentProfilePayload): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const studentName = `${profile.student.firstName} ${profile.student.lastName}`.trim();
  const reportToken = sanitizeFileNamePart(studentName || profile.student.id);
  const generatedAt = new Date().toLocaleString();

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(18);
  doc.text("Student Report", 40, 44);
  doc.setFontSize(11);
  doc.text(`Generated at: ${generatedAt}`, 40, 64);
  doc.text(`Student: ${studentName}`, 40, 80);

  autoTable(doc, {
    startY: 92,
    head: [["Field", "Value"]],
    body: [
      ["Student ID", profile.student.id],
      ["Email", profile.student.email],
      ["Major", profile.student.major],
      ["Academic year", profile.student.academicYear],
      ["Enrollment status", profile.student.enrollmentStatus],
      ["Current GPA", profile.academicProgress.currentGpa.toFixed(2)],
      [
        "Credits",
        `${profile.academicProgress.creditsCompleted}/${profile.academicProgress.creditsRequired}`,
      ],
      ["Completion", `${profile.academicProgress.completionPercent}%`],
      ["Expected graduation", formatDateOnly(profile.student.expectedGraduation)],
      ["Assigned mentor", profile.mentorship.mentor?.name ?? "None"],
      ["Meetings logged", profile.mentorship.meetings.length],
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  autoTable(doc, {
    startY: getPdfTableFinalY(doc) + 18,
    head: [["Scholarship", "Provider", "Amount", "Status", "Deadline"]],
    body:
      profile.scholarships.length > 0
        ? profile.scholarships.map((scholarship) => [
            scholarship.name,
            scholarship.provider,
            formatCurrency(scholarship.amount, scholarship.currency),
            scholarship.status,
            formatDateOnly(scholarship.deadline),
          ])
        : [["No scholarships", "-", "-", "-", "-"]],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [194, 65, 12] },
  });

  autoTable(doc, {
    startY: getPdfTableFinalY(doc) + 18,
    head: [["Date", "Mentor", "Duration", "Status", "Notes"]],
    body:
      profile.mentorship.meetings.length > 0
        ? profile.mentorship.meetings.map((meeting) => [
            formatDate(meeting.date),
            meeting.mentorName ?? profile.mentorship.mentor?.name ?? "Mentor",
            `${meeting.duration} min`,
            meeting.status,
            meeting.notes || "-",
          ])
        : [["No meetings", "-", "-", "-", "-"]],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [17, 24, 39] },
  });

  doc.save(`student-report-${reportToken}.pdf`);
}
