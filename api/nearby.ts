import type { VercelRequest, VercelResponse } from "@vercel/node";
import process from "node:process";
import { handleNearbyRequest } from "../server/nearby";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  const host = request.headers.host ?? "localhost";
  const url = new URL(request.url ?? "/", `https://${host}`);
  const apiResponse = await handleNearbyRequest(
    new Request(url, { method: request.method ?? "GET" }),
    process.env.GEOAPIFY_API_KEY ?? "",
  );
  response.statusCode = apiResponse.status;
  apiResponse.headers.forEach((value, key) => response.setHeader(key, value));
  response.send(await apiResponse.text());
}
