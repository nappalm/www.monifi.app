import { http, HttpResponse, delay } from "msw";
import { getMainApiUrl } from "../axios";
import { getExtractionResponse } from "./fixtures";

const browserHandlers = [
  http.all("*", async ({ request }) => {
    const url = request.url.toLowerCase();
    const imageExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".ico",
      ".webp",
    ];
    const isImage = imageExtensions.some((ext) => url.includes(ext));

    if (!isImage) {
      await delay(1000);
    }
    return undefined;
  }),
  http.post(getMainApiUrl("/extract/_"), () =>
    HttpResponse.json(getExtractionResponse),
  ),
];

export default browserHandlers;
