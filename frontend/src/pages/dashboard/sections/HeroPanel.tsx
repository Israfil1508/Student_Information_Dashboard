import type { DashboardSummary } from "../../../types/index";
import MetricCard from "../components/MetricCard";
import type { SummaryView } from "../types";

type HeroPanelProps = {
  summaryLoading: boolean;
  summaryError: string | null;
  summary: DashboardSummary | null;
  activeSummaryView: SummaryView;
  onChangeActiveSummaryView: (view: SummaryView) => void;
};

function HeroPanel({
  summaryLoading,
  summaryError,
  summary,
  activeSummaryView,
  onChangeActiveSummaryView,
}: HeroPanelProps) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">Access to Education</p>
        <h1>Student Information Dashboard</h1>
        <p>
          Real-time counselor workspace for academics, scholarships, and mentorship continuity.
        </p>
      </div>

      {summaryLoading ? (
        <p role="status" className="loading-inline">
          Loading summary...
        </p>
      ) : summaryError ? (
        <p role="alert" className="error-inline">
          {summaryError}
        </p>
      ) : summary ? (
        <div className="summary-grid" aria-label="Program summary">
          <button
            type="button"
            className={`metric-button ${activeSummaryView === "students" ? "is-active" : ""}`}
            onClick={() => onChangeActiveSummaryView("students")}
          >
            <MetricCard label="Students" value={summary.totalStudents} />
          </button>
          <button
            type="button"
            className={`metric-button ${activeSummaryView === "mentors" ? "is-active" : ""}`}
            onClick={() => onChangeActiveSummaryView("mentors")}
          >
            <MetricCard label="Mentors" value={summary.totalMentors} />
          </button>
          <button
            type="button"
            className={`metric-button ${activeSummaryView === "scholarships" ? "is-active" : ""}`}
            onClick={() => onChangeActiveSummaryView("scholarships")}
          >
            <MetricCard label="Scholarships" value={summary.totalScholarships} />
          </button>
          <button
            type="button"
            className={`metric-button ${activeSummaryView === "meetings" ? "is-active" : ""}`}
            onClick={() => onChangeActiveSummaryView("meetings")}
          >
            <MetricCard label="Meetings" value={summary.totalMeetings} />
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default HeroPanel;
