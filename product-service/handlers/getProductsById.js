"use strict";
import products from "../constants/products.js";
import ERROR_MESSAGE from "../constants/constants.js";
import headers from "../constants/headers.js";

export async function getProductsById(event) {
  const {
    pathParameters: { id },
  } = event;
  const response = products.find((product) => product.id === id);
  if (!response) {
    return {
      statusCode: 404,
      body: JSON.stringify(ERROR_MESSAGE.PRODUCT_NOT_FOUND),
    };
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response),
  };
}
