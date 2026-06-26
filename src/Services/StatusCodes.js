const StatusCodes = [
  {
    status: 200,
    description: "OK",
    statusText: "Request completed successfully",
  },
  {
    status: 201,
    description: "Created",
    statusText: "Record created successfully",
  },
  {
    status: 202,
    description: "Accepted",
    statusText: "Data accepted successfully",
  },
  {
    status: 203,
    description: "Non-Authoritative Information",
    statusText: "Non-Authoritative Information",
  },
  {
    status: 204,
    description: "No Content",
    statusText: "Record updated successfully",
  },
  {
    status: 205,
    description: "Reset Content",
    statusText: "Records saved successfully",
  },
  {
    status: 206,
    description: "Partial Content",
    statusText: "Data saved successfully",
  },
  {
    status: 300,
    description: "Multiple Choices",
    statusText: "Multiple Choices",
  },
  {
    status: 301,
    description: "Moved Permanently",
    statusText: "Moved Permanently",
  },
  {
    status: 302,
    description: "Found",
    statusText: "Found",
  },
  {
    status: 303,
    description: "See Other",
    statusText: "See Other",
  },
  {
    status: 304,
    description: "Not Modified",
    statusText: "Not Modified",
  },
  {
    status: 307,
    description: "Temporary Redirect",
    statusText: "Temporary Redirect",
  },
  {
    status: 308,
    description: "Permanent Redirect",
    statusText: "Permanent Redirect",
  },
  {
    status: 400,
    description: "Bad Request",
    statusText: "Failed to reach the server endpoint",
  },
  {
    status: 401,
    description: "Unauthorized",
    statusText: "Failed to authorize this request",
  },
  {
    status: 402,
    description: "Payment Required",
    statusText: "Payment failure",
  },
  {
    status: 403,
    description: "Forbidden",
    statusText: "Forbidden access to this endpoint",
  },
  {
    status: 404,
    description: "Not Found",
    statusText: "Failed to find the server endpoint",
  },
  {
    status: 405,
    description: "Method Not Allowed",
    statusText: "Failed to access the requested method",
  },
  {
    status: 406,
    description: "Not Acceptable",
    statusText: "Failed to get server acceptance",
  },
  {
    status: 407,
    description: "Proxy Authentication Required",
    statusText: "Failed to authenticate proxy information",
  },
  {
    status: 408,
    description: "Request Timeout",
    statusText: "Failed to complete the request in time",
  },
  {
    status: 409,
    description: "Conflict",
    statusText: "Failed to resolve a conflict",
  },
  {
    status: 410,
    description: "Gone",
    statusText: "Failure",
  },
  {
    status: 411,
    description: "Length Required",
    statusText: "Failed to get the correct request length",
  },
  {
    status: 412,
    description: "Precondition Failed",
    statusText: "Failure: Precondition failed",
  },
  {
    status: 413,
    description: "Payload Too Large",
    statusText: "Failure: Payload too large",
  },
  {
    status: 414,
    description: "URI Too Long",
    statusText: "Failure: URI too long",
  },
  {
    status: 415,
    description: "Unsupported Media Type",
    statusText: "Failure: Unsupported media type",
  },
  {
    status: 416,
    description: "Range Not Satisfiable",
    statusText: "Failure: Range not satisfiable",
  },
  {
    status: 417,
    description: "Expectation Failed",
    statusText: "Failure: Expectation failed",
  },
  {
    status: 418,
    description: "I'm a teapot",
    statusText: "Failure: Teapot",
  },
  {
    status: 422,
    description: "Unprocessable Entity",
    statusText: "Failure: Unprocessable entity",
  },
  {
    status: 425,
    description: "Too Early",
    statusText: "Failure: Too early",
  },
  {
    status: 426,
    description: "Upgrade Required",
    statusText: "Failure: Upgrade required",
  },
  {
    status: 428,
    description: "Precondition Required",
    statusText: "Failure: Precondition required",
  },
  {
    status: 429,
    description: "Too Many Requests",
    statusText: "Failure: Too many requests",
  },
  {
    status: 431,
    description: "Request Header Fields Too Large",
    statusText: "Failure: Request header field is too large",
  },
  {
    status: 451,
    description: "Unavailable For Legal Reasons",
    statusText: "Failure: Unavailable for legal reasons",
  },
  {
    status: 500,
    description: "Internal Server Error",
    statusText: "Failure: Internal Server Error",
  },
  {
    status: 501,
    description: "Not Implemented",
    statusText: "Failure: Not Implemented",
  },
  {
    status: 502,
    description: "Bad Gateway",
    statusText: "Failure: Bad Gateway",
  },
  {
    status: 503,
    description: "Service Unavailable",
    statusText: "Failure: Service Unavailable",
  },
  {
    status: 504,
    description: "Gateway Timeout",
    statusText: "Failure: Gateway Timeout",
  },
  {
    status: 505,
    description: "HTTP Version Not Supported",
    statusText: "Failure: HTTP Version Not Supported",
  },
  {
    status: 506,
    description: "Variant Also Negotiates",
    statusText: "Failure: Variant Also Negotiates",
  },
  {
    status: 507,
    description: "Insufficient Storage",
    statusText: "Failure: Insufficient Storage",
  },
  {
    status: 508,
    description: "Loop Detected",
    statusText: "Failure: Loop Detected",
  },
  {
    status: 510,
    description: "Not Extended",
    statusText: "Failure: Not Extended",
  },
  {
    status: 511,
    description: "Network Authentication Required",
    statusText: "Failure: Network Authentication Required",
  },
];
export default StatusCodes;