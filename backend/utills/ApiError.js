class ApiError {
  constructor(statusCode, message = "Something went wrong!") {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { ApiError };