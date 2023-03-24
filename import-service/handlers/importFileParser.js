"use strict";
import { S3, SQS } from "aws-sdk";
import stream from "stream";
import csv from "csv-parser";
import STATUS_MESSAGE from "../../constants/constants.js";

export async function importFileParser(event) {
  const s3 = new S3();
  const sqs = new SQS();
  const BUCKET = process.env.UPLOAD_BUCKET;
  const SQS_URL = process.env.SQS_URL;


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

      csvReadStream.pipe(csv()).on("data", async (data) => {
        const msg = JSON.stringify(data);
        sqs.sendMessage({ QueueUrl: SQS_URL, MessageBody: msg }, (error) => {
          if(error) console.log(error);
          console.log(msg);
        })
      });

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
