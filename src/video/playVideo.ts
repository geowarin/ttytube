import execa = require("execa");

export async function playVideo(videoId: string, title?: string): Promise<execa.ExecaChildProcess> {
  try {

    const args = [
      `https://www.youtube.com/watch?v=${videoId}`,
      `--really-quiet`,
    ];
    if (title != null) {
      args.push(`--force-media-title="${title}"`)
    }

    return await execa('mpv', args);
  } catch (error) {
    throw new Error(`Error while playing video ${error}`)
  }
};
