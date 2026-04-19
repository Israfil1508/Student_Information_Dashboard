import type { StatusHistory } from "./student.types";

export type ScholarshipStatus =
	| "Researching"
	| "Applied"
	| "Interview"
	| "Awarded"
	| "Rejected";

export interface Scholarship {
	id: string;
	studentId: string;
	name: string;
	provider: string;
	amount: number;
	currency: string;
	status: ScholarshipStatus;
	statusHistory: StatusHistory<ScholarshipStatus>[];
	deadline: string;
	requirements: string[];
	essayRequired: boolean;
	essaySubmitted?: boolean;
	notes: string;
	dateApplied?: string;
	createdAt: string;
	updatedAt: string;
}
