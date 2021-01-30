import {readFileSync} from "fs";
import {parseYtData} from "../../src/search/search";

test("parse videos",() => {

  const ytData = JSON.parse(readFileSync("test/ytData/video.json").toString());
  const result = parseYtData(ytData);

  expect(result.length).toEqual(20);
})

test("parse playlist",() => {

  const ytData = JSON.parse(readFileSync("test/ytData/playlist.json").toString());
  const result = parseYtData(ytData);

  expect(result.length).toEqual(20);
})
