import type { Dispatch, FormEvent, SetStateAction } from "react";
import { formatCurrency, formatDateOnly } from "../../../utils/helpers";
import type {
  Scholarship,
  ScholarshipStatus,
  StudentProfilePayload,
} from "../../../types/index";
import { scholarshipStatuses } from "../constants";
import type { ScholarshipFormState } from "../types";

type ScholarshipsTabProps = {
  profile: StudentProfilePayload;
  saving: boolean;
  onScholarshipStatusChange: (scholarship: Scholarship, status: ScholarshipStatus) => void;
  scholarshipForm: ScholarshipFormState;
  setScholarshipForm: Dispatch<SetStateAction<ScholarshipFormState>>;
  onScholarshipSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ScholarshipsTab({
  profile,
  saving,
  onScholarshipStatusChange,
  scholarshipForm,
  setScholarshipForm,
  onScholarshipSubmit,
}: ScholarshipsTabProps) {
  return (
    <section
      id="module-panel-scholarships"
      role="tabpanel"
      aria-labelledby="module-tab-scholarships"
      aria-label="Module 3 scholarship management"
      className="module-grid scholarship-layout"
    >
      <article className="module-card wide-card">
        <p className="eyebrow">Scholarship Tracker</p>
        <h3>Applications</h3>
        {profile.scholarships.length === 0 ? (
          <p className="muted">No scholarship records yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Provider</th>
                  <th>Amount</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Requirements</th>
                </tr>
              </thead>
              <tbody>
                {profile.scholarships.map((scholarship) => (
                  <tr key={scholarship.id}>
                    <td>{scholarship.name}</td>
                    <td>{scholarship.provider}</td>
                    <td>{formatCurrency(scholarship.amount, scholarship.currency)}</td>
                    <td>{formatDateOnly(scholarship.deadline)}</td>
                    <td>
                      <select
                        value={scholarship.status}
                        onChange={(event) =>
                          onScholarshipStatusChange(
                            scholarship,
                            event.target.value as ScholarshipStatus,
                          )
                        }
                        disabled={saving}
                        aria-label={`Update status for ${scholarship.name}`}
                      >
                        {scholarshipStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{scholarship.requirements.join(", ") || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="module-card">
        <p className="eyebrow">Add Scholarship</p>
        <h3>New Application</h3>
        <form className="form-grid" onSubmit={onScholarshipSubmit}>
          <label>
            Scholarship name
            <input
              required
              value={scholarshipForm.name}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </label>

          <label>
            Provider
            <input
              required
              value={scholarshipForm.provider}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, provider: event.target.value }))
              }
            />
          </label>

          <label>
            Amount
            <input
              required
              type="number"
              min={1}
              value={scholarshipForm.amount}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
              }
            />
          </label>

          <label>
            Deadline
            <input
              required
              type="datetime-local"
              value={scholarshipForm.deadline}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, deadline: event.target.value }))
              }
            />
          </label>

          <label>
            Initial status
            <select
              value={scholarshipForm.status}
              onChange={(event) =>
                setScholarshipForm((prev) => ({
                  ...prev,
                  status: event.target.value as ScholarshipStatus,
                }))
              }
            >
              {scholarshipStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={scholarshipForm.essayRequired}
              onChange={(event) =>
                setScholarshipForm((prev) => ({
                  ...prev,
                  essayRequired: event.target.checked,
                }))
              }
            />
            Essay required
          </label>

          <label>
            Requirements (one per line)
            <textarea
              rows={3}
              value={scholarshipForm.requirements}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, requirements: event.target.value }))
              }
            />
          </label>

          <label>
            Notes
            <textarea
              rows={3}
              value={scholarshipForm.notes}
              onChange={(event) =>
                setScholarshipForm((prev) => ({ ...prev, notes: event.target.value }))
              }
            />
          </label>

          <button type="submit" disabled={saving}>
            Add scholarship
          </button>
        </form>
      </article>
    </section>
  );
}

export default ScholarshipsTab;
