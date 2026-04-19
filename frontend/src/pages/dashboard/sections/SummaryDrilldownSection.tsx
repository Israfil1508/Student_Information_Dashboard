import type { SummaryListItem, SummaryView } from "../types";

type SummaryDrilldownSectionProps = {
  summaryViewTitle: string;
  activeSummaryView: SummaryView;
  summaryStudentSearch: string;
  onSummaryStudentSearchChange: (value: string) => void;
  onExportScholarshipSummaryCsv: () => void;
  onExportScholarshipSummaryPdf: () => void;
  mentorLoading: boolean;
  mentorError: string | null;
  summaryViewItems: SummaryListItem[];
  selectedSummaryItemId: string | null;
  onSelectSummaryItemId: (id: string) => void;
  selectedSummaryItem: SummaryListItem | null;
  onOpenStudentDashboard: (studentId: string) => void;
};

function SummaryDrilldownSection({
  summaryViewTitle,
  activeSummaryView,
  summaryStudentSearch,
  onSummaryStudentSearchChange,
  onExportScholarshipSummaryCsv,
  onExportScholarshipSummaryPdf,
  mentorLoading,
  mentorError,
  summaryViewItems,
  selectedSummaryItemId,
  onSelectSummaryItemId,
  selectedSummaryItem,
  onOpenStudentDashboard,
}: SummaryDrilldownSectionProps) {
  return (
    <section className="panel summary-drilldown" aria-label={`${summaryViewTitle}`}>
      <div className="panel-header">
        <h2>{summaryViewTitle}</h2>
        <p>Click any top card to switch the list.</p>
        {activeSummaryView === "students" ? (
          <label className="summary-search">
            Find student in this list
            <input
              type="search"
              value={summaryStudentSearch}
              onChange={(event) => onSummaryStudentSearchChange(event.target.value)}
              placeholder="Search name, email, major"
            />
          </label>
        ) : null}
        <div className="row-inline export-actions" role="group" aria-label="Scholarship summary exports">
          <span className="export-label">Export scholarship summary</span>
          <button
            type="button"
            className="ghost-button"
            onClick={onExportScholarshipSummaryCsv}
            aria-label="Export scholarship summary as CSV"
          >
            CSV
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={onExportScholarshipSummaryPdf}
            aria-label="Export scholarship summary as PDF"
          >
            PDF
          </button>
        </div>
      </div>

      <div className="summary-list-wrap">
        {activeSummaryView === "mentors" && mentorLoading ? (
          <p role="status" className="loading-inline">
            Loading mentors...
          </p>
        ) : activeSummaryView === "mentors" && mentorError ? (
          <p role="alert" className="error-inline">
            {mentorError}
          </p>
        ) : summaryViewItems.length === 0 ? (
          <p className="muted">No items available.</p>
        ) : (
          <>
            <ul className={`summary-list ${activeSummaryView}-view`} aria-label={summaryViewTitle}>
              {summaryViewItems.map((item) => {
                const isSelected =
                  activeSummaryView !== "students" && selectedSummaryItemId === item.id;

                return (
                  <li
                    key={item.id}
                    className={`summary-list-item summary-entry summary-entry-${activeSummaryView} ${isSelected ? "is-selected" : ""}`}
                  >
                    {activeSummaryView === "students" ? (
                      <button
                        type="button"
                        className="summary-list-button"
                        onClick={() => {
                          onOpenStudentDashboard(item.id);
                        }}
                        aria-label={`Open profile for ${item.title}`}
                      >
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.subtitle}</p>
                        </div>
                        <span className="summary-meta">{item.meta}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="summary-list-button"
                        onClick={() => onSelectSummaryItemId(item.id)}
                        aria-label={`Show details for ${item.title}`}
                      >
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.subtitle}</p>
                        </div>
                        <span className="summary-meta">{item.meta}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {activeSummaryView !== "students" && selectedSummaryItem ? (
              <article className="summary-detail-card" aria-label={`${selectedSummaryItem.title} details`}>
                <h3>{selectedSummaryItem.title}</h3>
                <p>{selectedSummaryItem.subtitle}</p>
                <dl className="summary-detail-grid">
                  {selectedSummaryItem.details.map((detail) => (
                    <div key={`${selectedSummaryItem.id}-${detail.label}`}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default SummaryDrilldownSection;
