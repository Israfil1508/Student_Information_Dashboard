import api, { baseURL, unwrap } from "./client";
import type { ApiResponse, Scholarship, ScholarshipStatus } from "../types/index";

export interface ScholarshipCreateInput {
  name: string;
  provider: string;
  amount: number;
  currency: string;
  status: ScholarshipStatus;
  deadline: string;
  requirements: string[];
  essayRequired: boolean;
  essaySubmitted?: boolean;
  notes: string;
  dateApplied?: string;
}

export interface ScholarshipUpdateInput {
  status?: ScholarshipStatus;
  notes?: string;
  deadline?: string;
}

export type ScholarshipRealtimeEventType =
  | "ready"
  | "heartbeat"
  | "scholarship.created"
  | "scholarship.updated"
  | "scholarship.deleted";

export interface ScholarshipRealtimeEvent {
  type: ScholarshipRealtimeEventType;
  occurredAt: string;
  scholarshipId?: string;
  studentId?: string;
  status?: ScholarshipStatus;
  previousStatus?: ScholarshipStatus;
  deadline?: string;
}

const scholarshipRealtimeEventTypes = new Set<ScholarshipRealtimeEventType>([
  "ready",
  "heartbeat",
  "scholarship.created",
  "scholarship.updated",
  "scholarship.deleted",
]);

const parseScholarshipRealtimeEvent = (rawData: string): ScholarshipRealtimeEvent | null => {
  try {
    const parsed = JSON.parse(rawData) as Partial<ScholarshipRealtimeEvent>;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.type !== "string") return null;
    if (!scholarshipRealtimeEventTypes.has(parsed.type as ScholarshipRealtimeEventType)) return null;
    if (typeof parsed.occurredAt !== "string") return null;

    return parsed as ScholarshipRealtimeEvent;
  } catch {
    return null;
  }
};

export const createScholarship = async (
  studentId: string,
  payload: ScholarshipCreateInput,
): Promise<Scholarship> => {
  const response = await api.post<ApiResponse<Scholarship>>(
    `/api/students/${studentId}/scholarships`,
    payload,
  );

  return unwrap(response);
};

export const updateScholarship = async (
  scholarshipId: string,
  payload: ScholarshipUpdateInput,
): Promise<Scholarship> => {
  const response = await api.put<ApiResponse<Scholarship>>(
    `/api/scholarships/${scholarshipId}`,
    payload,
  );

  return unwrap(response);
};

export const subscribeToScholarshipEvents = (
  onEvent: (event: ScholarshipRealtimeEvent) => void,
  onError?: (event: Event) => void,
): (() => void) => {
  const streamUrl = `${baseURL.replace(/\/$/, "")}/api/events/scholarships`;
  const source = new EventSource(streamUrl);

  const handleIncomingEvent = (rawEvent: Event) => {
    const event = rawEvent as MessageEvent<string>;
    const parsed = parseScholarshipRealtimeEvent(event.data);
    if (!parsed) return;
    onEvent(parsed);
  };

  const eventNames: ScholarshipRealtimeEventType[] = [
    "ready",
    "heartbeat",
    "scholarship.created",
    "scholarship.updated",
    "scholarship.deleted",
  ];

  eventNames.forEach((eventName) => {
    source.addEventListener(eventName, handleIncomingEvent as EventListener);
  });

  source.onerror = (event) => {
    if (onError) {
      onError(event);
    }
  };

  return () => {
    eventNames.forEach((eventName) => {
      source.removeEventListener(eventName, handleIncomingEvent as EventListener);
    });
    source.close();
  };
};
