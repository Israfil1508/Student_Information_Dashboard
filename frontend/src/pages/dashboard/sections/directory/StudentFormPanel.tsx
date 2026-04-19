import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import type {
  EnrollmentStatus,
  Mentor,
  StudentProfilePayload,
} from "../../../../types/index";
import { enrollmentStatuses } from "../../constants";
import type { StudentFormState } from "../../types";

type StudentFormPanelProps = {
  studentFormMode: "create" | "edit";
  onResetStudentForm: () => void;
  onEditInForm: () => void;
  profile: StudentProfilePayload | null;
  studentFormPanelRef: RefObject<HTMLDivElement | null>;
  onStudentFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  studentForm: StudentFormState;
  setStudentForm: Dispatch<SetStateAction<StudentFormState>>;
  mentors: Mentor[];
  mentorLoading: boolean;
  mentorError: string | null;
  saving: boolean;
};

function StudentFormPanel({
  studentFormMode,
  onResetStudentForm,
  onEditInForm,
  profile,
  studentFormPanelRef,
  onStudentFormSubmit,
  studentForm,
  setStudentForm,
  mentors,
  mentorLoading,
  mentorError,
  saving,
}: StudentFormPanelProps) {
  return (
    <>
      <div className="directory-mode-row" aria-label="Student form options">
        <span>Add/Update options</span>
        <div className="row-inline">
          <button
            type="button"
            className={`ghost-button ${studentFormMode === "create" ? "is-selected" : ""}`}
            onClick={onResetStudentForm}
          >
            Add student
          </button>
          <button
            type="button"
            className={`ghost-button ${studentFormMode === "edit" ? "is-selected" : ""}`}
            onClick={onEditInForm}
            disabled={!profile}
          >
            Update student
          </button>
        </div>
      </div>

      <div className="form-panel" ref={studentFormPanelRef}>
        <div className="row-inline spread">
          <strong>{studentFormMode === "create" ? "Add Student" : "Update Student"}</strong>
          {studentFormMode === "edit" && profile ? (
            <small>
              Editing {profile.student.firstName} {profile.student.lastName}
            </small>
          ) : null}
        </div>

        <form className="form-grid compact-form" onSubmit={onStudentFormSubmit}>
          <div className="two-col">
            <label>
              First name
              <input
                required
                value={studentForm.firstName}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, firstName: event.target.value }))
                }
              />
            </label>
            <label>
              Last name
              <input
                required
                value={studentForm.lastName}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, lastName: event.target.value }))
                }
              />
            </label>
          </div>

          <label>
            Email
            <input
              required
              type="email"
              value={studentForm.email}
              onChange={(event) =>
                setStudentForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </label>

          <label>
            Avatar URL
            <input
              value={studentForm.avatarUrl}
              onChange={(event) =>
                setStudentForm((prev) => ({ ...prev, avatarUrl: event.target.value }))
              }
            />
          </label>

          <div className="two-col">
            <label>
              Academic year
              <select
                value={studentForm.academicYear}
                onChange={(event) =>
                  setStudentForm((prev) => ({
                    ...prev,
                    academicYear: event.target.value as StudentFormState["academicYear"],
                  }))
                }
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>
            <label>
              Enrollment status
              <select
                value={studentForm.enrollmentStatus}
                onChange={(event) =>
                  setStudentForm((prev) => ({
                    ...prev,
                    enrollmentStatus: event.target.value as EnrollmentStatus,
                  }))
                }
              >
                {enrollmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Major
            <input
              required
              value={studentForm.major}
              onChange={(event) =>
                setStudentForm((prev) => ({ ...prev, major: event.target.value }))
              }
            />
          </label>

          <div className="two-col">
            <label>
              GPA
              <input
                required
                type="number"
                min={0}
                max={4}
                step="0.01"
                value={studentForm.gpa}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, gpa: event.target.value }))
                }
              />
            </label>
            <label>
              Credits completed
              <input
                required
                type="number"
                min={0}
                value={studentForm.creditsCompleted}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, creditsCompleted: event.target.value }))
                }
              />
            </label>
          </div>

          <div className="two-col">
            <label>
              Credits required
              <input
                required
                type="number"
                min={1}
                value={studentForm.creditsRequired}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, creditsRequired: event.target.value }))
                }
              />
            </label>
            <label>
              Expected graduation
              <input
                required
                type="date"
                value={studentForm.expectedGraduation}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, expectedGraduation: event.target.value }))
                }
              />
            </label>
          </div>

          <label>
            Assigned mentor
            <select
              value={studentForm.assignedMentorId}
              onChange={(event) =>
                setStudentForm((prev) => ({ ...prev, assignedMentorId: event.target.value }))
              }
            >
              <option value="">No mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </label>

          {mentorLoading ? (
            <p role="status" className="loading-inline">
              Loading mentors...
            </p>
          ) : null}

          {mentorError ? (
            <p role="alert" className="error-inline">
              {mentorError}
            </p>
          ) : null}

          <div className="two-col">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={studentForm.firstGeneration}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, firstGeneration: event.target.checked }))
                }
              />
              First generation
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={studentForm.lowIncome}
                onChange={(event) =>
                  setStudentForm((prev) => ({ ...prev, lowIncome: event.target.checked }))
                }
              />
              Low income
            </label>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={studentForm.underrepresentedMinority}
              onChange={(event) =>
                setStudentForm((prev) => ({
                  ...prev,
                  underrepresentedMinority: event.target.checked,
                }))
              }
            />
            Underrepresented minority
          </label>

          <button type="submit" disabled={saving}>
            {studentFormMode === "create" ? "Create student" : "Update student"}
          </button>
        </form>
      </div>
    </>
  );
}

export default StudentFormPanel;
