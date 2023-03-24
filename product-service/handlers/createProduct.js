"use strict";
import { DynamoDB } from "aws-sdk";
import { v4 } from "uuid";
import ERROR_MESSAGE from "../../constants/constants.js";
import headers from "../../constants/headers.js";
import { validateBody, convertToProductObject } from "../utils/utils.js";

export async function createProduct(event) {
  const dynamoDb = new DynamoDB.DocumentClient();

  const { title, description, price, count } = convertToProductObject(
    JSON.parse(event.body || "{}")
  );
  const productId = v4();
  const productItem = {
    id: productId,
    title,
    description,
    price: +price,
  };
  const stockItem = {
    product_id: productId,
    count: +count,
  };
  const productPayload = { ...productItem, ...stockItem };

  if (!validateBody(productPayload)) {
    console.log(ERROR_MESSAGE.INVALID_PRODUCT_DATA, productPayload);
    return {
      statusCode: 400,
      body: JSON.stringify(ERROR_MESSAGE.INVALID_PRODUCT_DATA),
    };
  }

  try {
    const put = async () => {
      await dynamoDb
        .transactWrite({
          TransactItems: [
            {
              Put: {
                Item: productItem,
                TableName: process.env.PRODUCTS_TABLE,
              },
            },
            {
              Put: {
                Item: stockItem,
                TableName: process.env.STOCKS_TABLE,
              },
            },
          ],
        })
        .promise();
    };
    await put();
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ id: productId, title, description, price, count }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
}
