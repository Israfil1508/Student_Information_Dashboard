export type MeetingStatus = "Scheduled" | "Completed" | "Cancelled";

export interface Meeting {
	id: string;
	studentId: string;
	mentorId: string;
	date: string;
	duration: number;
	notes: string;
	actionItems: string[];
	status: MeetingStatus;
	createdAt: string;
	updatedAt: string;
	mentorName?: string;
}
