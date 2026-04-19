import type { jsPDF } from "jspdf";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDateOnly = (value: string): boolean => {
  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(`${value}T`);
};

export const formatDate = (value?: string): string => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

export const formatDateOnly = (value?: string): string => {
  if (!value) return "-";

  if (isValidDateOnly(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(undefined, {
      timeZone: "UTC",
    });
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString();
};

export const formatCurrency = (amount: number, currency: string): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const toDateInputValue = (value?: string): string => {
  if (!value) return "";

  if (isValidDateOnly(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export const toErrorMessage = (error: unknown, fallback = "Request failed"): string => {
  return error instanceof Error ? error.message : fallback;
};

const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  const text = String(value).replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
};

export const buildCsvDocument = (rows: Array<Array<unknown>>): string =>
  rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");

export const sanitizeFileNamePart = (value: string): string => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "report";
};

export const downloadTextFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getPdfTableFinalY = (doc: jsPDF): number => {
  const withTableState = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  return withTableState.lastAutoTable?.finalY ?? 80;
};
