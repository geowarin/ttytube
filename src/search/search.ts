import got from "got";
import { load } from "cheerio";

const headers = {
    "User-Agent": "Mozilla/5.0 (Android 10; Tablet; rv:82.0) Gecko/82.0 Firefox/82.0,gzip(gfe)"
};

export interface SearchResult {
    videoId: string
    title: string
    viewCount: string
    length: string
    author: string
}

export async function search(search: string): Promise<SearchResult[]> {
    try {
        const url = `https://m.youtube.com/results?search_query=${search}&hl=en&sp=EgIQAQ%253D%253D`;
        const response = await got(url, { headers });

        const $ = load(response.body);
        var scripts = $('script:not([src])');

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
          throw new Error("Could not parse youtube results");
        }

        const ytData = JSON.parse(eval(node));
        const results = ytData.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents;

        return results.map((r: any) => {
            return {
                videoId: r.compactVideoRenderer.videoId,
                title: r.compactVideoRenderer.title.runs[0].text,
                viewCount: r.compactVideoRenderer.viewCountText.runs[0].text,
                length: r.compactVideoRenderer.lengthText.runs[0].text,
                author: r.compactVideoRenderer.longBylineText.runs[0].text,
            }
        });
    } catch (error) {
        throw new Error(`Error during search: ${error.message}`);
    }
}
