class ApiError extends Error {
  constructor(status, message = "Something went wrong", errors= []) {
    super();
    this.status = status;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
  static badRequest(message) {
    return new ApiError(400, message);
  }
  static internal(message) {
    return new ApiError(500, message);
  }
  static notFound(message) {
    return new ApiError(404, message);
  }
}

export { ApiError };
