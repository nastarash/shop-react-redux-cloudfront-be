"use strict";
import { S3 } from "aws-sdk";
import stream from "stream";
import csv from "csv-parser";
import STATUS_MESSAGE from "../../constants/constants.js";

const s3 = new S3();
const BUCKET = process.env.UPLOAD_BUCKET;

export async function importFileParser(event) {
  try {
    for (const record of event.Records) {
      const s3object = await s3
        .getObject({
          Bucket: BUCKET,
          Key: record.s3.object.key,
        })
        .promise();

      let csvReadStream = new stream.Readable();
      csvReadStream._read = () => {};
      csvReadStream.push(s3object.Body);

      csvReadStream.pipe(csv()).on("data", (data) => console.log(data));

      await s3
      .copyObject({
        Bucket: BUCKET,
        CopySource: BUCKET + "/" + record.s3.object.key,
        Key: record.s3.object.key.replace("uploaded", "parsed"),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      })
      .promise();
    }
    return {
      statusCode: 202,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(STATUS_MESSAGE.INTERNAL_SERVER_ERROR),
    };
  }
}
