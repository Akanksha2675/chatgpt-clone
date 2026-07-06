import * as cheerio from "cheerio";
import { Document } from "@langchain/core/documents";

export async function loadWebPage(
  url: string,
  selector: string = ".post-title, .post-header, .post-content",
): Promise<Document[]> {

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, nav, footer").remove();

  let text = $(selector).text().trim();

  // Most arbitrary URLs won't match the blog-style selector above,
  // so fall back to the full page body.
  if (!text) {
    text = $("body").text().replace(/\s+/g, " ").trim();
  }

  return [
    new Document({
      pageContent: text,
      metadata: { source: url },
    }),
  ];
}