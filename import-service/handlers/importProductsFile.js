"use strict";
import { S3 } from "aws-sdk";
import STATUS_MESSAGE from "../../constants/constants.js";
import headers from "../../constants/headers.js";


export async function importProductsFile(event) {
  const s3 = new S3();
  const { name } = event.queryStringParameters || {};

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify(STATUS_MESSAGE.MISSING_NAME),
    };
  }
  const params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key: `uploaded/${name}`,
    Expires: 600,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: decodeURIComponent(signedUrl) }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(STATUS_MESSAGE.INTERNAL_SERVER_ERROR),
    };
  }
}
