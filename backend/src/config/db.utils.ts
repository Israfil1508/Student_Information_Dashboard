export const toSafeMongoUri = (uri: string): string => {
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = "****";
    }
    return parsed.toString();
  } catch {
    return uri.replace(/(\/\/[^:]+:)([^@]+)(@)/, "$1****$3");
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const isSrvLookupError = (uri: string, error: unknown): boolean => {
  if (!uri.startsWith("mongodb+srv://")) {
    return false;
  }

  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("querysrv") ||
    message.includes("_mongodb._tcp") ||
    message.includes("enotfound") ||
    message.includes("econnrefused")
  );
};