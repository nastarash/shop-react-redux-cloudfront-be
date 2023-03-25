"use strict";
import { generatePolicy } from "../utils/utils.js";

export async function basicAuthorizer(event, ctx, cb) {
  if (event["type"] !== "REQUEST") {
    cb("Unauthorized");
  }
  try {
    const { headers: { Authorization }} = event;
    const encodedCreds = Authorization.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    const storesUserPassword = process.env[username];

    const effect =
      !storesUserPassword || storesUserPassword != password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    cb(null, policy);
  } catch (error) {
    console.log(error);
    cb(`Unathorized: ${error.message}`);
  }
}
