import AWS from "aws-sdk-mock";
import { catalogBatchProcess } from "../handlers/catalogBatchProcess";
import ERROR_MESSAGE from "../../constants/constants.js";

describe("catalogBatchProcess", () => {
  beforeEach(() => (process.env.CREATE_PRODUCT = "test func"));

  afterEach(() => {
    AWS.restore();
  });

  it("should publish message to SNS for each event record", async () => {
    const snsPublishMock = jest.fn().mockReturnValue({});
    AWS.mock("SNS", "publish", snsPublishMock);

    const createProductResponse = {
      statusCode: 201,
      body: {
        id: "123",
        title: "Test product",
        price: 9.99,
        count: 10,
      },
    };
    const createProductMock = jest
      .fn()
      .mockResolvedValue({ Payload: JSON.stringify(createProductResponse) });
    AWS.mock("Lambda", "invoke", createProductMock);

    const event = {
      Records: [
        {
          body: {
            title: "Test product",
            description: "Test description",
            price: 9.99,
            count: 10,
          },
        },
      ],
    };
    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(200);
    expect(snsPublishMock).toHaveBeenCalledTimes(1);
  });

  it("should return 202 if no event records", async () => {
    const event = {
      Records: [],
    };
    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(202);
  });

  it("should return 500 if SNS publish throws error", async () => {
    const snsPublishMock = jest.fn().mockRejectedValue(new Error("Test error"));
    AWS.mock("SNS", "publish", snsPublishMock);

    const createProductResponse = {
      statusCode: 201,
      body: {
        id: "123",
        title: "Test product",
        price: 9.99,
        count: 10,
      },
    };
    const createProductMock = jest
      .fn()
      .mockResolvedValue(createProductResponse);
    AWS.mock("Lambda", "invoke", createProductMock);

    const event = {
      Records: [
        {
          body: '{"title":"Test product","description":"Test description","price":9.99,"count":10}',
        },
      ],
    };
    const result = await catalogBatchProcess(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify(ERROR_MESSAGE.INTERNAL_SERVER_ERROR)
    );
  });
});
