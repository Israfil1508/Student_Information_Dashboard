export interface Mentor {
	id: string;
	name: string;
	title: string;
	company: string;
	expertise: string[];
	email: string;
	bio: string;
	maxMentees: number;
	activeMentees?: number;
}
