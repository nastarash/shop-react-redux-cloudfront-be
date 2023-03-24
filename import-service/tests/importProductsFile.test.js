import { importProductsFile } from "../handlers/importProductsFile";
import STATUS_MESSAGE from "../../constants/constants";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

describe("importProductsFile", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("S3");
  });

  it("should return a signed S3 URL for a valid name query parameter", async () => {
    AWSMock.mock('S3', 'getSignedUrl', Promise.resolve('https://s3-signed-url'));
    const event = {
      queryStringParameters: {
        name: "test.csv",
      },
    };

    const result = await importProductsFile(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toContain("https://s3-signed-url");
  });

  it("should return a 400 status code for a missing name query parameter", async () => {
    const event = {};

    const result = await importProductsFile(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain(JSON.stringify(STATUS_MESSAGE.MISSING_NAME));
  });

  it("should return a 500 status code if S3 getSignedUrlPromise fails", async () => {
    AWSMock.mock('S3', 'getSignedUrl', Promise.reject('err'));
    const event = {
      queryStringParameters: {
        name: "test.csv",
      },
    };

    const result = await importProductsFile(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain(
      JSON.stringify(STATUS_MESSAGE.INTERNAL_SERVER_ERROR)
    );
  });
});
