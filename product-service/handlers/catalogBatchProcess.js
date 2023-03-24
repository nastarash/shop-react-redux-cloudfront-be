"use strict";
import { Lambda, SNS } from "aws-sdk";
import ERROR_MESSAGE from "../../constants/constants.js";

async function createProduct(body) {
  const lambda = new Lambda();
  const payload = { body };
  const params = {
    FunctionName: process.env.CREATE_PRODUCT,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(payload),
  };
  const response = await lambda.invoke(params).promise();
  const { statusCode, body: responseBody } = JSON.parse(response.Payload);

  if (statusCode !== 201) {
    console.log("error", responseBody);
  }
  return responseBody;
}

export async function catalogBatchProcess(event) {
  const sns = new SNS();
  try {
    for (const record of event.Records) {
      const product = await createProduct(record.body);
      if (product) {
        await sns.publish(
          {
            Subject: "Product was created",
            Message: JSON.stringify(product),
            TopicArn: process.env.SNS_ARN,
          },
          (error) => {
            if (error) console.log(error);
            console.log('Msg sent', JSON.stringify(product))
          }
        ).promise();
        return {
          statusCode: 200,
          body: JSON.stringify(product),
        };
      }
    }

    return {
      statusCode: 202,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(ERROR_MESSAGE.INTERNAL_SERVER_ERROR),
    };
  }
}
