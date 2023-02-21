import { getProductsById } from "../getProductsById";
import headers from "../constants/headers";
import ERROR_MESSAGE from "../constants/constants";
import products from "../constants/products";

describe("getProductsById", () => {
  test("returns a product when a valid id is provided", async () => {
    const event = {
      pathParameters: { id: "001" },
    };
    const expectedResponse = {
      statusCode: 200,
      headers,
      body: JSON.stringify(products[0]),
    };
    const response = await getProductsById(event);
    expect(response).toEqual(expectedResponse);
  });

  test("returns a 404 error when an invalid id is provided", async () => {
    const event = {
      pathParameters: { id: "invalid-id" },
    };
    const expectedResponse = {
      statusCode: 404,
      body: JSON.stringify(ERROR_MESSAGE.PRODUCT_NOT_FOUND),
    };
    const response = await getProductsById(event);
    expect(response).toEqual(expectedResponse);
  });
});
