export const validStudentPayload = {
  firstName: "Samia",
  lastName: "Rahman",
  email: "samia.rahman@example.edu",
  academicYear: "Junior" as const,
  major: "Computer Science",
  gpa: 3.45,
  enrollmentStatus: "Full-time" as const,
  creditsCompleted: 78,
  creditsRequired: 120,
  expectedGraduation: "2027-06-01",
  demographics: {
    firstGeneration: true,
    lowIncome: false,
    underrepresentedMinority: true,
  },
};