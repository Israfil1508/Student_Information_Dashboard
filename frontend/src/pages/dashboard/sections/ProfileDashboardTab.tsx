import type { FormEvent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateOnly } from "../../../utils/helpers";
import type { EnrollmentStatus, ScholarshipStatus, StudentProfilePayload } from "../../../types/index";
import StatusPill from "../components/StatusPill";
import { enrollmentStatuses, scholarshipStatuses } from "../constants";

type ProfileDashboardTabProps = {
  profile: StudentProfilePayload;
  enrollmentDraft: EnrollmentStatus;
  onEnrollmentDraftChange: (value: EnrollmentStatus) => void;
  onEnrollmentSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  onEditInForm: () => void;
  onDeleteStudent: () => void;
  gpaTrendPoints: StudentProfilePayload["academicProgress"]["gpaTrend"];
  singleGpaTrendValue: number | null;
  scholarshipSummary: Record<ScholarshipStatus, number>;
};

function ProfileDashboardTab({
  profile,
  enrollmentDraft,
  onEnrollmentDraftChange,
  onEnrollmentSubmit,
  saving,
  onEditInForm,
  onDeleteStudent,
  gpaTrendPoints,
  singleGpaTrendValue,
  scholarshipSummary,
}: ProfileDashboardTabProps) {
  return (
    <section
      id="module-panel-dashboard"
      role="tabpanel"
      aria-labelledby="module-tab-dashboard"
      aria-label="Module 2 student profile dashboard"
      className="module-grid"
    >
      <article className="module-card profile-header">
        <div className="profile-header-main">
          <img
            className="profile-avatar"
            src={
              profile.student.avatarUrl ||
              `https://api.dicebear.com/9.x/thumbs/svg?seed=${profile.student.firstName}${profile.student.lastName}`
            }
            alt={`${profile.student.firstName} ${profile.student.lastName} avatar`}
          />

          <div>
            <p className="eyebrow">Profile Header</p>
            <h3>
              {profile.student.firstName} {profile.student.lastName}
            </h3>
            <p>{profile.student.email}</p>
            <p>
              {profile.student.major} | {profile.student.academicYear}
            </p>
            <div className="row-inline">
              <StatusPill text={profile.student.enrollmentStatus} />
              <span>Expected graduation: {formatDateOnly(profile.student.expectedGraduation)}</span>
            </div>
            <div className="row-inline profile-demographics" aria-label="Student demographics">
              <span className="demographic-chip">
                First generation: {profile.student.demographics.firstGeneration ? "Yes" : "No"}
              </span>
              <span className="demographic-chip">
                Low income: {profile.student.demographics.lowIncome ? "Yes" : "No"}
              </span>
              <span className="demographic-chip">
                Underrepresented minority: {profile.student.demographics.underrepresentedMinority ? "Yes" : "No"}
              </span>
            </div>
            <div className="row-inline action-row">
              <button type="button" className="ghost-button" onClick={onEditInForm}>
                Edit in form
              </button>
              <button type="button" className="danger-button" onClick={onDeleteStudent}>
                Delete student
              </button>
            </div>
          </div>
        </div>

        <form className="inline-form" onSubmit={onEnrollmentSubmit}>
          <label>
            Update enrollment status
            <select
              value={enrollmentDraft}
              onChange={(event) => onEnrollmentDraftChange(event.target.value as EnrollmentStatus)}
            >
              {enrollmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={saving}>
            Save status
          </button>
        </form>
      </article>

      <article className="module-card">
        <p className="eyebrow">Academic Progress</p>
        <h3>GPA Trend</h3>
        <div className="chart-wrap" aria-label="GPA trend chart">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gpaTrendPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.15)" />
              <XAxis dataKey="term" />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              {singleGpaTrendValue !== null ? (
                <ReferenceLine y={singleGpaTrendValue} stroke="#1d4ed8" strokeDasharray="5 5" />
              ) : null}
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#1d4ed8"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {singleGpaTrendValue !== null ? (
          <p className="muted">
            Only one GPA record is available for this student. Update GPA to build a fuller trend.
          </p>
        ) : null}

        <div className="progress-row" aria-label="Credit completion">
          <div>
            <p>Credits completed</p>
            <strong>
              {profile.academicProgress.creditsCompleted}/{profile.academicProgress.creditsRequired}
            </strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={profile.academicProgress.completionPercent}
          >
            <span style={{ width: `${profile.academicProgress.completionPercent}%` }} />
          </div>
          <p>{profile.academicProgress.completionPercent}% completed</p>
        </div>

        <div className="current-courses" aria-label="Current courses">
          <p>Current courses</p>
          {profile.academicProgress.currentCourses.length === 0 ? (
            <p className="muted">No current courses recorded yet.</p>
          ) : (
            <ul className="course-list">
              {profile.academicProgress.currentCourses.map((course) => (
                <li key={course}>{course}</li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <article className="module-card">
        <p className="eyebrow">Scholarship Snapshot</p>
        <h3>Current Pipeline</h3>
        <div className="status-summary-grid">
          {scholarshipStatuses.map((status) => (
            <div key={status}>
              <span>{status}</span>
              <strong>{scholarshipSummary[status]}</strong>
            </div>
          ))}
        </div>
      </article>

      <article className="module-card">
        <p className="eyebrow">Mentorship Panel</p>
        <h3>Assigned Mentor</h3>
        {profile.mentorship.mentor ? (
          <>
            <p>
              {profile.mentorship.mentor.name} - {profile.mentorship.mentor.title}
            </p>
            <p>{profile.mentorship.mentor.company}</p>
            <p>{profile.mentorship.mentor.email}</p>
          </>
        ) : (
          <p>No mentor assigned yet.</p>
        )}
        <p>
          Meetings logged: <strong>{profile.mentorship.meetings.length}</strong>
        </p>
      </article>
    </section>
  );
}

export default ProfileDashboardTab;
