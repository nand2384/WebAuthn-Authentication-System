// Custom Error class to carry HTTP status codes
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // CRITICAL: This ensures HttpOnly cookies are sent with requests to backend
    credentials: 'init' in options ? (options.credentials || 'include') : 'include', 
  };

  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, config);

    // If response body is empty or not JSON, handle gracefully
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      // 401 Unauthorized usually implies session expired/invalid
      if (response.status === 401) {
        // We could trigger a global event here if we wanted to
        // document.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      
      throw new ApiError(
        data.message || 'An error occurred during the request.',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiError to let the caller handle it
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert network errors or JSON parse errors into a generic ApiError
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      500
    );
  }
};
