import { useCallback, useEffect, useState } from "react";
import type { StudentFilters } from "../api/student.api";
import type { StudentDirectoryRecord } from "../types/student.types";
import { getStudents } from "../services/student.service";

interface UseStudentsResult {
  students: StudentDirectoryRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: StudentFilters;
  setFilters: (nextFilters: Partial<StudentFilters>) => void;
  refresh: () => Promise<void>;
}

const defaultFilters: StudentFilters = {
  search: "",
  academicYear: "All",
  enrollmentStatus: "All",
  major: "",
};

export const useStudents = (initialFilters?: Partial<StudentFilters>): UseStudentsResult => {
  const [students, setStudents] = useState<StudentDirectoryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<StudentFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStudents(filters);
      setStudents(data.students);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const setFilters = useCallback((nextFilters: Partial<StudentFilters>) => {
    setFiltersState((previousFilters) => ({
      ...previousFilters,
      ...nextFilters,
    }));
  }, []);

  return {
    students,
    total,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
};
