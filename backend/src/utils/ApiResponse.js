/**
 * Standardized API response wrapper.
 * Every successful response from the API follows this format.
 */
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static ok(message = 'Success', data = null) {
    return new ApiResponse(200, message, data);
  }

  static created(message = 'Created', data = null) {
    return new ApiResponse(201, message, data);
  }

  /**
   * Send the response through Express res object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;
