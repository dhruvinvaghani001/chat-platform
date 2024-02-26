class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong!") {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ApiError };
