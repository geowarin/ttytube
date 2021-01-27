import got from "got";
import {load} from "cheerio";

const headers = {
  "User-Agent": "Mozilla/5.0 (Android 10; Tablet; rv:82.0) Gecko/82.0 Firefox/82.0,gzip(gfe)"
};

export interface SearchResult {
  videoId: string
  title: string
  /**
   * format: 16,375,072 views
   */
  viewCount: string
  /**
   * format: 16M views, 69K views
   */
  shortViewCount: string
  /**
   * format: 5:06
   */
  length: string
  longByline: string
  //author: string
  shortByline: string
  /**
   * format: "9 months ago" "3 years ago" "5 days ago"
   */
  publishedTime: string
}

export enum QueryType {
  "video" = "EgIQAQ%3D%3D",
  "playlist" = "EgIQAw%3D%3D",
  "channel" = "EgIQAg%3D%3D",
}

export async function search(search: string, type: QueryType = QueryType.video): Promise<SearchResult[]> {
  try {
    const url = new URL("https://m.youtube.com/results");
    url.searchParams.set("search_query", search)
    url.searchParams.set("hl", "en")
    url.searchParams.set("sp", type)

    const response = await got(url, {headers});
    const results = parseHtml(response.body);

    return results.map((r: any) => {
      return {
        videoId: r.compactVideoRenderer.videoId,
        title: getProperty(r, "title", "?"),
        viewCount: getProperty(r, "viewCountText", "0 views"),
        shortViewCount: getProperty(r, "shortViewCountText", "0 views"),
        length: getProperty(r, "lengthText", "live"),
        longByline: getProperty(r, "longBylineText", "?"),
        shortByline: getProperty(r, "shortBylineText", "?"),
        publishedTime: getProperty(r, "publishedTimeText", "?"),
      }
    });
  } catch (error) {
    throw new Error(`Error during search: ${error.message}`);
  }
}

function getProperty(r: any, property: string, defaultValue: string) {
  return r.compactVideoRenderer[property]?.runs?.[0]?.text ?? defaultValue;
}

/**
 * From the html string of a youtube result page,
 * returns the ytInitialData json object that contains
 * the search results
 */
function parseHtml(html: string) {
  const $ = load(html);
  const scripts = $('script:not([src])');

  const node = scripts.toArray().map(s => {
    // @ts-ignore
    const data: string = s.children[0].data;
    const re = /var\s+ytInitialData\s*=\s*(.*)/;
    const matchResult = data.match(re)
    if (matchResult) {
      return matchResult[1];
    }

    return null;
  }).find(s => s != null);

  if (node == null) {
    throw new Error("Could not parse youtube results (ytInitialData not found)");
  }

  const ytData = JSON.parse(eval(node));
  // Livin' on the edge
  const results = ytData?.contents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
  if (results == null) {
    throw new Error("Could not parse youtube results (unknown structure)");
  }
  return results;
}
