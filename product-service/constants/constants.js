const ERROR_CODES = {
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  INVALID_DATA: 400,
};

const ERROR_MESSAGE = {
  PRODUCT_NOT_FOUND: {
    statusCode: ERROR_CODES.NOT_FOUND,
    errorMessage: "Product not found",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: ERROR_CODES.SERVER_ERROR,
    errorMessage: "Internal Server Error",
  },
  INVALID_PRODUCT_DATA: {
    statusCode: ERROR_CODES.INVALID_DATA,
    errorMessage: "Product data is invalid",
  },
};

export default ERROR_MESSAGE;
