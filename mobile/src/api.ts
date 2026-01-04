import { Investment, NewInvestmentData } from "./types";
import { API_ENDPOINTS } from "./config";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Fetch all investments from the API
 */
export async function fetchInvestments(): Promise<Investment[]> {
  try {
    const response = await fetch(API_ENDPOINTS.INVESTMENTS);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch investments: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create a new investment
 */
export async function createInvestment(
  data: NewInvestmentData
): Promise<Investment> {
  try {
    const response = await fetch(API_ENDPOINTS.INVESTMENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      throw new ApiError(
        response.status,
        errorData.details
          ? errorData.details.join(", ")
          : errorData.error || "Failed to create investment"
      );
    }

    const created = await response.json();
    return created;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
