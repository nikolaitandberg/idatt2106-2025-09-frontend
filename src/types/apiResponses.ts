/**
 * Error response returned from the API
 */
export class ApiError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
