/* Initial Comment: Student Information Dashboard repository file. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  addStudent as createStudent,
  editStudent as updateStudent,
  getDashboardSummary as fetchDashboardSummary,
  getStudentProfile as fetchStudentProfile,
  getStudents as fetchStudents,
  removeStudent as deleteStudent,
} from "../services/student.service";
import {
  addMeeting as createMeeting,
  editMeeting as updateMeeting,
  getMeetings as fetchMeetings,
} from "../services/meeting.service";
import {
  getMentors as fetchMentors,
  linkMentorToStudent as assignMentor,
} from "../services/mentor.service";
import {
  addScholarship as createScholarship,
  editScholarship as updateScholarship,
  listenScholarshipEvents as subscribeToScholarshipEvents,
} from "../services/scholarship.service";
import type {
  DashboardSummary,
  EnrollmentStatus,
  Meeting,
  MeetingStatus,
  Mentor,
  Scholarship,
  ScholarshipStatus,
  StudentDirectoryRecord,
  StudentProfilePayload,
} from "../types/index";
import {
  formatDate,
  formatDateOnly,
  isValidDateOnly,
} from "../utils/formatDate";
import {
  formatCurrency,
  toErrorMessage,
} from "../utils/helpers";
import {
  exportScholarshipSummaryCsv,
  exportScholarshipSummaryPdf,
} from "./dashboard/scholarshipSummaryExport";
import {
  exportStudentReportCsv,
  exportStudentReportPdf,
} from "./dashboard/studentReportExport";
import DirectoryPanel from "./dashboard/sections/DirectoryPanel";
import {
  defaultMeetingForm,
  defaultScholarshipForm,
  moduleTabOrder,
} from "./dashboard/constants";
import { emptyStudentForm, mapProfileToStudentForm } from "./dashboard/formState";
import HeroPanel from "./dashboard/sections/HeroPanel";
import MentorshipTab from "./dashboard/sections/MentorshipTab";
import ProfileDashboardTab from "./dashboard/sections/ProfileDashboardTab";
import ScholarshipsTab from "./dashboard/sections/ScholarshipsTab";
import SummaryDrilldownSection from "./dashboard/sections/SummaryDrilldownSection";
import type {
  MeetingFormState,
  ModuleTab,
  ScholarshipFormState,
  StudentFormState,
  SummaryListItem,
  SummaryView,
} from "./dashboard/types";

function StudentDirectory() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [activeSummaryView, setActiveSummaryView] = useState<SummaryView>("students");
  const [summaryStudentSearch, setSummaryStudentSearch] = useState("");
  const [selectedSummaryItemId, setSelectedSummaryItemId] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentDirectoryRecord[]>([]);
  const [studentForm, setStudentForm] = useState<StudentFormState>(emptyStudentForm());
  const [studentFormMode, setStudentFormMode] = useState<"create" | "edit">("create");
  const studentFormPanelRef = useRef<HTMLDivElement | null>(null);
  const workspacePanelRef = useRef<HTMLElement | null>(null);

  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [academicYear, setAcademicYear] = useState<
    "All" | "Freshman" | "Sophomore" | "Junior" | "Senior"
  >("All");
  const [enrollmentFilter, setEnrollmentFilter] = useState<"All" | EnrollmentStatus>("All");
  const [majorFilter, setMajorFilter] = useState("");

  const [profile, setProfile] = useState<StudentProfilePayload | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorError, setMentorError] = useState<string | null>(null);

  const [meetingRows, setMeetingRows] = useState<Meeting[]>([]);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [meetingSearch, setMeetingSearch] = useState("");

  const [moduleTab, setModuleTab] = useState<ModuleTab>("dashboard");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [enrollmentDraft, setEnrollmentDraft] = useState<EnrollmentStatus>("Full-time");
  const [mentorDraft, setMentorDraft] = useState("");

  const [scholarshipForm, setScholarshipForm] = useState<ScholarshipFormState>(defaultScholarshipForm);
  const [meetingForm, setMeetingForm] = useState<MeetingFormState>(defaultMeetingForm);

  const selectedStudentIdRef = useRef<string | null>(null);
  const loadDashboardSummaryRef = useRef<() => Promise<void>>(async () => undefined);
  const loadStudentsRef = useRef<() => Promise<void>>(async () => undefined);
  const loadStudentProfileRef = useRef<(studentId: string) => Promise<void>>(async () => undefined);

  const openStudentDashboard = (studentId: string) => {
    setSelectedStudentId(studentId);
    setModuleTab("dashboard");

    window.requestAnimationFrame(() => {
      const workspacePanel = workspacePanelRef.current;
      if (!workspacePanel) return;

      workspacePanel.scrollIntoView({ behavior: "smooth", block: "start" });
      workspacePanel.focus({ preventScroll: true });
    });
  };

  const handleModuleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentTab: ModuleTab,
  ): void => {
    const currentIndex = moduleTabOrder.indexOf(currentTab);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % moduleTabOrder.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + moduleTabOrder.length) % moduleTabOrder.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = moduleTabOrder.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = moduleTabOrder[nextIndex];
    setModuleTab(nextTab);

    const nextTabButton = document.getElementById(
      `module-tab-${nextTab}`,
    ) as HTMLButtonElement | null;
    nextTabButton?.focus();
  };

  const majors = useMemo(
    () => Array.from(new Set(students.map((student) => student.major))).sort(),
    [students],
  );

  const scholarshipSummary = useMemo(() => {
    const empty = {
      Researching: 0,
      Applied: 0,
      Interview: 0,
      Awarded: 0,
      Rejected: 0,
    };
    if (!profile) return empty;

    return profile.scholarships.reduce((acc, scholarship) => {
      acc[scholarship.status] += 1;
      return acc;
    }, empty);
  }, [profile]);

  const gpaTrendPoints = useMemo(() => {
    if (!profile) return [];

    return [...profile.academicProgress.gpaTrend].sort(
      (left, right) => new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
    );
  }, [profile]);

  const singleGpaTrendValue =
    gpaTrendPoints.length === 1 ? gpaTrendPoints[0]?.gpa ?? null : null;

  const summaryViewTitle = {
    students: "Students list",
    mentors: "Mentors list",
    scholarships: "Scholarships list",
    meetings: "Meetings list",
  }[activeSummaryView];

  const summaryViewItems = useMemo<SummaryListItem[]>(() => {
    if (!summary) return [];

    if (activeSummaryView === "students") {
      const query = summaryStudentSearch.trim().toLowerCase();

      return students
        .filter((student) => {
          if (!query) return true;
          return (
            student.name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.major.toLowerCase().includes(query)
          );
        })
        .map((student) => ({
          id: student.id,
          title: student.name,
          subtitle: `${student.major} · ${student.academicYear}`,
          meta: `${student.email} · ${student.enrollmentStatus}`,
          details: [
            { label: "Email", value: student.email },
            { label: "Major", value: student.major },
            { label: "Academic year", value: student.academicYear },
            { label: "Enrollment", value: student.enrollmentStatus },
            {
              label: "Scholarships tracked",
              value: String(student.quickStats.scholarshipsTracked),
            },
          ],
        }));
    }

    if (activeSummaryView === "mentors") {
      return mentors.map((mentor) => ({
        id: mentor.id,
        title: mentor.name,
        subtitle: `${mentor.title} · ${mentor.company}`,
        meta: `${mentor.activeMentees ?? 0}/${mentor.maxMentees} mentees · ${mentor.email}`,
        details: [
          { label: "Email", value: mentor.email },
          { label: "Company", value: mentor.company },
          { label: "Capacity", value: `${mentor.activeMentees ?? 0}/${mentor.maxMentees}` },
        ],
      }));
    }

    if (activeSummaryView === "scholarships") {
      return summary.upcomingDeadlines.map((scholarship) => ({
        id: scholarship.id,
        title: scholarship.name,
        subtitle: scholarship.provider,
        meta: `${formatCurrency(scholarship.amount, scholarship.currency)} · ${formatDateOnly(scholarship.deadline)} · ${scholarship.status}`,
        details: [
          { label: "Student ID", value: scholarship.studentId },
          {
            label: "Amount",
            value: formatCurrency(scholarship.amount, scholarship.currency),
          },
          { label: "Status", value: scholarship.status },
          { label: "Deadline", value: formatDateOnly(scholarship.deadline) },
        ],
      }));
    }

    return summary.scheduledMeetings.map((meeting) => ({
      id: meeting.id,
      title: `${mentors.find((mentor) => mentor.id === meeting.mentorId)?.name ?? meeting.mentorId} · ${formatDate(meeting.date)}`,
      subtitle: `${meeting.duration} min · ${meeting.status}`,
      meta: meeting.notes || "No notes",
      details: [
        { label: "Student ID", value: meeting.studentId },
        { label: "Mentor ID", value: meeting.mentorId },
        { label: "Status", value: meeting.status },
        { label: "Date", value: formatDate(meeting.date) },
      ],
    }));
  }, [activeSummaryView, mentors, students, summary, summaryStudentSearch]);

  const selectedSummaryItem = useMemo(
    () => summaryViewItems.find((item) => item.id === selectedSummaryItemId) ?? null,
    [selectedSummaryItemId, summaryViewItems],
  );

  useEffect(() => {
    if (!selectedSummaryItemId) return;
    if (summaryViewItems.some((item) => item.id === selectedSummaryItemId)) return;
    setSelectedSummaryItemId(null);
  }, [selectedSummaryItemId, summaryViewItems]);

  const loadDashboardSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const nextSummary = await fetchDashboardSummary();
      setSummary(nextSummary);
    } catch (error) {
      setSummaryError(toErrorMessage(error));
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    setStudentLoading(true);
    setStudentError(null);
    try {
      const studentDirectory = await fetchStudents({
        search: search.trim() || undefined,
        academicYear: academicYear === "All" ? undefined : academicYear,
        enrollmentStatus: enrollmentFilter === "All" ? undefined : enrollmentFilter,
        major: majorFilter.trim() || undefined,
      });

      const nextStudents = studentDirectory.students;

      setStudents(nextStudents);

      const activeId = selectedStudentIdRef.current;
      if (!activeId) {
        if (nextStudents.length > 0) {
          setSelectedStudentId(nextStudents[0].id);
        }
        return;
      }

      const activeStillExists = nextStudents.some((student) => student.id === activeId);
      if (!activeStillExists) {
        setSelectedStudentId(nextStudents[0]?.id ?? null);
      }
    } catch (error) {
      setStudentError(toErrorMessage(error));
    } finally {
      setStudentLoading(false);
    }
  }, [academicYear, enrollmentFilter, majorFilter, search]);

  const loadStudentProfile = useCallback(async (studentId: string) => {
    setProfileLoading(true);
    setMeetingLoading(true);
    setProfileError(null);
    try {
      const [nextProfile, nextMentors, nextMeetings] = await Promise.all([
        fetchStudentProfile(studentId),
        fetchMentors(),
        fetchMeetings(studentId, meetingSearch.trim() || undefined),
      ]);
      setProfile(nextProfile);
      setMentors(nextMentors);
      setMeetingRows(nextMeetings);
      setEnrollmentDraft(nextProfile.student.enrollmentStatus);
      setMentorDraft(nextProfile.mentorship.mentor?.id ?? "");
      setScholarshipForm(defaultScholarshipForm);
      setMeetingForm(defaultMeetingForm);
    } catch (error) {
      setProfile(null);
      setMeetingRows([]);
      setProfileError(toErrorMessage(error));
    } finally {
      setProfileLoading(false);
      setMeetingLoading(false);
    }
  }, [meetingSearch]);

  const loadMentors = useCallback(async () => {
    setMentorLoading(true);
    setMentorError(null);
    try {
      const nextMentors = await fetchMentors();
      setMentors(nextMentors);
    } catch (error) {
      setMentorError(toErrorMessage(error));
    } finally {
      setMentorLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardSummaryRef.current = loadDashboardSummary;
  }, [loadDashboardSummary]);

  useEffect(() => {
    loadStudentsRef.current = loadStudents;
  }, [loadStudents]);

  useEffect(() => {
    loadStudentProfileRef.current = loadStudentProfile;
  }, [loadStudentProfile]);

  useEffect(() => {
    selectedStudentIdRef.current = selectedStudentId;
  }, [selectedStudentId]);

  useEffect(() => {
    void loadDashboardSummary();
  }, [loadDashboardSummary]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (!selectedStudentId) {
      setProfile(null);
      setMeetingRows([]);
      return;
    }

    void loadStudentProfile(selectedStudentId);
  }, [loadStudentProfile, selectedStudentId]);

  useEffect(() => {
    if (!selectedStudentId) {
      setMeetingLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMeetingLoading(true);
      void fetchMeetings(selectedStudentId, meetingSearch.trim() || undefined)
        .then((nextRows) => {
          setMeetingError(null);
          setMeetingRows(nextRows);
        })
        .catch((error) => {
          setMeetingError(toErrorMessage(error));
        })
        .finally(() => {
          setMeetingLoading(false);
        });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [meetingSearch, selectedStudentId]);

  useEffect(() => {
    const unsubscribe = subscribeToScholarshipEvents((event) => {
      if (event.type === "ready" || event.type === "heartbeat") {
        return;
      }

      setActionMessage(`Realtime update: ${event.type}`);
      const activeId = selectedStudentIdRef.current;
      void loadDashboardSummaryRef.current();
      void loadStudentsRef.current();
      if (activeId) {
        void loadStudentProfileRef.current(activeId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [actionMessage]);

  const withAction = async (operation: () => Promise<void>): Promise<void> => {
    setSaving(true);
    setActionError(null);
    setActionMessage(null);
    try {
      await operation();
    } catch (error) {
      setActionError(toErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const runExport = async (
    operation: () => Promise<void> | void,
    successMessage: string,
  ): Promise<void> => {
    setActionError(null);
    setActionMessage(null);
    try {
      await operation();
      setActionMessage(successMessage);
    } catch (error) {
      setActionError(toErrorMessage(error));
    }
  };

  const resetStudentForm = () => {
    setStudentForm(emptyStudentForm());
    setStudentFormMode("create");
  };

  const handleStudentFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    void withAction(async () => {
      const expectedGraduation = studentForm.expectedGraduation.trim();
      if (!isValidDateOnly(expectedGraduation)) {
        throw new Error("Expected graduation must use YYYY-MM-DD format.");
      }

      const payload = {
        firstName: studentForm.firstName.trim(),
        lastName: studentForm.lastName.trim(),
        email: studentForm.email.trim(),
        avatarUrl: studentForm.avatarUrl.trim() || undefined,
        academicYear: studentForm.academicYear,
        major: studentForm.major.trim(),
        gpa: Number(studentForm.gpa),
        enrollmentStatus: studentForm.enrollmentStatus,
        creditsCompleted: Number(studentForm.creditsCompleted),
        creditsRequired: Number(studentForm.creditsRequired),
        expectedGraduation,
        demographics: {
          firstGeneration: studentForm.firstGeneration,
          lowIncome: studentForm.lowIncome,
          underrepresentedMinority: studentForm.underrepresentedMinority,
        },
        assignedMentorId: studentForm.assignedMentorId || null,
      };

      if (studentFormMode === "create") {
        const created = await createStudent(payload);
        setSelectedStudentId(created.id);
        await loadDashboardSummary();
        await loadStudents();
        await loadStudentProfile(created.id);
        setActionMessage("Student created.");
        return;
      }

      if (!selectedStudentId) return;
      await updateStudent(selectedStudentId, payload);
      await loadDashboardSummary();
      await loadStudents();
      await loadStudentProfile(selectedStudentId);
      setActionMessage("Student updated.");
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudentId) return;

    const confirmed = window.confirm("Delete this student and related scholarships/meetings?");
    if (!confirmed) return;

    void withAction(async () => {
      await deleteStudent(selectedStudentId);
      resetStudentForm();
      await loadDashboardSummary();
      await loadStudents();
      setActionMessage("Student deleted.");
    });
  };

  const handleEditInForm = () => {
    if (!profile) return;

    setStudentForm(mapProfileToStudentForm(profile));
    setStudentFormMode("edit");
    studentFormPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEnrollmentSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedStudentId) return;

    void withAction(async () => {
      await updateStudent(selectedStudentId, { enrollmentStatus: enrollmentDraft });
      await loadDashboardSummary();
      await loadStudents();
      await loadStudentProfile(selectedStudentId);
      setActionMessage("Enrollment status updated.");
    });
  };

  const handleMentorAssign = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedStudentId || !mentorDraft) return;

    void withAction(async () => {
      await assignMentor(selectedStudentId, mentorDraft);
      await loadStudentProfile(selectedStudentId);
      await loadMentors();
      setActionMessage("Mentor assignment updated.");
    });
  };

  const handleScholarshipSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedStudentId) return;

    void withAction(async () => {
      await createScholarship(selectedStudentId, {
        name: scholarshipForm.name,
        provider: scholarshipForm.provider,
        amount: Number(scholarshipForm.amount),
        currency: scholarshipForm.currency || "USD",
        status: scholarshipForm.status,
        deadline: new Date(scholarshipForm.deadline).toISOString(),
        requirements: scholarshipForm.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        essayRequired: scholarshipForm.essayRequired,
        essaySubmitted: scholarshipForm.essayRequired
          ? scholarshipForm.essaySubmitted
          : undefined,
        notes: scholarshipForm.notes,
        dateApplied: scholarshipForm.dateApplied
          ? new Date(scholarshipForm.dateApplied).toISOString()
          : undefined,
      });

      await loadStudentProfile(selectedStudentId);
      setScholarshipForm(defaultScholarshipForm);
      setActionMessage("Scholarship application added.");
    });
  };

  const handleScholarshipStatusChange = (scholarship: Scholarship, nextStatus: ScholarshipStatus) => {
    if (!selectedStudentId) return;

    void withAction(async () => {
      await updateScholarship(scholarship.id, { status: nextStatus });
      await loadStudentProfile(selectedStudentId);
      setActionMessage(`Scholarship moved to ${nextStatus}.`);
    });
  };

  const handleMeetingSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedStudentId) return;

    void withAction(async () => {
      await createMeeting(selectedStudentId, {
        mentorId: meetingForm.mentorId || undefined,
        date: new Date(meetingForm.date).toISOString(),
        duration: Number(meetingForm.duration),
        status: meetingForm.status,
        notes: meetingForm.notes,
        actionItems: meetingForm.actionItems
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      await loadStudentProfile(selectedStudentId);
      setMeetingForm(defaultMeetingForm);
      setActionMessage("New mentorship meeting scheduled.");
    });
  };

  const handleMeetingStatusChange = (meeting: Meeting, status: MeetingStatus) => {
    if (!selectedStudentId) return;

    void withAction(async () => {
      await updateMeeting(meeting.id, { status });
      const refreshed = await fetchMeetings(selectedStudentId, meetingSearch.trim() || undefined);
      setMeetingRows(refreshed);
      setActionMessage(`Meeting status updated to ${status}.`);
    });
  };

  const handleExportStudentReportCsv = () => {
    if (!profile) return;

    void runExport(() => exportStudentReportCsv(profile), "Student report exported as CSV.");
  };

  const handleExportStudentReportPdf = () => {
    if (!profile) return;

    void runExport(() => exportStudentReportPdf(profile), "Student report exported as PDF.");
  };

  const handleExportScholarshipSummaryCsv = () => {
    if (!summary) return;

    void runExport(() => exportScholarshipSummaryCsv(summary), "Scholarship summary exported as CSV.");
  };

  const handleExportScholarshipSummaryPdf = () => {
    if (!summary) return;

    void runExport(() => exportScholarshipSummaryPdf(summary), "Scholarship summary exported as PDF.");
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace-main">
        Skip to student workspace
      </a>

      <HeroPanel
        summaryLoading={summaryLoading}
        summaryError={summaryError}
        summary={summary}
        activeSummaryView={activeSummaryView}
        onChangeActiveSummaryView={setActiveSummaryView}
      />

      {summary ? (
        <SummaryDrilldownSection
          summaryViewTitle={summaryViewTitle}
          activeSummaryView={activeSummaryView}
          summaryStudentSearch={summaryStudentSearch}
          onSummaryStudentSearchChange={setSummaryStudentSearch}
          onExportScholarshipSummaryCsv={handleExportScholarshipSummaryCsv}
          onExportScholarshipSummaryPdf={handleExportScholarshipSummaryPdf}
          mentorLoading={mentorLoading}
          mentorError={mentorError}
          summaryViewItems={summaryViewItems}
          selectedSummaryItemId={selectedSummaryItemId}
          onSelectSummaryItemId={setSelectedSummaryItemId}
          selectedSummaryItem={selectedSummaryItem}
          onOpenStudentDashboard={openStudentDashboard}
        />
      ) : null}

      <div className="layout-grid">
        <DirectoryPanel
          search={search}
          onSearchChange={setSearch}
          academicYear={academicYear}
          onAcademicYearChange={setAcademicYear}
          enrollmentFilter={enrollmentFilter}
          onEnrollmentFilterChange={setEnrollmentFilter}
          majorFilter={majorFilter}
          onMajorFilterChange={setMajorFilter}
          majors={majors}
          studentLoading={studentLoading}
          studentError={studentError}
          students={students}
          selectedStudentId={selectedStudentId}
          onSelectStudent={setSelectedStudentId}
          studentFormMode={studentFormMode}
          onResetStudentForm={resetStudentForm}
          onEditInForm={handleEditInForm}
          profile={profile}
          studentFormPanelRef={studentFormPanelRef}
          onStudentFormSubmit={handleStudentFormSubmit}
          studentForm={studentForm}
          setStudentForm={setStudentForm}
          mentors={mentors}
          mentorLoading={mentorLoading}
          mentorError={mentorError}
          saving={saving}
        />

        <main ref={workspacePanelRef} className="panel workspace-panel" id="workspace-main" tabIndex={-1}>
          <div className="panel-header">
            <h2>Student Workspace</h2>
            <p>Modules 02, 03, and 04</p>
          </div>

          <div className="tab-row" role="tablist" aria-label="Dashboard modules">
            <button
              id="module-tab-dashboard"
              role="tab"
              aria-selected={moduleTab === "dashboard"}
              aria-controls="module-panel-dashboard"
              tabIndex={moduleTab === "dashboard" ? 0 : -1}
              className={moduleTab === "dashboard" ? "active" : ""}
              onClick={() => setModuleTab("dashboard")}
              onKeyDown={(event) => handleModuleTabKeyDown(event, "dashboard")}
            >
              Module 02 - Profile Dashboard
            </button>
            <button
              id="module-tab-scholarships"
              role="tab"
              aria-selected={moduleTab === "scholarships"}
              aria-controls="module-panel-scholarships"
              tabIndex={moduleTab === "scholarships" ? 0 : -1}
              className={moduleTab === "scholarships" ? "active" : ""}
              onClick={() => setModuleTab("scholarships")}
              onKeyDown={(event) => handleModuleTabKeyDown(event, "scholarships")}
            >
              Module 03 - Scholarship Management
            </button>
            <button
              id="module-tab-mentorship"
              role="tab"
              aria-selected={moduleTab === "mentorship"}
              aria-controls="module-panel-mentorship"
              tabIndex={moduleTab === "mentorship" ? 0 : -1}
              className={moduleTab === "mentorship" ? "active" : ""}
              onClick={() => setModuleTab("mentorship")}
              onKeyDown={(event) => handleModuleTabKeyDown(event, "mentorship")}
            >
              Module 04 - Mentorship & Meetings
            </button>
          </div>

          {actionMessage ? (
            <p role="status" aria-live="polite" aria-atomic="true" className="success-inline">
              {actionMessage}
            </p>
          ) : null}

          {saving ? (
            <p role="status" aria-live="polite" aria-atomic="true" className="loading-inline">
              Saving changes...
            </p>
          ) : null}

          {actionError ? (
            <p role="alert" aria-live="assertive" aria-atomic="true" className="error-inline">
              {actionError}
            </p>
          ) : null}

          {profile ? (
            <div className="row-inline export-actions" role="group" aria-label="Student report exports">
              <span className="export-label">Export student report</span>
              <button
                type="button"
                className="ghost-button"
                onClick={handleExportStudentReportCsv}
                aria-label="Export selected student report as CSV"
              >
                CSV
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={handleExportStudentReportPdf}
                aria-label="Export selected student report as PDF"
              >
                PDF
              </button>
            </div>
          ) : null}

          {!selectedStudentId ? (
            <p className="muted">Select a student from Module 01 to view dashboard details.</p>
          ) : profileLoading ? (
            <p role="status" className="loading-inline">
              Loading student profile...
            </p>
          ) : profileError ? (
            <p role="alert" className="error-inline">
              {profileError}
            </p>
          ) : !profile ? null : moduleTab === "dashboard" ? (
            <ProfileDashboardTab
              profile={profile}
              enrollmentDraft={enrollmentDraft}
              onEnrollmentDraftChange={setEnrollmentDraft}
              onEnrollmentSubmit={handleEnrollmentSubmit}
              saving={saving}
              onEditInForm={handleEditInForm}
              onDeleteStudent={handleDeleteStudent}
              gpaTrendPoints={gpaTrendPoints}
              singleGpaTrendValue={singleGpaTrendValue}
              scholarshipSummary={scholarshipSummary}
            />
          ) : moduleTab === "scholarships" ? (
            <ScholarshipsTab
              profile={profile}
              saving={saving}
              onScholarshipStatusChange={handleScholarshipStatusChange}
              scholarshipForm={scholarshipForm}
              setScholarshipForm={setScholarshipForm}
              onScholarshipSubmit={handleScholarshipSubmit}
            />
          ) : (
            <MentorshipTab
              profile={profile}
              mentorDraft={mentorDraft}
              onMentorDraftChange={setMentorDraft}
              mentors={mentors}
              mentorLoading={mentorLoading}
              mentorError={mentorError}
              onMentorAssign={handleMentorAssign}
              saving={saving}
              meetingForm={meetingForm}
              setMeetingForm={setMeetingForm}
              onMeetingSubmit={handleMeetingSubmit}
              meetingSearch={meetingSearch}
              onMeetingSearchChange={setMeetingSearch}
              meetingLoading={meetingLoading}
              meetingError={meetingError}
              meetingRows={meetingRows}
              onMeetingStatusChange={handleMeetingStatusChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentDirectory;
