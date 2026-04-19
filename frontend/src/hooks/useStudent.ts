import { useCallback, useEffect, useState } from "react";
import type { StudentProfilePayload } from "../types/student.types";
import { getStudentProfile } from "../services/student.service";

interface UseStudentResult {
  profile: StudentProfilePayload | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useStudent = (studentId: string | null): UseStudentResult => {
  const [profile, setProfile] = useState<StudentProfilePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getStudentProfile(studentId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    profile,
    loading,
    error,
    refresh: fetchData,
  };
};
