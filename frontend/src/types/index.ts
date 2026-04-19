import type { Meeting } from "./meeting.types";
import type { Scholarship } from "./scholarship.types";

export * from "./student.types";
export * from "./scholarship.types";
export * from "./mentor.types";
export * from "./meeting.types";

export interface DashboardSummary {
	totalStudents: number;
	totalMentors: number;
	totalScholarships: number;
	totalMeetings: number;
	scholarshipByStatus: Record<string, number>;
	upcomingDeadlines: Scholarship[];
	scheduledMeetings: Meeting[];
}

export interface ApiError {
	message: string;
	details?: unknown;
}

export interface ApiResponse<T> {
	success: boolean;
	message?: string;
	data: T;
	error?: ApiError;
}
