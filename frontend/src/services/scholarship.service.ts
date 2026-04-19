import { createScholarship, subscribeToScholarshipEvents, updateScholarship } from "../api/scholarship.api";
import type {
  ScholarshipCreateInput,
  ScholarshipRealtimeEvent,
  ScholarshipUpdateInput,
} from "../api/scholarship.api";

export const addScholarship = (studentId: string, payload: ScholarshipCreateInput) =>
  createScholarship(studentId, payload);

export const editScholarship = (scholarshipId: string, payload: ScholarshipUpdateInput) =>
  updateScholarship(scholarshipId, payload);

export const listenScholarshipEvents = (
  onEvent: (event: ScholarshipRealtimeEvent) => void,
  onError?: (event: Event) => void,
) => subscribeToScholarshipEvents(onEvent, onError);
