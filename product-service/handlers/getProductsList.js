"use strict";
import { DynamoDB } from "aws-sdk";
import ERROR_MESSAGE from "../../constants/constants.js";
import headers from "../../constants/headers.js";
import { mergeById } from "../utils/utils.js";

export async function getProductsList(event) {
  console.log(event);

  const dynamoDb = new DynamoDB.DocumentClient();


  try {
    const { Items: products } = await dynamoDb
      .scan({
        TableName: process.env.PRODUCTS_TABLE,
      })
      .promise();
    const { Items: stocks } = await dynamoDb
      .scan({
        TableName: process.env.STOCKS_TABLE,
      })
      .promise();
    const response = mergeById(products, stocks);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(ERROR_MESSAGE.INTERNAL_SERVER_ERROR),
    };
  }
}
