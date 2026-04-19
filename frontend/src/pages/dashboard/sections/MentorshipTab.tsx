import type { Dispatch, FormEvent, SetStateAction } from "react";
import { formatDate } from "../../../utils/helpers";
import type {
  Meeting,
  MeetingStatus,
  Mentor,
  StudentProfilePayload,
} from "../../../types/index";
import { meetingStatuses } from "../constants";
import StatusPill from "../components/StatusPill";
import type { MeetingFormState } from "../types";

type MentorshipTabProps = {
  profile: StudentProfilePayload;
  mentorDraft: string;
  onMentorDraftChange: (value: string) => void;
  mentors: Mentor[];
  mentorLoading: boolean;
  mentorError: string | null;
  onMentorAssign: (event: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  meetingForm: MeetingFormState;
  setMeetingForm: Dispatch<SetStateAction<MeetingFormState>>;
  onMeetingSubmit: (event: FormEvent<HTMLFormElement>) => void;
  meetingSearch: string;
  onMeetingSearchChange: (value: string) => void;
  meetingLoading: boolean;
  meetingError: string | null;
  meetingRows: Meeting[];
  onMeetingStatusChange: (meeting: Meeting, status: MeetingStatus) => void;
};

function MentorshipTab({
  profile,
  mentorDraft,
  onMentorDraftChange,
  mentors,
  mentorLoading,
  mentorError,
  onMentorAssign,
  saving,
  meetingForm,
  setMeetingForm,
  onMeetingSubmit,
  meetingSearch,
  onMeetingSearchChange,
  meetingLoading,
  meetingError,
  meetingRows,
  onMeetingStatusChange,
}: MentorshipTabProps) {
  return (
    <section
      id="module-panel-mentorship"
      role="tabpanel"
      aria-labelledby="module-tab-mentorship"
      aria-label="Module 4 mentorship and meetings"
      className="module-grid mentorship-layout"
    >
      <article className="module-card">
        <p className="eyebrow">Mentor Assignment</p>
        <h3>Current Mentor</h3>
        {profile.mentorship.mentor ? (
          <div className="mentor-card">
            <p>{profile.mentorship.mentor.name}</p>
            <p>{profile.mentorship.mentor.title}</p>
            <p>{profile.mentorship.mentor.company}</p>
            <p>{profile.mentorship.mentor.email}</p>
          </div>
        ) : (
          <p className="muted">No mentor currently assigned.</p>
        )}

        <form className="inline-form" onSubmit={onMentorAssign}>
          <label>
            Assign / reassign mentor
            <select
              value={mentorDraft}
              onChange={(event) => onMentorDraftChange(event.target.value)}
              disabled={mentorLoading}
            >
              <option value="">Choose mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name} ({mentor.activeMentees ?? 0}/{mentor.maxMentees})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={saving || !mentorDraft}>
            Save mentor
          </button>
        </form>

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
      </article>

      <article className="module-card">
        <p className="eyebrow">Schedule Meeting</p>
        <h3>New Session</h3>
        <form className="form-grid" onSubmit={onMeetingSubmit}>
          <label>
            Date and time
            <input
              required
              type="datetime-local"
              value={meetingForm.date}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, date: event.target.value }))
              }
            />
          </label>

          <label>
            Duration (minutes)
            <input
              required
              type="number"
              min={10}
              max={300}
              value={meetingForm.duration}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, duration: Number(event.target.value) }))
              }
            />
          </label>

          <label>
            Status
            <select
              value={meetingForm.status}
              onChange={(event) =>
                setMeetingForm((prev) => ({
                  ...prev,
                  status: event.target.value as MeetingStatus,
                }))
              }
            >
              {meetingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Mentor
            <select
              value={meetingForm.mentorId}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, mentorId: event.target.value }))
              }
            >
              <option value="">Assigned mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Notes
            <textarea
              rows={3}
              value={meetingForm.notes}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, notes: event.target.value }))
              }
            />
          </label>

          <label>
            Action items (one per line)
            <textarea
              rows={3}
              value={meetingForm.actionItems}
              onChange={(event) =>
                setMeetingForm((prev) => ({ ...prev, actionItems: event.target.value }))
              }
            />
          </label>

          <button type="submit" disabled={saving}>
            Schedule meeting
          </button>
        </form>
      </article>

      <article className="module-card wide-card">
        <div className="row-inline spread">
          <div>
            <p className="eyebrow">Meeting History</p>
            <h3>Chronological Log</h3>
          </div>
          <label>
            Search notes
            <input
              type="search"
              value={meetingSearch}
              onChange={(event) => onMeetingSearchChange(event.target.value)}
              placeholder="Search notes or action items"
            />
          </label>
        </div>

        {meetingLoading ? (
          <p role="status" className="loading-inline">
            Loading meetings...
          </p>
        ) : meetingError ? (
          <p role="alert" className="error-inline">
            {meetingError}
          </p>
        ) : meetingRows.length === 0 ? (
          <p className="muted">No meetings match this search.</p>
        ) : (
          <ul className="timeline-list">
            {meetingRows.map((meeting) => (
              <li key={meeting.id} className="timeline-item">
                <div>
                  <p>
                    <strong>{formatDate(meeting.date)}</strong> - {meeting.duration} minutes
                  </p>
                  <p>{meeting.mentorName || "Mentor"}</p>
                  <p>{meeting.notes || "No notes"}</p>
                  {meeting.actionItems.length > 0 ? (
                    <p>Action items: {meeting.actionItems.join(" | ")}</p>
                  ) : null}
                </div>
                <div className="timeline-actions">
                  <StatusPill text={meeting.status} />
                  <select
                    value={meeting.status}
                    onChange={(event) =>
                      onMeetingStatusChange(meeting, event.target.value as MeetingStatus)
                    }
                    disabled={saving}
                    aria-label={`Update meeting status for ${meeting.id}`}
                  >
                    {meetingStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

export default MentorshipTab;
