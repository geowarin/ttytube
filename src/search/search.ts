import got from "got";
import {load} from "cheerio";

const headers = {
  "User-Agent": "Mozilla/5.0 (Android 10; Tablet; rv:82.0) Gecko/82.0 Firefox/82.0,gzip(gfe)"
};

export interface Video {
  videoId: string
  title: string
  /**
   * format: "16,375,072 views"
   */
  viewCount: string
  /**
   * format: "16M views", "69K views"
   */
  shortViewCount: string
  /**
   * format: "5:06"
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

export interface Playlist {
  playlistId: string
  title: string
  longByline: string
  shortByline: string
  publishedTime: string
  videoCount: string
}

export interface Channel {
  channelId: string
  title: string
  displayName: string
  videoCount: string
  subscriberCount: string
}

export enum QueryType {
  "video" = "EgIQAQ%3D%3D",
  "playlist" = "EgIQAw%3D%3D",
  "channel" = "EgIQAg%3D%3D",
}

export async function fetchYoutubeData(search: string, type?: QueryType) {
  const html = await getYoutubeSearchHtml(search, type);
  return getYtData(html);
}

export async function search(search: string, type?: QueryType): Promise<Video[]> {
  try {
    const ytData = await fetchYoutubeData(search, type);
    return parseYtData(ytData);
  } catch (error) {
    throw new Error(`Error during search: ${error.message}`);
  }
}

export function parseYtData(ytData: any) {
  // Livin' on the edge
  const contents = ytData?.contents?.sectionListRenderer?.contents;
  if (!Array.isArray(contents)) {
    throw new Error("Could not parse youtube results (unknown structure)");
  }

  const results = contents?.[0]?.itemSectionRenderer?.contents;
  if (results == null) {
    throw new Error("Could not parse youtube results (unknown structure)");
  }

  return results.map((r: any) => {
    if (r["compactVideoRenderer"]) {
      return video(r.compactVideoRenderer);
    }
    if (r["compactPlaylistRenderer"]) {
      return playlist(r.compactPlaylistRenderer);
    }
    if (r["compactChannelRenderer"]) {
      return channel(r.compactChannelRenderer);
    }
  }).filter(Boolean);
}

function video(renderer: any): Video {
  return {
    videoId: renderer.videoId,
    title: getProperty(renderer, "title", "?"),
    viewCount: getProperty(renderer, "viewCountText", "0 views"),
    shortViewCount: getProperty(renderer, "shortViewCountText", "0 views"),
    length: getProperty(renderer, "lengthText", "live"),
    longByline: getProperty(renderer, "longBylineText", "?"),
    shortByline: getProperty(renderer, "shortBylineText", "?"),
    publishedTime: getProperty(renderer, "publishedTimeText", "?"),
  }
}

function playlist(renderer: any): Playlist {
  return {
    playlistId: renderer.playlistId,
    title: getProperty(renderer, "title", "?"),
    longByline: getProperty(renderer, "longBylineText", "?"),
    shortByline: getProperty(renderer, "shortBylineText", "?"),
    publishedTime: getProperty(renderer, "publishedTimeText", "?"),
    videoCount: getProperty(renderer, "videoCountText", "0")
  }
}
function channel(renderer: any): Channel {
  return {
    channelId: renderer.channelId,
    title: getProperty(renderer, "title", "?"),
    videoCount: getProperty(renderer, "videoCountText", "0"),
    displayName: getProperty(renderer, "displayName", "?"),
    subscriberCount: getProperty(renderer, "subscriberCountText", "0 subscribers")
  }
}

function getProperty(r: any, property: string, defaultValue: string) {
  return r[property]?.runs?.[0]?.text ?? defaultValue;
}

async function getYoutubeSearchHtml(search: string, type?: QueryType): Promise<string> {
  const url = new URL("https://m.youtube.com/results");
  url.searchParams.set("search_query", search)
  url.searchParams.set("hl", "en")
  if (type != null) {
    url.searchParams.set("sp", type)
  }

  const response = await got(url, {headers});
  return response.body;
}

/**
 * From the html string of a youtube result page,
 * returns the ytInitialData json object that contains
 * the search results
 */
function getYtData(html: string): any {
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

  return JSON.parse(eval(node));
}
