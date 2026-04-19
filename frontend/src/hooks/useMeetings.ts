import { useCallback, useEffect, useState } from "react";
import type { Meeting } from "../types/meeting.types";
import { getMeetings } from "../services/meeting.service";

interface UseMeetingsResult {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useMeetings = (studentId: string | null, search?: string): UseMeetingsResult => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId) {
      setMeetings([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMeetings(studentId, search);
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
    } finally {
      setLoading(false);
    }
  }, [search, studentId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    meetings,
    loading,
    error,
    refresh: fetchData,
  };
};
