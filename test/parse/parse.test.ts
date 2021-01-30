import {readFileSync} from "fs";
import {Channel, parseYtData, Playlist, Video} from "../../src/search/search";

test("parse videos",() => {
  const ytData = JSON.parse(readFileSync("test/ytData/video.json").toString());
  const result: Video[] = parseYtData(ytData);

  expect(result.length).toEqual(20);
  expect(result.every(p => p.videoId != null)).toBeTruthy();
});

test("parse videos did you mean",() => {
  const ytData = JSON.parse(readFileSync("test/ytData/didYouMean.json").toString());
  const result: Video[] = parseYtData(ytData);

  expect(result.length).toEqual(20);
  expect(result.every(p => p.videoId != null)).toBeTruthy();
});

test("parse playlist",() => {
  const ytData = JSON.parse(readFileSync("test/ytData/playlist.json").toString());
  const result: Playlist[] = parseYtData(ytData);

  expect(result.length).toEqual(20);
  expect(result.every(p => p.playlistId != null)).toBeTruthy();
});

test("parse channel",() => {
  const ytData = JSON.parse(readFileSync("test/ytData/channel.json").toString());
  const result: Channel[] = parseYtData(ytData);

  expect(result.length).toEqual(20);
  expect(result.every(p => p.channelId != null)).toBeTruthy();
});
