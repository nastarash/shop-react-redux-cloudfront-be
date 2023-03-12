const HTTP_CODES = {
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  INVALID_DATA: 400,
  OK: 200,
};

const STATUS_MESSAGE = {
  PRODUCT_NOT_FOUND: {
    statusCode: HTTP_CODES.NOT_FOUND,
    errorMessage: "Product not found",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: HTTP_CODES.SERVER_ERROR,
    errorMessage: "Internal Server Error",
  },
  INVALID_PRODUCT_DATA: {
    statusCode: HTTP_CODES.INVALID_DATA,
    errorMessage: "Product data is invalid",
  },
  MISSING_NAME: {
    statusCode: HTTP_CODES.INVALID_DATA,
    errorMessage: "Name param is required",
  },
  PARSED_SUCCESSFULY: {
    statusCode: 200,
    message: "Object parsed successfuly",
  },
};

export default STATUS_MESSAGE;
