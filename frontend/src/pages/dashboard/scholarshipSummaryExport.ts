import type { DashboardSummary } from "../../types/index";
import {
  buildCsvDocument,
  downloadTextFile,
  formatCurrency,
  formatDateOnly,
  getPdfTableFinalY,
} from "../../utils/helpers";

export function exportScholarshipSummaryCsv(summary: DashboardSummary): void {
  const generatedAt = new Date().toLocaleString();
  const dateToken = new Date().toISOString().slice(0, 10);

  const rows: Array<Array<unknown>> = [
    ["Scholarship summary"],
    ["Generated at", generatedAt],
    [],
    ["Totals"],
    ["Metric", "Value"],
    ["Total students", summary.totalStudents],
    ["Total mentors", summary.totalMentors],
    ["Total scholarships", summary.totalScholarships],
    ["Total meetings", summary.totalMeetings],
    [],
    ["Scholarship status counts"],
    ["Status", "Count"],
  ];

  Object.entries(summary.scholarshipByStatus)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([status, count]) => {
      rows.push([status, count]);
    });

  rows.push([], ["Upcoming deadlines"], ["Name", "Provider", "Amount", "Status", "Deadline", "Student ID"]);

  if (summary.upcomingDeadlines.length === 0) {
    rows.push(["No upcoming deadlines", "", "", "", "", ""]);
  } else {
    summary.upcomingDeadlines.forEach((scholarship) => {
      rows.push([
        scholarship.name,
        scholarship.provider,
        formatCurrency(scholarship.amount, scholarship.currency),
        scholarship.status,
        formatDateOnly(scholarship.deadline),
        scholarship.studentId,
      ]);
    });
  }

  const csv = `\uFEFF${buildCsvDocument(rows)}`;
  downloadTextFile(csv, `scholarship-summary-${dateToken}.csv`, "text/csv;charset=utf-8;");
}

export async function exportScholarshipSummaryPdf(summary: DashboardSummary): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const generatedAt = new Date().toLocaleString();
  const dateToken = new Date().toISOString().slice(0, 10);
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(18);
  doc.text("Scholarship Summary", 40, 44);
  doc.setFontSize(11);
  doc.text(`Generated at: ${generatedAt}`, 40, 64);

  autoTable(doc, {
    startY: 84,
    head: [["Metric", "Value"]],
    body: [
      ["Total students", summary.totalStudents],
      ["Total mentors", summary.totalMentors],
      ["Total scholarships", summary.totalScholarships],
      ["Total meetings", summary.totalMeetings],
    ],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [15, 118, 110] },
  });

  autoTable(doc, {
    startY: getPdfTableFinalY(doc) + 18,
    head: [["Status", "Count"]],
    body: Object.entries(summary.scholarshipByStatus)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([status, count]) => [status, String(count)]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [194, 65, 12] },
  });

  autoTable(doc, {
    startY: getPdfTableFinalY(doc) + 18,
    head: [["Scholarship", "Provider", "Amount", "Status", "Deadline", "Student ID"]],
    body:
      summary.upcomingDeadlines.length > 0
        ? summary.upcomingDeadlines.map((scholarship) => [
            scholarship.name,
            scholarship.provider,
            formatCurrency(scholarship.amount, scholarship.currency),
            scholarship.status,
            formatDateOnly(scholarship.deadline),
            scholarship.studentId,
          ])
        : [["No upcoming deadlines", "-", "-", "-", "-", "-"]],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [17, 24, 39] },
  });

  doc.save(`scholarship-summary-${dateToken}.pdf`);
}
