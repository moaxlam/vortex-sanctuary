import serverless from "serverless-http";
import { createServer } from "../server";

export const config = { runtime: "nodejs18.x" };

const handler = serverless(createServer());
export default handler as any;
