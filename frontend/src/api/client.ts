import axios from "axios";
import type { ApiResponse } from "../types/index";

const configuredBaseUrl =
	import.meta.env.VITE_API_BASE_URL ||
	import.meta.env.VITE_API_URL ||
	"http://localhost:4000";

export const baseURL = configuredBaseUrl;

const api = axios.create({
	baseURL,
	timeout: 15000,
});

const extractErrorMessageFromPayload = (payload: unknown): string | null => {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const record = payload as {
		message?: unknown;
		error?: { message?: unknown };
	};

	if (typeof record.error?.message === "string" && record.error.message.trim().length > 0) {
		return record.error.message;
	}

	if (typeof record.message === "string" && record.message.trim().length > 0) {
		return record.message;
	}

	return null;
};

const toApiErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const payloadMessage = extractErrorMessageFromPayload(error.response?.data);
		if (payloadMessage) {
			return payloadMessage;
		}

		if (error.code === "ECONNABORTED") {
			return "Request timed out. Please try again.";
		}

		if (!error.response) {
			return "Cannot reach API server. Please check your connection and try again.";
		}

		return `Request failed with status ${error.response.status}`;
	}

	return error instanceof Error ? error.message : "Request failed";
};

api.interceptors.response.use(
	(response) => response,
	(error: unknown) => Promise.reject(new Error(toApiErrorMessage(error))),
);

export const unwrap = <T>(response: { data: ApiResponse<T> }): T => {
	if (!response.data.success) {
		throw new Error(response.data.error?.message || "Request failed");
	}

	return response.data.data;
};

export default api;
