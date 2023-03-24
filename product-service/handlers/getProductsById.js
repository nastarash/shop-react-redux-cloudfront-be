"use strict";
import { DynamoDB } from "aws-sdk";
import ERROR_MESSAGE from "../../constants/constants.js";
import headers from "../../constants/headers.js";
import { mergeById } from "../utils/utils.js";

export async function getProductsById(event) {
  console.log(event);
  
  const dynamoDb = new DynamoDB.DocumentClient();

  const {
    pathParameters: { id },
  } = event;
  const productsParams = {
    ExpressionAttributeValues: {
      ":id": id,
    },
    KeyConditionExpression: "id = :id",
    TableName: process.env.PRODUCTS_TABLE,
  };
  const stocksParams = {
    ExpressionAttributeValues: {
      ":product_id": id,
    },
    KeyConditionExpression: "product_id = :product_id",
    TableName: process.env.STOCKS_TABLE,
  };
  try {
    const { Items: products } = await dynamoDb.query(productsParams).promise();
    const { Items: stocks } = await dynamoDb.query(stocksParams).promise();
    const response = mergeById(products, stocks);

    if (!response.length) {
      return {
        statusCode: 404,
        body: JSON.stringify(ERROR_MESSAGE.PRODUCT_NOT_FOUND),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(ERROR_MESSAGE.INTERNAL_SERVER_ERROR),
    };
  }
}
